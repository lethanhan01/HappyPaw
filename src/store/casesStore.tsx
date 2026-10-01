import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { INITIAL_CASES } from '@/constants/mock/cases'
import type { Case } from '@/types/case'

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
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES)
  const [myRescue, setMyRescue] = useState<string | null>(null)

  const value = useMemo<CasesCtx>(() => ({
    cases,
    getCase: (id) => cases.find((c) => c.id === id),
    updateCase: (id, patch) =>
      setCases((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch, updatedAgo: 0 } : c))),
    addCase: (c) => setCases((cs) => [c, ...cs]),
    myRescue,
    setMyRescue,
  }), [cases, myRescue])

  return <CasesCtx.Provider value={value}>{children}</CasesCtx.Provider>
}
