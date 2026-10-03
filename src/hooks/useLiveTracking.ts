/**
 * Real-time Live Tracking & Multi-Tab Simulation Hook for HappyPaw
 * Features:
 * - GPS watchPosition with device heading
 * - Smooth Turn-by-Turn Route Simulation with variable speed (1x, 2x, 5x, 10x)
 * - Cross-tab synchronization via BroadcastChannel('happypaw_live_tracking') + localStorage fallback
 * - Real-time ETA, remaining distance and progress tracking
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { haversineDistance } from "@/utils/geoConverter"

export interface LiveTrackingMessage {
  type: "START_TRACKING" | "POS_UPDATE" | "STOP_TRACKING" | "ARRIVED"
  caseId: string
  coords: [number, number] // [lng, lat]
  heading: number
  distanceKm: number
  etaMinutes: number
  progressPercent: number
  timestamp: number
  rescuerId?: string
}

export function calculateBearing(start: [number, number], end: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const [lon1, lat1] = start
  const [lon2, lat2] = end
  const dLon = toRad(lon2 - lon1)
  const y = Math.sin(dLon) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)
  return Math.round((toDeg(Math.atan2(y, x)) + 360) % 360)
}

export interface UseLiveTrackingOptions {
  caseId?: string
  isViewer?: boolean
  rescuerId?: string
}

export function useLiveTracking(opts: UseLiveTrackingOptions = {}) {
  const { caseId, isViewer: _isViewer = false, rescuerId = "r1" } = opts

  const [isLive, setIsLive] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rescuerPos, setRescuerPos] = useState<[number, number] | null>(null)
  const [heading, setHeading] = useState(0)
  const [speedMultiplier, setSpeedMultiplier] = useState(2)
  const [progressPercent, setProgressPercent] = useState(0)
  const [remainingDistanceKm, setRemainingDistanceKm] = useState(0)
  const [remainingEtaMinutes, setRemainingEtaMinutes] = useState(0)
  const [hasArrived, setHasArrived] = useState(false)

  const watchIdRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const routePointsRef = useRef<[number, number][]>([])
  const currentIndexRef = useRef(0)
  const channelRef = useRef<BroadcastChannel | null>(null)

  // 1. Initialize BroadcastChannel and LocalStorage Listener for Cross-Tab Sync
  useEffect(() => {
    try {
      const bc = new BroadcastChannel("happypaw_live_tracking")
      channelRef.current = bc

      bc.onmessage = (event: MessageEvent<LiveTrackingMessage>) => {
        const msg = event.data
        if (!msg || (caseId && msg.caseId !== caseId)) return

        if (msg.type === "START_TRACKING" || msg.type === "POS_UPDATE") {
          setIsLive(true)
          setRescuerPos(msg.coords)
          setHeading(msg.heading)
          setRemainingDistanceKm(msg.distanceKm)
          setRemainingEtaMinutes(msg.etaMinutes)
          setProgressPercent(msg.progressPercent)
          setHasArrived(false)
        } else if (msg.type === "ARRIVED") {
          setIsLive(true)
          setRescuerPos(msg.coords)
          setRemainingDistanceKm(0)
          setRemainingEtaMinutes(0)
          setProgressPercent(100)
          setHasArrived(true)
        } else if (msg.type === "STOP_TRACKING") {
          setIsLive(false)
          setIsSimulating(false)
        }
      }
    } catch {
      // BroadcastChannel might not be supported in older envs
    }

    // Fallback: Check localStorage on mount for viewer mode
    if (caseId) {
      try {
        const stored = localStorage.getItem(`hp_live_${caseId}`)
        if (stored) {
          const msg = JSON.parse(stored) as LiveTrackingMessage
          // If stored less than 15 minutes ago
          if (Date.now() - msg.timestamp < 15 * 60 * 1000) {
            setIsLive(true)
            setRescuerPos(msg.coords)
            setHeading(msg.heading)
            setRemainingDistanceKm(msg.distanceKm)
            setRemainingEtaMinutes(msg.etaMinutes)
            setProgressPercent(msg.progressPercent)
            if (msg.type === "ARRIVED") setHasArrived(true)
          }
        }
      } catch {
        // Ignore localStorage error
      }
    }

    // Storage event for browsers that don't support BroadcastChannel
    const handleStorage = (e: StorageEvent) => {
      if (caseId && e.key === `hp_live_${caseId}` && e.newValue) {
        try {
          const msg = JSON.parse(e.newValue) as LiveTrackingMessage
          if (msg.type === "POS_UPDATE" || msg.type === "START_TRACKING") {
            setIsLive(true)
            setRescuerPos(msg.coords)
            setHeading(msg.heading)
            setRemainingDistanceKm(msg.distanceKm)
            setRemainingEtaMinutes(msg.etaMinutes)
            setProgressPercent(msg.progressPercent)
            setHasArrived(false)
          } else if (msg.type === "ARRIVED") {
            setHasArrived(true)
          }
        } catch {
          // Ignore
        }
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
      if (channelRef.current) {
        channelRef.current.close()
        channelRef.current = null
      }
    }
  }, [caseId])

  // Helper: Broadcast message to other tabs
  const broadcast = useCallback(
    (msg: LiveTrackingMessage) => {
      if (channelRef.current) {
        channelRef.current.postMessage(msg)
      }
      if (msg.caseId) {
        try {
          localStorage.setItem(`hp_live_${msg.caseId}`, JSON.stringify(msg))
        } catch {
          // Ignore quota errors
        }
      }
    },
    [],
  )

  // 2. Start Live Simulation along route points
  const startSimulation = useCallback(
    (
      targetCaseId: string,
      routePoints: [number, number][],
      initialDistanceKm = 3.5,
      initialEtaMinutes = 8,
    ) => {
      if (!routePoints || routePoints.length === 0) return

      // Stop existing timers
      if (timerRef.current) clearInterval(timerRef.current)

      routePointsRef.current = routePoints
      currentIndexRef.current = 0
      setIsSimulating(true)
      setIsPaused(false)
      setIsLive(true)
      setHasArrived(false)

      const startPos = routePoints[0]
      const nextPos = routePoints[1] || startPos
      const initHeading = calculateBearing(startPos, nextPos)

      setRescuerPos(startPos)
      setHeading(initHeading)
      setRemainingDistanceKm(initialDistanceKm)
      setRemainingEtaMinutes(initialEtaMinutes)
      setProgressPercent(0)

      broadcast({
        type: "START_TRACKING",
        caseId: targetCaseId,
        coords: startPos,
        heading: initHeading,
        distanceKm: initialDistanceKm,
        etaMinutes: initialEtaMinutes,
        progressPercent: 0,
        timestamp: Date.now(),
        rescuerId,
      })
    },
    [broadcast, rescuerId],
  )

  // Simulation tick effect
  useEffect(() => {
    if (!isSimulating || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const intervalMs = Math.max(100, Math.round(900 / speedMultiplier))
    const points = routePointsRef.current
    if (!points || points.length === 0) return

    timerRef.current = window.setInterval(() => {
      const idx = currentIndexRef.current
      if (idx >= points.length - 1) {
        // Destination arrived!
        const finalPos = points[points.length - 1]
        setRescuerPos(finalPos)
        setProgressPercent(100)
        setRemainingDistanceKm(0)
        setRemainingEtaMinutes(0)
        setHasArrived(true)
        setIsSimulating(false)
        if (timerRef.current) clearInterval(timerRef.current)

        if (caseId) {
          broadcast({
            type: "ARRIVED",
            caseId,
            coords: finalPos,
            heading: 0,
            distanceKm: 0,
            etaMinutes: 0,
            progressPercent: 100,
            timestamp: Date.now(),
            rescuerId,
          })
        }
        return
      }

      // Next step along route
      const nextIdx = idx + 1
      currentIndexRef.current = nextIdx
      const currentPos = points[nextIdx]
      const targetPos = points[points.length - 1]
      const prevPos = points[idx]

      const currentHeading = calculateBearing(prevPos, currentPos)
      const pct = Math.round((nextIdx / (points.length - 1)) * 100)

      // Remaining distance calculated to destination
      const remainingKm = Number(haversineDistance(currentPos, targetPos).toFixed(1))
      // Average 25km/h
      const remainingEta = Math.max(1, Math.round((remainingKm / 25) * 60))

      setRescuerPos(currentPos)
      setHeading(currentHeading)
      setProgressPercent(pct)
      setRemainingDistanceKm(remainingKm)
      setRemainingEtaMinutes(remainingEta)

      if (caseId) {
        broadcast({
          type: "POS_UPDATE",
          caseId,
          coords: currentPos,
          heading: currentHeading,
          distanceKm: remainingKm,
          etaMinutes: remainingEta,
          progressPercent: pct,
          timestamp: Date.now(),
          rescuerId,
        })
      }
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isSimulating, isPaused, speedMultiplier, caseId, broadcast, rescuerId])

  // 3. Start Real Device GPS Tracking
  const startLiveGps = useCallback(
    (targetCaseId: string, destCoord?: [number, number]) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported on this device")
        return
      }

      setIsLive(true)
      setIsSimulating(false)
      setHasArrived(false)

      // Listen for compass heading if device orientation is available
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) {
          setHeading(Math.round(360 - e.alpha))
        }
      }
      window.addEventListener("deviceorientation", handleOrientation)

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const currentPos: [number, number] = [
            Number(pos.coords.longitude.toFixed(6)),
            Number(pos.coords.latitude.toFixed(6)),
          ]
          const currentHeading = pos.coords.heading || 0
          setRescuerPos(currentPos)
          if (currentHeading) setHeading(Math.round(currentHeading))

          let distKm = 0
          let etaMin = 0
          if (destCoord) {
            distKm = Number(haversineDistance(currentPos, destCoord).toFixed(1))
            etaMin = Math.max(1, Math.round((distKm / 25) * 60))
            setRemainingDistanceKm(distKm)
            setRemainingEtaMinutes(etaMin)
          }

          broadcast({
            type: "POS_UPDATE",
            caseId: targetCaseId,
            coords: currentPos,
            heading: currentHeading,
            distanceKm: distKm,
            etaMinutes: etaMin,
            progressPercent: 50,
            timestamp: Date.now(),
            rescuerId,
          })
        },
        (err) => {
          console.warn("Geolocation watch error:", err.message)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 2000,
          timeout: 10000,
        },
      )
    },
    [broadcast, rescuerId],
  )

  // 4. Pause / Resume / Stop Controls
  const pauseSimulation = useCallback(() => setIsPaused(true), [])
  const resumeSimulation = useCallback(() => setIsPaused(false), [])

  const stopLiveTracking = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setIsLive(false)
    setIsSimulating(false)
    setIsPaused(false)

    if (caseId) {
      broadcast({
        type: "STOP_TRACKING",
        caseId,
        coords: rescuerPos || [0, 0],
        heading: 0,
        distanceKm: 0,
        etaMinutes: 0,
        progressPercent: progressPercent,
        timestamp: Date.now(),
        rescuerId,
      })
    }
  }, [caseId, broadcast, rescuerPos, progressPercent, rescuerId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return {
    isLive,
    isSimulating,
    isPaused,
    rescuerPos,
    heading,
    speedMultiplier,
    progressPercent,
    remainingDistanceKm,
    remainingEtaMinutes,
    hasArrived,
    setSpeedMultiplier,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    startLiveGps,
    stopLiveTracking,
  }
}
