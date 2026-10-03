import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react"
import maplibregl from "@openmapvn/openmapvn-gl"
import {
  Plus,
  Minus,
  LocateFixed,
  ChevronDown,
  ChevronUp,
  PawPrint,
} from "lucide-react"
import type { Case, Clinic, Risk, Shelter } from "@/types"
import { Btn, IconBtn, cx } from "@ui"
import {
  xyToLngLat,
  lngLatToXY,
  kmFromGeo,
  createGeoJSONCircle,
  HANOI_CENTER,
} from "@/utils/geoConverter"

export const ME_POS = { x: 345, y: 285 }
export const KM = 62 // Map units per km (kept for backwards compatibility)

export type PinKind = "case" | "shelter" | "clinic" | "risk"
export interface Sel {
  kind: PinKind
  id: string
}

export type PinType = "rescue" | "lost" | "shelter" | "clinic" | "warning"
export const PIN_META: Record<
  PinType,
  {
    color: string
    label: string
    shape: "drop" | "square" | "tri"
  }
> = {
  rescue: { color: "#d8503f", label: "Cần cứu hộ", shape: "drop" },
  lost: { color: "#e8892c", label: "Pet thất lạc", shape: "drop" },
  shelter: { color: "#6fae5c", label: "Mái ấm", shape: "square" },
  clinic: { color: "#4f93b5", label: "Phòng khám", shape: "square" },
  warning: { color: "#8a63ab", label: "Cảnh báo", shape: "tri" },
}

export const caseType = (c: Case): PinType =>
  c.type === "rescue" ? "rescue" : "lost"

const SHAPE = {
  drop: {
    d: "M0 0C-6 -8 -18 -16 -18 -30A18 18 0 1 1 18 -30C18 -16 6 -8 0 0Z",
    gy: -30,
  },
  square: {
    d: "M0 0L-6 -9H-12A6 6 0 0 1 -18 -15V-43A6 6 0 0 1 -12 -49H12A6 6 0 0 1 18 -43V-15A6 6 0 0 1 12 -9H6Z",
    gy: -29,
  },
  tri: { d: "M0 0L-6 -7L-21 -7L0 -47L21 -7L6 -7Z", gy: -22 },
}
const TEAR = SHAPE.drop.d

function pawSvg(s = 1, fill = "#fff") {
  return `<g transform="scale(${s})" fill="${fill}">
    <ellipse cx="-8" cy="-3" rx="2.6" ry="3.4" transform="rotate(-20 -8 -3)" />
    <ellipse cx="-3.2" cy="-8" rx="2.6" ry="3.5" transform="rotate(-6 -3.2 -8)" />
    <ellipse cx="3.2" cy="-8" rx="2.6" ry="3.5" transform="rotate(6 3.2 -8)" />
    <ellipse cx="8" cy="-3" rx="2.6" ry="3.4" transform="rotate(20 8 -3)" />
    <path d="M0 -1.5c-4 0-8 4.5-8 7.6 0 2.4 2 3.4 3.6 3.4 1.5 0 2.6-.7 4.4-.7s2.9.7 4.4.7c1.6 0 3.6-1 3.6-3.4 0-3.1-4-7.6-8-7.6z" />
  </g>`
}

function glyphHtml(type: PinType, color: string) {
  switch (type) {
    case "rescue":
      return pawSvg(1, "#fff")
    case "lost":
      return `<g>
        <circle cx="-2" cy="-2" r="7" fill="none" stroke="#fff" stroke-width="3" />
        <path d="M3 3 L9 9" stroke="#fff" stroke-width="3.4" stroke-linecap="round" />
        <g transform="translate(-2 -1.5)">${pawSvg(0.4, "#fff")}</g>
      </g>`
    case "shelter":
      return `<g>
        <path d="M-10 4V-3L0 -11L10 -3V4Z" fill="#fff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
        <g transform="translate(0 0.5)">${pawSvg(0.42, color)}</g>
      </g>`
    case "clinic":
      return `<path d="M-3.5 -10h7v6.5h6.5v7h-6.5v6.5h-7v-6.5h-6.5v-7h6.5z" fill="#fff" stroke="#fff" stroke-width="1" stroke-linejoin="round" />`
    default:
      return `<g>
        <rect x="-2" y="-11" width="4" height="10" rx="2" fill="#fff" />
        <circle cy="5" r="2.3" fill="#fff" />
      </g>`
  }
}

