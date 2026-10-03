/**
 * Real-world Routing Service for HappyPaw
 * Integrates OSRM Public Routing API with 3-tier resilience:
 * 1. OSRM API (real road geometry + steps)
 * 2. In-Memory & SessionStorage Cache (<10ms)
 * 3. Resilient Interpolated Fallback + 1-Click Google Maps Link
 */

import { haversineDistance } from "@/utils/geoConverter"

export type RoutingProfile = "driving" | "walking"

export interface RouteStep {
  instruction: string
  distance: number // meters
  duration: number // seconds
  name: string
  location: [number, number] // [lng, lat]
  type?: string
  modifier?: string
}

export interface RouteData {
  coordinates: [number, number][] // [[lng, lat], ...]
  distanceMeters: number
  distanceKm: number
  durationSeconds: number
  durationMinutes: number
  summary: string
  steps: RouteStep[]
  profile: RoutingProfile
  isFallback?: boolean
}

// In-memory cache for ultra-fast tab switches and repeated queries
const routeCache = new Map<string, RouteData>()

/**
 * Format meters to human-readable Vietnamese distance
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Format seconds to human-readable Vietnamese duration (ETA)
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 1) return "Dưới 1 phút"
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours} giờ`
  return `${hours} giờ ${remainingMinutes} phút`
}

/**
 * Generate Google Maps navigation URL for external app opening
 */
export function getGoogleMapsDirectionsUrl(
  start: [number, number],
  end: [number, number],
  profile: RoutingProfile = "driving",
): string {
  const [startLng, startLat] = start
  const [endLng, endLat] = end
  const mode = profile === "walking" ? "walking" : "driving"
  return `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=${mode}`
}

/**
 * Sanitize and format Vietnamese road names to prevent duplicates like "Phố Phố", "Phố Ngõ"
 */
export function formatStreetName(rawName: string): string {
  let clean = (rawName || "").trim()
  if (!clean) return "tuyến đường phía trước"

  // Remove duplicate prefixes frequently returned by OSRM
  clean = clean.replace(/^phố\s+(ngõ|ngách|hẻm|đường)\b/i, "$1")
  clean = clean.replace(/^đường\s+(ngõ|ngách|hẻm|phố)\b/i, "$1")
  clean = clean.replace(/^phố\s+phố\b/i, "Phố")
  clean = clean.replace(/^đường\s+đường\b/i, "Đường")

  // Check if it already has a recognized traffic prefix
  const prefixRegex = /^(phố|đường|ngõ|ngách|hẻm|đại lộ|quốc lộ|tỉnh lộ|cầu)\b/i
  if (prefixRegex.test(clean)) {
    return clean.charAt(0).toUpperCase() + clean.slice(1)
  }

  return `Đường ${clean}`
}

/**
 * Convert raw OSRM maneuver into natural Vietnamese instruction
 */
function translateManeuver(
  type: string,
  modifier: string | undefined,
  name: string,
  exit?: number,
): string {
  const street = formatStreetName(name)

  switch (type) {
    case "depart":
      return `Bắt đầu xuất phát trên ${street}`
    case "arrive":
      return name && name.trim()
        ? `Đã đến vị trí đích tại ${name}`
        : "Đã đến vị trí hiện trường"
    case "turn":
      switch (modifier) {
        case "left":
          return `Rẽ trái vào ${street}`
        case "right":
          return `Rẽ phải vào ${street}`
        case "slight left":
          return `Chếch sang trái vào ${street}`
        case "slight right":
          return `Chếch sang phải vào ${street}`
        case "sharp left":
          return `Rẽ gắt sang trái vào ${street}`
        case "sharp right":
          return `Rẽ gắt sang phải vào ${street}`
        case "straight":
          return `Đi thẳng qua ngã tư vào ${street}`
        case "uturn":
          return `Quay đầu xe trên ${street}`
        default:
          return `Rẽ vào ${street}`
      }
    case "new name":
    case "continue":
      return `Tiếp tục đi thẳng trên ${street}`
    case "roundabout":
    case "rotary":
      if (exit) {
        return `Vào vòng xuyến, theo lối ra thứ ${exit} vào ${street}`
      }
      return `Đi theo vòng xuyến vào ${street}`
    case "merge":
      return `Nhập làn vào ${street}`
    case "fork":
      return modifier === "left"
        ? `Tại ngã ba, rẽ sang nhánh trái vào ${street}`
        : `Tại ngã ba, rẽ sang nhánh phải vào ${street}`
    case "on ramp":
      return `Đi theo lối lên vào ${street}`
    case "off ramp":
      return `Đi theo lối ra vào ${street}`
    default:
      if (modifier) {
        return `Chuyển hướng ${modifier} vào ${street}`
      }
      return `Tiếp tục di chuyển trên ${street}`
  }
}

/**
 * Generate synthetic interpolated route points when offline or OSRM unavailable
 */
