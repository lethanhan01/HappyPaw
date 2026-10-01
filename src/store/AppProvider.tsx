import type { ReactNode } from 'react'
import { NavProvider } from './navStore'
import { AuthProvider } from './authStore'
import { CasesProvider } from './casesStore'
import { UIProvider } from './uiStore'

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <AuthProvider>
        <CasesProvider>
          <UIProvider>{children}</UIProvider>
        </CasesProvider>
      </AuthProvider>
    </NavProvider>
  )
}