function hashOff(id: string) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 997
  return [(h % 24) - 12, ((h >> 3) % 24) - 12]
}

const ago = (m: number) =>
  m < 60
    ? `${m} phút trước`
    : m < 1440
      ? `${Math.round(m / 60)} giờ trước`
      : `${Math.round(m / 1440)} ngày trước`

export interface MapApi {
  zoom: (f: number) => void
  locate: () => void
  focus: (x: number, y: number, k?: number) => void
}

export interface CityMapProps {
  className?: string
  cases?: Case[]
  shelters?: Shelter[]
  clinics?: Clinic[]
  risks?: Risk[]
  selected?: Sel | null
  onSelect?: (s: Sel | null) => void
  radius?: { x: number; y: number; km: number } | null
  route?: { x: number; y: number }[]
  trail?: { x: number; y: number; t: string }[]
  predicted?: { x: number; y: number; r: number } | null
  me?: { x: number; y: number } | null
  dest?: { x: number; y: number; label?: string } | null
  revealIds?: string[]
  center?: { x: number; y: number; k?: number }
  onMapClick?: (x: number, y: number) => void
  dropPin?: { x: number; y: number } | null
  extras?: ReactNode
  controlsClass?: string
  loading?: boolean
  showLabels?: boolean
  hoverId?: string | null
  onHover?: (id: string | null) => void
  controls?: boolean
  apiRef?: MutableRefObject<MapApi | null>
  focusKey?: string
}