function generateFallbackRoute(
  start: [number, number],
  end: [number, number],
  profile: RoutingProfile,
): RouteData {
  const [lng1, lat1] = start
  const [lng2, lat2] = end

  // Direct haversine distance + 35% urban detour factor for Hanoi grid
  const directDistanceKm = haversineDistance(start, end)
  const realisticKm = Number((directDistanceKm * 1.35).toFixed(1))
  const distanceMeters = Math.round(realisticKm * 1000)

  // Average speed: Driving (Motorbike) ~25km/h, Walking ~4.5km/h
  const avgSpeedKmh = profile === "walking" ? 4.5 : 24
  const durationMinutes = Math.max(2, Math.round((realisticKm / avgSpeedKmh) * 60))
  const durationSeconds = durationMinutes * 60

  // Generate 8 smooth intermediate waypoints following a gentle natural curve
  const stepsCount = 10
  const coordinates: [number, number][] = []

  // Perpendicular offset for curved route
  const dx = lng2 - lng1
  const dy = lat2 - lat1
  const perpX = -dy * 0.12
  const perpY = dx * 0.12

  for (let i = 0; i <= stepsCount; i++) {
    const t = i / stepsCount
    const curveFactor = Math.sin(t * Math.PI)
    const lng = lng1 + t * dx + perpX * curveFactor
    const lat = lat1 + t * dy + perpY * curveFactor
    coordinates.push([Number(lng.toFixed(6)), Number(lat.toFixed(6))])
  }

  const steps: RouteStep[] = [
    {
      instruction: "Khởi hành từ vị trí hiện tại của bạn",
      distance: Math.round(distanceMeters * 0.25),
      duration: Math.round(durationSeconds * 0.25),
      name: "Tuyến đường chính",
      location: start,
    },
    {
      instruction: "Tiếp tục di chuyển theo trục đường chính hướng về hiện trường",
      distance: Math.round(distanceMeters * 0.5),
      duration: Math.round(durationSeconds * 0.5),
      name: "Khu vực tiếp cận",
      location: coordinates[5],
    },
    {
      instruction: "Rẽ vào tuyến đường tiếp cận thú cưng",
      distance: Math.round(distanceMeters * 0.25),
      duration: Math.round(durationSeconds * 0.25),
      name: "Điểm cứu hộ",
      location: coordinates[8],
    },
    {
      instruction: "Đã đến khu vực thú cưng cần cứu hộ / chăm sóc",
      distance: 0,
      duration: 0,
      name: "Hiện trường",
      location: end,
    },
  ]

  return {
    coordinates,
    distanceMeters,
    distanceKm: realisticKm,
    durationSeconds,
    durationMinutes,
    summary: "Lộ trình nội suy (Ngoại tuyến)",
    steps,
    profile,
    isFallback: true,
  }
}

/**
 * Fetch real-world routing geometry & steps from OSRM Public API
 */
export async function fetchRoute(
  start: [number, number], // [lng, lat]
  end: [number, number], // [lng, lat]
  profile: RoutingProfile = "driving",
): Promise<RouteData> {
  const cacheKey = `${profile}:${start[0].toFixed(4)},${start[1].toFixed(4)}->${end[0].toFixed(4)},${end[1].toFixed(4)}`

  // 1. Check in-memory cache
  const cached = routeCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // 2. Check sessionStorage
  try {
    const sessionItem = sessionStorage.getItem(`hp_route_${cacheKey}`)
    if (sessionItem) {
      const parsed = JSON.parse(sessionItem) as RouteData
      routeCache.set(cacheKey, parsed)
      return parsed
    }
  } catch {
    // SessionStorage may fail in private mode
  }

  // 3. Call OSRM Public API with timeout
  const [startLng, startLat] = start
  const [endLng, endLat] = end
  const osrmProfile = profile === "walking" ? "foot" : "car"
  const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4500)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new Error(`OSRM API error status: ${res.status}`)
    }

    const data = await res.json()
    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found in OSRM response")
    }

    const primaryRoute = data.routes[0]
    const coords: [number, number][] = primaryRoute.geometry.coordinates
    const distanceMeters = Math.round(primaryRoute.distance)
    const distanceKm = Number((distanceMeters / 1000).toFixed(1))
    const durationSeconds = Math.round(primaryRoute.duration)
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60))

    // Parse legs & steps
    const steps: RouteStep[] = []
    const leg = primaryRoute.legs?.[0]
    if (leg && Array.isArray(leg.steps)) {
      for (const s of leg.steps) {
        const maneuver = s.maneuver || {}
        const instruction = translateManeuver(
          maneuver.type,
          maneuver.modifier,
          s.name,
          maneuver.exit,
        )
        steps.push({
          instruction,
          distance: Math.round(s.distance || 0),
          duration: Math.round(s.duration || 0),
          name: s.name || "",
          location: maneuver.location || coords[0],
          type: maneuver.type,
          modifier: maneuver.modifier,
        })
      }
    }

    // Build route summary string
    const significantStreets = steps
      .map((s) => formatStreetName(s.name))
      .filter(
        (n, idx, arr) =>
          n.length > 0 &&
          n !== "tuyến đường phía trước" &&
          arr.indexOf(n) === idx,
      )
      .slice(0, 2)

    const summary =
      significantStreets.length > 0
        ? `Qua ${significantStreets.join(" & ")}`
        : profile === "walking"
          ? "Tuyến đường đi bộ ngắn nhất"
          : "Tuyến đường tối ưu"

    const result: RouteData = {
      coordinates: coords,
      distanceMeters,
      distanceKm,
      durationSeconds,
      durationMinutes,
      summary,
      steps: steps.length > 0 ? steps : [
        {
          instruction: "Tiến thẳng theo lộ trình hướng dẫn",
          distance: distanceMeters,
          duration: durationSeconds,
          name: summary,
          location: coords[0],
        },
      ],
      profile,
      isFallback: false,
    }

    // Save to caches
    routeCache.set(cacheKey, result)
    try {
      sessionStorage.setItem(`hp_route_${cacheKey}`, JSON.stringify(result))
    } catch {
      // Ignore sessionStorage quotas
    }

    return result
  } catch (error) {
    clearTimeout(timeoutId)
    console.warn("OSRM routing unavailable, using resilient fallback:", error)
    const fallback = generateFallbackRoute(start, end, profile)
    routeCache.set(cacheKey, fallback)
    return fallback
  }
}
