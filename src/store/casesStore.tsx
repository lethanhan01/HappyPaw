import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { INITIAL_CASES } from "@/constants/mock/cases"
import { safeStorage } from "@/lib/safeStorage"
import type { Case } from "@/types/case"

const STORAGE_KEY = "happypaw_custom_cases"

interface CasesCtx {
  cases: Case[]
  getCase: (id: string) => Case | undefined
  updateCase: (id: string, patch: Partial<Case>) => void
  addCase: (c: Case) => void
  myRescue: string | null
  setMyRescue: (id: string | null) => void
}

const CasesCtx = createContext<CasesCtx>(null as unknown as CasesCtx)
export const useCasesStore = () => useContext(CasesCtx)

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>(() => {
    const saved = safeStorage.get<Case[]>(STORAGE_KEY, [])
    if (!saved || saved.length === 0) return INITIAL_CASES
    const savedIds = new Set(saved.map((s) => s.id))
    return [...saved, ...INITIAL_CASES.filter((c) => !savedIds.has(c.id))]
  })
  const [myRescue, setMyRescue] = useState<string | null>(null)

  const value = useMemo<CasesCtx>(
    () => ({
      cases,
      getCase: (id) => cases.find((c) => c.id === id),
      updateCase: (id, patch) =>
        setCases((cs) => {
          const next = cs.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAgo: 0 } : c,
          )
          // Persist updated custom cases
          const custom = next.filter(
            (c) => !INITIAL_CASES.some((orig) => orig.id === c.id),
          )
          safeStorage.set(STORAGE_KEY, custom)
          return next
        }),
      addCase: (c) =>
        setCases((cs) => {
          const next = [c, ...cs]
          const custom = next.filter(
            (item) => !INITIAL_CASES.some((orig) => orig.id === item.id),
          )
          safeStorage.set(STORAGE_KEY, custom)
          return next
        }),
      myRescue,
      setMyRescue,
    }),
    [cases, myRescue],
  )

  return <CasesCtx.Provider value={value}>{children}</CasesCtx.Provider>
}
