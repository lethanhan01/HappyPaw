import { IS_MOCK, API_BASE_URL } from "@/config"
import { NOTIFS } from "@/constants/mock/notifs"
import type { Notif } from "@/types/user"

export async function getNotifs(): Promise<Notif[]> {
  if (IS_MOCK) return NOTIFS
  const res = await fetch(`${API_BASE_URL}/notifications`)
  if (!res.ok) throw new Error("Failed to fetch notifications")
  return res.json()
}

export async function markAllRead(): Promise<void> {
  if (IS_MOCK) return
  await fetch(`${API_BASE_URL}/notifications/read-all`, { method: "POST" })
}
