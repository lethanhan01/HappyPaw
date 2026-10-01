import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useNav } from './navStore'
import { type Account, getAccountById, getAccountByRole } from '@/constants/mock/accounts'

export type Auth = 'guest' | 'user' | 'admin'

export interface AuthCtx {
  auth: Auth
  account: Account | null
  login: (a: Auth, accountId?: string) => void
  logout: () => void
  me: string
}

const STORAGE_KEY = 'hp_auth_session'

interface StoredSession {
  role: Auth
  accountId?: string
}

const readSession = (): { auth: Auth; account: Account | null } => {
  // 1. Kiểm tra query param ghi đè (?as=user hoặc ?as=admin)
  try {
    const urlAs = new URLSearchParams(window.location.search).get('as')
    if (urlAs === 'user' || urlAs === 'admin') {
      const acc = getAccountByRole(urlAs)
      return { auth: urlAs, account: acc }
    }
  } catch {}

  // 2. Đọc từ localStorage
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: StoredSession = JSON.parse(raw)
      if (parsed.role === 'user' || parsed.role === 'admin') {
        const acc = (parsed.accountId && getAccountById(parsed.accountId)) || getAccountByRole(parsed.role)
        return { auth: parsed.role, account: acc }
      }
    }
  } catch {}

  return { auth: 'guest', account: null }
}

const AuthCtx = createContext<AuthCtx>(null as unknown as AuthCtx)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { go } = useNav()
  const [session, setSession] = useState(readSession)

  const login = useCallback((role: Auth, accountId?: string) => {
    if (role === 'guest') {
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {}
      setSession({ auth: 'guest', account: null })
      go('/', { replace: true })
      return
    }

    const acc = (accountId && getAccountById(accountId)) || getAccountByRole(role)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ role, accountId: acc.id }))
    } catch {}
    setSession({ auth: role, account: acc })

    // Kiểm tra redirect query param
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const redirectUrl = searchParams.get('redirect')
      if (redirectUrl) {
        go(decodeURIComponent(redirectUrl), { replace: true })
        return
      }
    } catch {}

    go(role === 'admin' ? '/admin/dashboard' : '/home', { replace: true })
  }, [go])

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setSession({ auth: 'guest', account: null })
    go('/', { replace: true })
  }, [go])

  const value = useMemo<AuthCtx>(() => ({
    auth: session.auth,
    account: session.account,
    login,
    logout,
    me: session.account?.id || 'u1',
  }), [session, login, logout])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