export default function CityMap(p: CityMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [hov, setHov] = useState<string | null>(null)

  const sel = p.selected
  const hoverNow = p.hoverId ?? hov

  // 1. Initialize OpenMapVN GL
  useEffect(() => {
    if (!containerRef.current) return

    const initialCenter = p.center
      ? xyToLngLat(p.center.x, p.center.y)
      : HANOI_CENTER
    const initialZoom = p.center?.k
      ? Math.max(10, Math.min(18, 12.5 + (p.center.k - 1) * 2.5))
      : 13.5

    const apiKey = import.meta.env.VITE_OPENMAP_API_KEY
    const styleUrl = apiKey
      ? `https://maptiles.ndamaps.vn/styles/day-v2/style.json?apikey=${apiKey}`
      : "https://tiles.openmap.vn/styles/day-v1/style.json"

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    })

    map.on("load", () => {
      setMapLoaded(true)
    })

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat
      const xy = lngLatToXY(lng, lat)
      if (p.onMapClick) {
        p.onMapClick(xy.x, xy.y)
      } else {
        p.onSelect?.(null)
      }
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      setMapLoaded(false)
    }
  }, [])

  // 2. Handle Focus Key & Center Updates
  useEffect(() => {
    if (!mapRef.current || !p.center) return
    const target = xyToLngLat(p.center.x, p.center.y)
    const zoom = p.center.k
      ? Math.max(10, Math.min(18, 12.5 + (p.center.k - 1) * 2.5))
      : 14
    mapRef.current.flyTo({ center: target, zoom, duration: 800 })
  }, [p.focusKey, p.center?.x, p.center?.y, p.center?.k])

  // 3. Expose MapApi ref
  const zoomAt = useCallback((f: number) => {
    if (!mapRef.current) return
    if (f > 1) {
      mapRef.current.zoomIn()
    } else {
      mapRef.current.zoomOut()
    }
  }, [])

  const locateUser = useCallback(() => {
    if (!mapRef.current) return
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLngLat: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ]
          mapRef.current?.flyTo({ center: userLngLat, zoom: 15, duration: 1000 })
        },
        () => {
          // Fallback to configured me position
          const fallback = xyToLngLat(
            (p.me || ME_POS).x,
            (p.me || ME_POS).y,
          )
          mapRef.current?.flyTo({ center: fallback, zoom: 14.5, duration: 1000 })
        },
        { enableHighAccuracy: true, timeout: 4000 },
      )
    } else {
      const fallback = xyToLngLat((p.me || ME_POS).x, (p.me || ME_POS).y)
      mapRef.current.flyTo({ center: fallback, zoom: 14.5, duration: 1000 })
    }
  }, [p.me])

  useEffect(() => {
    if (p.apiRef) {
      p.apiRef.current = {
        zoom: zoomAt,
        locate: locateUser,
        focus: (x, y, kk) => {
          if (!mapRef.current) return
          const target = xyToLngLat(x, y)
          const zoom = kk ? 12.5 + (kk - 1) * 2.5 : 14.5
          mapRef.current.flyTo({ center: target, zoom, duration: 900 })
        },
      }
    }
  }, [zoomAt, locateUser, p.apiRef])

  // 4. Render Markers (Cases, Shelters, Clinics, Risks, User, DropPin, Dest)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear existing DOM markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const addMarker = ({
      lngLat,
      type,
      id,
      kind,
      label,
      sub,
      selected,
      hovered,
      pulse,
      progress,
      onClick,
    }: {
      lngLat: [number, number]
      type: PinType
      id?: string
      kind?: PinKind
      label?: string
      sub?: string
      selected?: boolean
      hovered?: boolean
      pulse?: boolean
      progress?: boolean
      onClick?: () => void
    }) => {
      const m = PIN_META[type]
      const sh = SHAPE[m.shape]

      const el = document.createElement("div")
      el.className = "happypaw-marker group relative cursor-pointer select-none"
      el.style.width = "40px"
      el.style.height = "52px"

      // Scale up if selected or hovered
      const scale = selected ? 1.25 : hovered ? 1.12 : 1
      el.style.transform = `scale(${scale})`
      el.style.zIndex = selected ? "100" : hovered ? "80" : "10"

      const pulseHtml = pulse
        ? `<div class="happypaw-pulse absolute rounded-full pointer-events-none" style="width: 42px; height: 42px; left: -1px; top: ${sh.gy + 10}px; background: ${m.color}; opacity: 0.5;"></div>`
        : ""

      const selectedHalo = selected
        ? `<circle cy="${sh.gy}" r="27" fill="#fff27a" opacity="0.75" />`
        : ""

      const progressHtml = progress
        ? `<g transform="translate(15, -46)">
            <circle r="8" fill="#f6e04d" stroke="#6b4128" stroke-width="2.2" />
            <path d="M0 -4V0.5L3 2" fill="none" stroke="#6b4128" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>`
        : ""

      const tooltipHtml = label
        ? `<div class="happypaw-tooltip pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-xl border-2 border-line bg-paper px-3 py-1 shadow-md text-center whitespace-nowrap transition-all duration-150 ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }">
            <div class="text-xs font-black text-brown font-display">${label}</div>
            ${sub ? `<div class="text-[10px] font-bold text-brown-soft">${sub}</div>` : ""}
          </div>`
        : ""

      el.innerHTML = `
        ${pulseHtml}
        <svg viewBox="-24 -54 48 58" class="size-full overflow-visible drop-shadow-sm transition-transform">
          <ellipse cy="1" rx="8" ry="2.6" fill="#6b4128" opacity="0.25" />
          ${selectedHalo}
          <path d="${sh.d}" fill="${m.color}" stroke="#6b4128" stroke-width="3" stroke-linejoin="round" />
          <g transform="translate(0, ${sh.gy})">${glyphHtml(type, m.color)}</g>
          ${progressHtml}
        </svg>
        ${tooltipHtml}
      `

      el.addEventListener("click", (e) => {
        e.stopPropagation()
        onClick?.()
      })

      el.addEventListener("mouseenter", () => {
        if (id) {
          setHov(id)
          p.onHover?.(id)
        }
      })

      el.addEventListener("mouseleave", () => {
        if (id) {
          setHov(null)
          p.onHover?.(null)
        }
      })

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(lngLat)
        .addTo(map)

      markersRef.current.push(marker)
    }

    // Shelters
    for (const s of p.shelters || []) {
      const isSelected = sel?.kind === "shelter" && sel?.id === s.id
      const isHov = hoverNow === s.id
      addMarker({
        lngLat: xyToLngLat(s.x, s.y),
        type: "shelter",
        id: s.id,
        kind: "shelter",
        label: s.name,
        sub: `Mái ấm · ${s.district}`,
        selected: isSelected,
        hovered: isHov,
        onClick: () => p.onSelect?.({ kind: "shelter", id: s.id }),
      })
    }

    // Clinics
    for (const c of p.clinics || []) {
      const isSelected = sel?.kind === "clinic" && sel?.id === c.id
      const isHov = hoverNow === c.id
      addMarker({
        lngLat: xyToLngLat(c.x, c.y),
        type: "clinic",
        id: c.id,
        kind: "clinic",
        label: c.name,
        sub: `Phòng khám · ${c.district}`,
        selected: isSelected,
        hovered: isHov,
        onClick: () => p.onSelect?.({ kind: "clinic", id: c.id }),
      })
    }

    // Cases
    for (const c of p.cases || []) {
      const isSelected = sel?.kind === "case" && sel?.id === c.id
      const isHov = hoverNow === c.id
      const isCritical =
        c.critical &&
        c.status === "active" &&
        !(p.revealIds || []).includes(c.id)

      const [ox, oy] = isCritical ? hashOff(c.id) : [0, 0]
      const [lng, lat] = xyToLngLat(c.x + ox, c.y + oy)
      const prog = c.status === "progress" || c.status === "pending"

      addMarker({
        lngLat: [lng, lat],
        type: caseType(c),
        id: c.id,
        kind: "case",
        label: isCritical
          ? `${c.name} · khu vực xấp xỉ`
          : `${c.name} · ${c.district}`,
        sub: `${prog ? "Đang xử lý" : PIN_META[caseType(c)].label} · ${ago(c.minutesAgo)}`,
        selected: isSelected,
        hovered: isHov,
        pulse: isCritical || c.type === "rescue",
        progress: prog,
        onClick: () => p.onSelect?.({ kind: "case", id: c.id }),
      })
    }

    // User location (me)
    if (p.me || ME_POS) {
      const pos = p.me || ME_POS
      const userLngLat = xyToLngLat(pos.x, pos.y)
      const el = document.createElement("div")
      el.className = "relative flex items-center justify-center select-none pointer-events-none"
      el.style.width = "40px"
      el.style.height = "40px"
      el.innerHTML = `
        <div class="happypaw-pulse absolute size-9 rounded-full bg-sky-2/40"></div>
        <div class="size-4.5 rounded-full bg-sky-2 border-2.5 border-white shadow-md"></div>
      `
      const meMarker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat(userLngLat)
        .addTo(map)
      markersRef.current.push(meMarker)
    }

    // Drop Pin (when user clicks on map or places a pin)
    if (p.dropPin) {
      const dropLngLat = xyToLngLat(p.dropPin.x, p.dropPin.y)
      addMarker({
        lngLat: dropLngLat,
        type: "lost",
        selected: true,
        label: "Điểm đã chọn",
      })
    }

    // Destination Pin (dest)
    if (p.dest) {
      const destLngLat = xyToLngLat(p.dest.x, p.dest.y)
      const el = document.createElement("div")
      el.className = "relative cursor-pointer select-none"
      el.style.width = "36px"
      el.style.height = "46px"
      el.innerHTML = `
        <svg viewBox="-24 -54 48 58" class="size-full overflow-visible drop-shadow-sm">
          <ellipse cy="1" rx="8" ry="2.6" fill="#6b4128" opacity="0.25" />
          <path d="${TEAR}" fill="#a9cc94" stroke="#6b4128" stroke-width="3.5" />
          <g transform="translate(0, -30)">
            <path d="M-9 1 V-4 L0 -11 L9 -4 V1Z" fill="#fff" stroke="#6b4128" stroke-width="1.8" stroke-linejoin="round" />
          </g>
        </svg>
      `
      const destMarker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(destLngLat)
        .addTo(map)
      markersRef.current.push(destMarker)
    }

    // Trail timestamps
    if (p.trail && p.trail.length > 0) {
      p.trail.forEach((pt) => {
        const ptLngLat = xyToLngLat(pt.x, pt.y)
        const el = document.createElement("div")
        el.className = "pointer-events-none select-none flex flex-col items-center"
        el.innerHTML = `
          <div class="px-1.5 py-0.5 rounded-md bg-paper border border-brown text-[10px] font-black text-brown shadow-sm leading-none mb-1">
            ${pt.t}
          </div>
          <div class="size-3 rounded-full bg-butter border-2 border-brown"></div>
        `
        const m = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat(ptLngLat)
          .addTo(map)
        markersRef.current.push(m)
      })
    }
  }, [
    mapLoaded,
    p.cases,
    p.shelters,
    p.clinics,
    sel,
    hoverNow,
    p.revealIds,
    p.me,
    p.dropPin,
    p.dest,
    p.trail,
  ])

  // 5. Render GeoJSON Vector Layers (Radius, Risks, Predicted, Trail, Route)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    // Helper to safely update or add GeoJSON source and layer
    const updateSource = (
      id: string,
      data: GeoJSON.FeatureCollection | GeoJSON.Feature,
    ) => {
      const src = map.getSource(id) as maplibregl.GeoJSONSource | undefined
      if (src) {
        src.setData(data)
      } else {
        map.addSource(id, { type: "geojson", data })
      }
    }

    // 5.1 Search Radius Circle
    if (p.radius) {
      const center = xyToLngLat(p.radius.x, p.radius.y)
      const circleGeoJSON = createGeoJSONCircle(center, p.radius.km)
      updateSource("search-radius-source", circleGeoJSON)

      if (!map.getLayer("search-radius-fill")) {
        map.addLayer({
          id: "search-radius-fill",
          type: "fill",
          source: "search-radius-source",
          paint: {
            "fill-color": "#f6e04d",
            "fill-opacity": 0.18,
          },
        })
        map.addLayer({
          id: "search-radius-line",
          type: "line",
          source: "search-radius-source",
          paint: {
            "line-color": "#6b4128",
            "line-width": 2.2,
            "line-dasharray": [3, 3],
          },
        })
      }
    } else {
      if (map.getLayer("search-radius-fill")) map.removeLayer("search-radius-fill")
      if (map.getLayer("search-radius-line")) map.removeLayer("search-radius-line")
      if (map.getSource("search-radius-source")) map.removeSource("search-radius-source")
    }

    // 5.2 Predicted Zone
    if (p.predicted) {
      const center = xyToLngLat(p.predicted.x, p.predicted.y)
      const radiusKm = p.predicted.r / KM
      const circleGeoJSON = createGeoJSONCircle(center, radiusKm)
      updateSource("predicted-source", circleGeoJSON)

      if (!map.getLayer("predicted-fill")) {
        map.addLayer({
          id: "predicted-fill",
          type: "fill",
          source: "predicted-source",
          paint: {
            "fill-color": "#fff27a",
            "fill-opacity": 0.35,
          },
        })
        map.addLayer({
          id: "predicted-line",
          type: "line",
          source: "predicted-source",
          paint: {
            "line-color": "#e8892c",
            "line-width": 2.5,
            "line-dasharray": [3, 2],
          },
        })
      }
    } else {
      if (map.getLayer("predicted-fill")) map.removeLayer("predicted-fill")
      if (map.getLayer("predicted-line")) map.removeLayer("predicted-line")
      if (map.getSource("predicted-source")) map.removeSource("predicted-source")
    }

    // 5.3 Risk Zones
    if (p.risks && p.risks.length > 0) {
      const riskFeatures: GeoJSON.Feature[] = p.risks.map((r) => {
        const center = xyToLngLat(r.x, r.y)
        const radiusKm = r.r / KM
        const circle = createGeoJSONCircle(center, radiusKm)
        circle.properties = {
          id: r.id,
          color: r.severity === "Cao" ? "#d8503f" : "#8a63ab",
          opacity: sel?.id === r.id ? 0.35 : 0.2,
        }
        return circle
      })

      const featureCollection: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: riskFeatures,
      }
      updateSource("risk-zones-source", featureCollection)

      if (!map.getLayer("risk-zones-fill")) {
        map.addLayer({
          id: "risk-zones-fill",
          type: "fill",
          source: "risk-zones-source",
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": ["get", "opacity"],
          },
        })
        map.addLayer({
          id: "risk-zones-line",
          type: "line",
          source: "risk-zones-source",
          paint: {
            "line-color": ["get", "color"],
            "line-width": 2.5,
            "line-dasharray": [4, 3],
          },
        })
      }
    } else {
      if (map.getLayer("risk-zones-fill")) map.removeLayer("risk-zones-fill")
      if (map.getLayer("risk-zones-line")) map.removeLayer("risk-zones-line")
      if (map.getSource("risk-zones-source")) map.removeSource("risk-zones-source")
    }

    // 5.4 Pet Trail
    if (p.trail && p.trail.length > 1) {
      const lineCoords = p.trail.map((pt) => xyToLngLat(pt.x, pt.y))
      const trailGeoJSON: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: lineCoords,
        },
        properties: {},
      }
      updateSource("pet-trail-source", trailGeoJSON)

      if (!map.getLayer("pet-trail-line")) {
        map.addLayer({
          id: "pet-trail-line",
          type: "line",
          source: "pet-trail-source",
          paint: {
            "line-color": "#6b4128",
            "line-width": 3,
            "line-dasharray": [3, 3],
          },
        })
      }
    } else {
      if (map.getLayer("pet-trail-line")) map.removeLayer("pet-trail-line")
      if (map.getSource("pet-trail-source")) map.removeSource("pet-trail-source")
    }

    // 5.5 Route
    if (p.route && p.route.length > 1) {
      const routeCoords = p.route.map((pt) => xyToLngLat(pt.x, pt.y))
      const routeGeoJSON: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: routeCoords,
        },
        properties: {},
      }
      updateSource("route-source", routeGeoJSON)

      if (!map.getLayer("route-line")) {
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route-source",
          paint: {
            "line-color": "#3f82a5",
            "line-width": 4,
            "line-dasharray": [4, 4],
          },
        })
      }
    } else {
      if (map.getLayer("route-line")) map.removeLayer("route-line")
      if (map.getSource("route-source")) map.removeSource("route-source")
    }
  }, [mapLoaded, p.radius, p.predicted, p.risks, p.trail, p.route, sel])

  return (
    <div className={cx("relative size-full overflow-hidden bg-map-sand", p.className)}>
      {/* MapLibre WebGL container */}
      <div ref={containerRef} className="size-full map-grab" />

      {p.extras}

      {/* Floating Map Controls */}
      {p.controls !== false && (
        <div
          className={cx(
            "absolute bottom-4 right-4 z-10 flex flex-col gap-2",
            p.controlsClass,
          )}
        >
          <IconBtn
            label="Phóng to"
            variant="default"
            size="md"
            onClick={() => zoomAt(1.3)}
            className="shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            <Plus className="size-5" />
          </IconBtn>
          <IconBtn
            label="Thu nhỏ"
            variant="default"
            size="md"
            onClick={() => zoomAt(0.77)}
            className="shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            <Minus className="size-5" />
          </IconBtn>
          <IconBtn
            label="Vị trí hiện tại"
            variant="primary"
            size="md"
            onClick={locateUser}
            className="shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            <LocateFixed className="size-5" />
          </IconBtn>
        </div>
      )}

      {/* Loading overlay */}
      {(p.loading || !mapLoaded) && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-cream/85 backdrop-blur-[2px] transition-opacity">
          <div className="flex flex-col items-center gap-2 font-extrabold text-brown">
            <PawPrint className="size-10 text-coral animate-bounce-soft" />
            Đang tải bản đồ số OpenMapVN…
          </div>
        </div>
      )}
    </div>
  )
}

