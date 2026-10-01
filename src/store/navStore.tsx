import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface NavCtx {
  path: string
  go: (p: string) => void
  back: () => void
  saved: string[]
  toggleSave: (id: string) => void
  following: string[]
  toggleFollow: (id: string) => void
}

const NavCtx = createContext<NavCtx>(null as unknown as NavCtx)
export const useNav = () => useContext(NavCtx)

const readHash = () => {
  const h = window.location.hash.replace(/^#/, '')
  return h || '/'
}

export function NavProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readHash)
  const [saved, setSaved] = useState<string[]>(['HP-1041', 'HP-1039'])
  const [following, setFollowing] = useState<string[]>(['HP-1042'])

  useEffect(() => {
    const h = () => { setPath(readHash()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])

  const go = useCallback((p: string) => { window.location.hash = p }, [])
  const back = useCallback(() => window.history.back(), [])

  const value = useMemo<NavCtx>(() => ({
    path, go, back, saved,
    toggleSave: (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    following,
    toggleFollow: (id) => setFollowing((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
  }), [path, go, back, saved, following])

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>
}
