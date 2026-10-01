import { IS_MOCK, API_BASE_URL } from "@/config"

export type Auth = "guest" | "user" | "admin"

export async function login(credentials: {
  email: string
  password: string
}): Promise<Auth> {
  if (IS_MOCK) return "user"
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
  if (!res.ok) throw new Error("Login failed")
  const data = await res.json()
  return data.role as Auth
}

export async function logout(): Promise<void> {
  if (IS_MOCK) return
  await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" })
}

export async function getMe(): Promise<{ id: string role: Auth } | null> {
  if (IS_MOCK) return { id: "u1", role: "user" }
  const res = await fetch(`${API_BASE_URL}/auth/me`)
  if (!res.ok) return null
  return res.json()
}
