import { IS_MOCK, API_BASE_URL } from '@/config'
import { RISKS } from '@/constants/mock/risks'
import type { Risk } from '@/types/map'

export async function getRisks(): Promise<Risk[]> {
  if (IS_MOCK) return RISKS
  const res = await fetch(`${API_BASE_URL}/risks`)
  if (!res.ok) throw new Error('Failed to fetch risks')
  return res.json()
}
