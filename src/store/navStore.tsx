import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export interface GoOptions {
  replace?: boolean
}

interface NavCtx {
  path: string
  go: (p: string, options?: GoOptions) => void
  back: () => void
  saved: string[]
  toggleSave: (id: string) => void
  following: string[]
  toggleFollow: (id: string) => void
}

const NavCtx = createContext<NavCtx>(null as unknown as NavCtx)
export const useNav = () => useContext(NavCtx)

const getBase = (): string => {
  const b = import.meta.env.BASE_URL || "/"
  return b.endsWith("/") ? b.slice(0, -1) : b
}

const readCurrentPath = (): string => {
  const base = getBase()
  // Legacy hash handling: auto redirect /#/path or #/path to standard path
  const hash = window.location.hash
  if (
    hash.startsWith("#/") ||
    (hash.startsWith("#") && hash.length > 1 && !hash.startsWith("#root"))
  ) {
    const legacy = hash.replace(/^#\/?/, "/") || "/"
    const full = (base || "") + legacy
    window.history.replaceState(null, "", full)
    return legacy
  }

  let p = window.location.pathname
  if (base && p.startsWith(base)) {
    p = p.slice(base.length) || "/"
  }
  if (!p.startsWith("/")) p = `/${p}`
  return p + window.location.search
}

export function NavProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readCurrentPath)
  const [saved, setSaved] = useState<string[]>(["HP-1041", "HP-1039"])
  const [following, setFollowing] = useState<string[]>(["HP-1042"])

  useEffect(() => {
    const handlePopState = () => {
      setPath(readCurrentPath())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener("popstate", handlePopState)
    window.addEventListener("hashchange", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("hashchange", handlePopState)
    }
  }, [])

  const go = useCallback((p: string, options?: GoOptions) => {
    const base = getBase()
    const target = p.startsWith("/") ? p : `/${p}`
    const fullUrl = base ? `${base}${target}` : target
    if (options?.replace) {
      window.history.replaceState(null, "", fullUrl)
    } else {
      window.history.pushState(null, "", fullUrl)
    }
    setPath(target)
    window.scrollTo({ top: 0 })
  }, [])

  const back = useCallback(() => window.history.back(), [])

  const value = useMemo<NavCtx>(
    () => ({
      path,
      go,
      back,
      saved,
      toggleSave: (id) =>
        setSaved((s) =>
          s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
        ),
      following,
      toggleFollow: (id) =>
        setFollowing((s) =>
          s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
        ),
    }),
    [path, go, back, saved, following],
  )

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>
}
