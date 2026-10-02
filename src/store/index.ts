import { useAuth } from "./authStore"
import { useNav } from "./navStore"
import { useCasesStore } from "./casesStore"
import { useSafetyStore } from "./safetyStore"
import { useUI } from "./uiStore"

// AppProvider & named hooks
export { AppProvider } from "./AppProvider"
export { useAuth, type Auth, type AuthCtx } from "./authStore"
export { useNav, type GoOptions } from "./navStore"
export { type Account } from "@/constants/mock/accounts"
export { useCasesStore } from "./casesStore"
export { useSafetyStore, type SafetyViewMode } from "./safetyStore"
export { useUI, type Toast } from "./uiStore"

// STATUS_META — giữ ở đây vì nhiều component import từ store
export { STATUS_META } from "@/constants/status"

// parsePath — giữ export cho backward compat
export { parsePath } from "@/lib/path"

// useApp() — backward-compat hook hợp nhất tất cả slices
export function useApp() {
  const auth = useAuth()
  const nav = useNav()
  const cases = useCasesStore()
  const safety = useSafetyStore()
  const ui = useUI()
  return { ...auth, ...nav, ...cases, ...safety, ...ui }
}
