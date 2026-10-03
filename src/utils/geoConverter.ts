import type { Feature, Polygon } from "geojson"

// Hanoi Bounding Box mapping constants
export const LNG_WEST = 105.7200
export const LNG_EAST = 105.9100
export const LAT_NORTH = 21.1000
export const LAT_SOUTH = 20.9500

export const HANOI_CENTER: [number, number] = [105.85361, 21.028333] // [lng, lat] Hoàn Kiếm / Trung tâm Hà Nội

export const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Ba Đình": [105.8288, 21.0353],
  "Hoàn Kiếm": [105.8542, 21.0285],
  "Tây Hồ": [105.8236, 21.0683],
  "Long Biên": [105.8920, 21.0420],
  "Cầu Giấy": [105.7892, 21.0362],
  "Đống Đa": [105.8272, 21.0167],
  "Hai Bà Trưng": [105.8525, 21.0067],
  "Hoàng Mai": [105.8580, 20.9730],
  "Thanh Xuân": [105.8080, 20.9937],
  "Nam Từ Liêm": [105.7656, 21.0180],
  "Bắc Từ Liêm": [105.7584, 21.0745],
  "Hà Đông": [105.7725, 20.9720],
}

/**
 * Convert SVG (x, y) coordinates (0-1000, 0-720) to real GPS [lng, lat]
 */
export function xyToLngLat(x: number, y: number): [number, number] {
  const lng = LNG_WEST + (x / 1000) * (LNG_EAST - LNG_WEST)
  const lat = LAT_NORTH - (y / 720) * (LAT_NORTH - LAT_SOUTH)
  return [Number(lng.toFixed(6)), Number(lat.toFixed(6))]
}

/**
 * Convert real GPS [lng, lat] back to SVG (x, y) space (0-1000, 0-720)
 */
export function lngLatToXY(lng: number, lat: number): { x: number; y: number } {
  const x = Math.round(((lng - LNG_WEST) / (LNG_EAST - LNG_WEST)) * 1000)
  const y = Math.round(((LAT_NORTH - lat) / (LAT_NORTH - LAT_SOUTH)) * 720)
  return {
    x: Math.max(0, Math.min(1000, x)),
    y: Math.max(0, Math.min(720, y)),
  }
}

/**
 * Calculate accurate geographic distance (in kilometers) between two [lng, lat] points using the Haversine formula
 */
export function haversineDistance(
  coord1: [number, number],
  coord2: [number, number],
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const [lon1, lat1] = coord1
  const [lon2, lat2] = coord2

  const R = 6371 // Earth radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

/**
 * Distance in km from SVG (x, y) coordinates using GPS Haversine
 */
export function kmFromGeo(
  x: number,
  y: number,
  from = { x: 345, y: 285 },
): number {
  const p1 = xyToLngLat(x, y)
  const p2 = xyToLngLat(from.x, from.y)
  return haversineDistance(p1, p2)
}

/**
 * Generate a GeoJSON Polygon representing a geographic circle of radius in kilometers
 */
export function createGeoJSONCircle(
  center: [number, number],
  radiusInKm: number,
  points = 64,
): Feature<Polygon> {
  const coords: [number, number][] = []
  const [lng, lat] = center

  // 1 degree of latitude ~ 110.574 km
  // 1 degree of longitude ~ 111.320 * cos(latitude) km
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180))
  const distanceY = radiusInKm / 110.574

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI)
    const x = distanceX * Math.cos(theta)
    const y = distanceY * Math.sin(theta)
    coords.push([Number((lng + x).toFixed(6)), Number((lat + y).toFixed(6))])
  }
  coords.push(coords[0]) // Close polygon ring

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
    properties: {},
  }
}
