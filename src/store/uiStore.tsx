import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { NOTIFS } from '@/constants/mock/notifs'
import type { Notif } from '@/types/user'

export interface Toast { id: number; msg: string; tone: 'ok' | 'warn' | 'err' }

interface UICtx {
  notifs: Notif[]
  markAllRead: () => void
  toasts: Toast[]
  toast: (msg: string, tone?: Toast['tone']) => void
  proof: Record<string, { shelterConfirmed?: boolean; mismatch?: boolean; needMore?: boolean }>
  setProof: (id: string, p: { shelterConfirmed?: boolean; mismatch?: boolean; needMore?: boolean }) => void
}

const UICtx = createContext<UICtx>(null as unknown as UICtx)
export const useUI = () => useContext(UICtx)

export function UIProvider({ children }: { children: ReactNode }) {
  const [notifs, setNotifs] = useState<Notif[]>(NOTIFS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [proof, setProofState] = useState<UICtx['proof']>({})

  const toast = useCallback((msg: string, tone: Toast['tone'] = 'ok') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const value = useMemo<UICtx>(() => ({
    notifs,
    markAllRead: () => setNotifs((n) => n.map((x) => ({ ...x, unread: false }))),
    toasts, toast,
    proof,
    setProof: (id, p) => setProofState((s) => ({ ...s, [id]: { ...s[id], ...p } })),
  }), [notifs, toasts, toast, proof])

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>
}