const LEGEND: PinType[] = ["rescue", "lost", "shelter", "clinic", "warning"]

export function LegendSwatch({ type }: { type: PinType }) {
  const m = PIN_META[type]
  return (
    <span
      aria-hidden
      className={cx(
        "inline-block size-3.5 border-2 border-brown",
        m.shape === "drop" && "rounded-full",
        m.shape === "square" && "rounded-[4px]",
        m.shape === "tri" &&
          "rounded-[3px] [clip-path:polygon(50%_0,100%_100%,0_100%)]",
      )}
      style={{ background: m.color }}
    />
  )
}

export function MapLegend({
  className,
  defaultOpen = true,
  hidden = [],
  onToggle,
}: {
  className?: string
  defaultOpen?: boolean
  hidden?: PinType[]
  onToggle?: (t: PinType) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className={cx(
        "rounded-2xl border-2 border-line bg-paper/95 text-xs font-bold shadow-soft",
        className,
      )}
    >
      <Btn
        variant="ghost"
        size="sm"
        full
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="!justify-between !min-h-9 !px-3 !py-1.5 font-extrabold !border-0 hover:!bg-butter/30"
      >
        Chú giải
        {open ? (
          <ChevronUp className="size-3.5" />
        ) : (
          <ChevronDown className="size-3.5" />
        )}
      </Btn>
      {open && (
        <ul className="space-y-0.5 px-1.5 pb-1.5">
          {LEGEND.map((t) => {
            const off = hidden.includes(t)
            const row = (
              <>
                <LegendSwatch type={t} />
                <span className={cx(off && "line-through opacity-50")}>
                  {PIN_META[t].label}
                </span>
              </>
            )
            return (
              <li key={t}>
                {onToggle ? (
                  <Btn
                    variant="ghost"
                    size="sm"
                    full
                    onClick={() => onToggle(t)}
                    aria-pressed={!off}
                    className="!justify-start !min-h-8 !border-0 !px-1.5 rounded-xl hover:!bg-butter/50 font-normal"
                  >
                    {row}
                  </Btn>
                ) : (
                  <span className="flex min-h-7 items-center gap-2 px-1.5">
                    {row}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/**
 * Calculate distance in km from user position using Haversine formula
 */
export const kmFrom = (x: number, y: number, from = ME_POS) =>
  kmFromGeo(x, y, from)
