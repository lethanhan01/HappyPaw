import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useNav } from './navStore'

export type Auth = 'guest' | 'user' | 'admin'

interface AuthCtx {
  auth: Auth
  login: (a: Auth) => void
  logout: () => void
  me: string
}

const AuthCtx = createContext<AuthCtx>(null as unknown as AuthCtx)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { go } = useNav()
  const [auth, setAuth] = useState<Auth>(() => {
    const a = new URLSearchParams(window.location.search).get('as')
    return a === 'user' || a === 'admin' ? a : 'guest'
  })

  const login = useCallback((a: Auth) => {
    setAuth(a)
    go(a === 'admin' ? '/admin/dashboard' : '/home')
  }, [go])

  const logout = useCallback(() => {
    setAuth('guest')
    go('/login')
  }, [go])

  const value = useMemo<AuthCtx>(() => ({
    auth, login, logout, me: 'u1',
  }), [auth, login, logout])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
