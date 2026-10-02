import type { ReactNode } from "react"
import { NavProvider } from "./navStore"
import { AuthProvider } from "./authStore"
import { CasesProvider } from "./casesStore"
import { SafetyProvider } from "./safetyStore"
import { UIProvider } from "./uiStore"

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <NavProvider>
      <AuthProvider>
        <CasesProvider>
          <SafetyProvider>
            <UIProvider>{children}</UIProvider>
          </SafetyProvider>
        </CasesProvider>
      </AuthProvider>
    </NavProvider>
  )
}
