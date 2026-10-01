import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { INITIAL_CASES, NOTIFS, type Case, type Notif, type Status } from './data'

export type Auth = 'guest' | 'user' | 'admin'
export interface Toast { id: number; msg: string; tone: 'ok' | 'warn' | 'err' }

interface Ctx {
  path: string
  go: (p: string) => void
  back: () => void
  cases: Case[]
  getCase: (id: string) => Case | undefined
  updateCase: (id: string, patch: Partial<Case>) => void
  addCase: (c: Case) => void
  saved: string[]
  toggleSave: (id: string) => void
  following: string[]
  toggleFollow: (id: string) => void
  auth: Auth
  login: (a: Auth) => void
  logout: () => void
  myRescue: string | null
  setMyRescue: (id: string | null) => void
  notifs: Notif[]
  markAllRead: () => void
  toasts: Toast[]
  toast: (msg: string, tone?: Toast['tone']) => void
  proof: Record<string, { shelterConfirmed?: boolean; mismatch?: boolean; needMore?: boolean }>
  setProof: (id: string, p: { shelterConfirmed?: boolean; mismatch?: boolean; needMore?: boolean }) => void
  me: string
}

const AppCtx = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(AppCtx)

const readHash = () => window.location.hash.replace(/^#/, '') || '/login'

export function AppProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readHash())
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES)
  const [saved, setSaved] = useState<string[]>(['HP-1041', 'HP-1039'])
  const [following, setFollowing] = useState<string[]>(['HP-1042'])
  const [auth, setAuth] = useState<Auth>(() => { const a = new URLSearchParams(window.location.search).get('as'); return a === 'user' || a === 'admin' ? a : 'guest' })
  const [myRescue, setMyRescue] = useState<string | null>(null)
  const [notifs, setNotifs] = useState<Notif[]>(NOTIFS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [proof, setProofState] = useState<Ctx['proof']>({})

  useEffect(() => {
    const h = () => { setPath(readHash()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])

  const go = useCallback((p: string) => { window.location.hash = p }, [])
  const back = useCallback(() => window.history.back(), [])
  const toast = useCallback((msg: string, tone: Toast['tone'] = 'ok') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const value = useMemo<Ctx>(() => ({
    path, go, back, cases,
    getCase: (id) => cases.find((c) => c.id === id),
    updateCase: (id, patch) => setCases((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch, updatedAgo: 0 } : c))),
    addCase: (c) => setCases((cs) => [c, ...cs]),
    saved, toggleSave: (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    following, toggleFollow: (id) => setFollowing((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    auth, login: (a) => { setAuth(a); go(a === 'admin' ? '/admin/dashboard' : '/home') },
    logout: () => { setAuth('guest'); go('/login') },
    myRescue, setMyRescue,
    notifs, markAllRead: () => setNotifs((n) => n.map((x) => ({ ...x, unread: false }))),
    toasts, toast,
    proof, setProof: (id, p) => setProofState((s) => ({ ...s, [id]: { ...s[id], ...p } })),
    me: 'u1',
  }), [path, cases, saved, following, auth, myRescue, notifs, toasts, proof, go, back, toast])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const STATUS_META: Record<Status, { label: string; short: string; tone: string }> = {
  active: { label: 'Đang cần hỗ trợ', short: 'Đang cần hỗ trợ', tone: 'coral' },
  progress: { label: 'Đang xử lý', short: 'Đang xử lý', tone: 'butter' },
  pending: { label: 'Chờ xác minh', short: 'Chờ xác minh', tone: 'butter' },
  resolved: { label: 'Đã giải quyết', short: 'Đã giải quyết', tone: 'sage' },
}

export function parsePath(path: string) {
  const [p, q = ''] = path.split('?')
  return { seg: p.split('/').filter(Boolean), query: Object.fromEntries(new URLSearchParams(q)) as Record<string, string> }
}
