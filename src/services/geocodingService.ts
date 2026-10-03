/**
 * Geocoding Service for HappyPaw
 * Provides Reverse Geocoding (coordinates -> street/district name)
 * and Address Search (query -> coordinates) using OpenStreetMap Nominatim.
 */

export interface GeocodeResult {
  label: string
  road?: string
  quarter?: string
  suburb?: string
  district?: string
  city?: string
  lng: number
  lat: number
}

/**
 * Reverse geocode [lng, lat] to a readable Vietnamese address
 */
export async function reverseGeocode(
  lng: number,
  lat: number,
): Promise<GeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=vi`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "HappyPawPetRescue/1.0",
      },
    })
    if (!res.ok) return null
    const data = await res.json()

    const addr = data.address || {}
    const road = addr.road || addr.pedestrian || addr.suburb || ""
    const district =
      addr.city_district ||
      addr.district ||
      addr.suburb ||
      addr.quarter ||
      ""
    const city = addr.city || addr.state || "Hà Nội"

    const parts = [road, district, city].filter(Boolean)
    const label = parts.length > 0 ? parts.join(", ") : data.display_name

    return {
      label,
      road,
      quarter: addr.quarter,
      suburb: addr.suburb,
      district,
      city,
      lng,
      lat,
    }
  } catch (error) {
    console.warn("Reverse geocode failed:", error)
    return null
  }
}

/**
 * Search for an address or place in Hanoi
 */
export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  if (!query || query.trim().length < 2) return []
  try {
    const q = encodeURIComponent(`${query.trim()}, Hà Nội`)
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${q}&countrycodes=vn&limit=5&accept-language=vi`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "HappyPawPetRescue/1.0",
      },
    })
    if (!res.ok) return []
    const list = await res.json()

    return list.map((item: { display_name: string; lon: string; lat: string; address?: Record<string, string> }) => {
      const addr = item.address || {}
      return {
        label: item.display_name,
        road: addr.road,
        suburb: addr.suburb,
        district: addr.city_district || addr.district,
        city: addr.city || "Hà Nội",
        lng: parseFloat(item.lon),
        lat: parseFloat(item.lat),
      }
    })
  } catch (error) {
    console.warn("Search address failed:", error)
    return []
  }
}
