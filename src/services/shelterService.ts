import { IS_MOCK, API_BASE_URL } from '@/config'
import { SHELTERS, CLINICS } from '@/constants/mock/places'
import type { Shelter, Clinic } from '@/types/place'

export async function getShelters(): Promise<Shelter[]> {
  if (IS_MOCK) return SHELTERS
  const res = await fetch(`${API_BASE_URL}/shelters`)
  if (!res.ok) throw new Error('Failed to fetch shelters')
  return res.json()
}

export async function getClinics(): Promise<Clinic[]> {
  if (IS_MOCK) return CLINICS
  const res = await fetch(`${API_BASE_URL}/clinics`)
  if (!res.ok) throw new Error('Failed to fetch clinics')
  return res.json()
}
