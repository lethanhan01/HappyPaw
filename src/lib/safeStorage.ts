/**
 * Safe local storage utility that catches QuotaExceededError and private browsing issues.
 */
export const safeStorage = {
  get<T>(key: string, fallback: T): T {
    try {
      if (typeof window === "undefined" || !window.localStorage) return fallback
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : fallback
    } catch {
      return fallback
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) return false
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (err) {
      console.warn(`[SafeStorage] Failed to save key "${key}", quota exceeded or storage disabled.`, err)
      return false
    }
  },

  remove(key: string): void {
    try {
      if (typeof window === "undefined" || !window.localStorage) return
      localStorage.removeItem(key)
    } catch {}
  },
}
