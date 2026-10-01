import { IS_MOCK, API_BASE_URL } from "@/config"
import { INITIAL_CASES } from "@/constants/mock/cases"
import type { Case } from "@/types/case"

export async function getCases(): Promise<Case[]> {
  if (IS_MOCK) return INITIAL_CASES
  const res = await fetch(`${API_BASE_URL}/cases`)
  if (!res.ok) throw new Error("Failed to fetch cases")
  return res.json()
}

export async function getCase(id: string): Promise<Case | undefined> {
  if (IS_MOCK) return INITIAL_CASES.find((c) => c.id === id)
  const res = await fetch(`${API_BASE_URL}/cases/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch case ${id}`)
  return res.json()
}

export async function updateCase(
  id: string,
  patch: Partial<Case>,
): Promise<void> {
  if (IS_MOCK) return
  await fetch(`${API_BASE_URL}/cases/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
}

export async function addCase(c: Case): Promise<void> {
  if (IS_MOCK) return
  await fetch(`${API_BASE_URL}/cases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(c),
  })
}
