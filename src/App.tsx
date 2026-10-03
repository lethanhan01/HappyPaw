import { useEffect, lazy, Suspense } from "react"
import { AppProvider, useApp } from "@/store"
import { parsePath } from "@/lib"
import { ToastHost, Empty, PageLoader } from "@ui"
import UserShell from "@/layouts/UserShell"

const LandingPage = lazy(() => import("@/features/landing"))
const AdminApp = lazy(() => import("@/features/admin"))
const UserApp = lazy(() => import("@/features/user/UserApp"))
const CommunityApp = lazy(() => import("@/features/community/CommunityApp"))
const StyleGuidePage = lazy(() => import("@/features/styleguide/StyleGuidePage"))

const USER_SEGMENTS = new Set([
  "login",
  "register",
  "home",
  "map",
  "find",
  "ai-match",
  "states",
  "report",
  "case",
  "track",
])

const COMMUNITY_SEGMENTS = new Set([
  "notifications",
  "saved",
  "community",
  "shelters",
  "clinics",
  "donate",
  "leaderboard",
  "profile",
  "safety",
])

function Router() {
  const { path, auth, go, toast } = useApp()
  const { seg, query } = parsePath(path)
  const isLanding = seg.length === 0 || seg[0] === "landing"
  const isAuthPage = seg[0] === "login" || seg[0] === "register"
  const isStyleGuide = seg[0] === "styleguide"
  const isPublic = isLanding || isAuthPage || isStyleGuide

  useEffect(() => {
    // 1. Khách chưa đăng nhập cố truy cập route được bảo vệ
    if (auth === "guest" && !isPublic) {
      toast("Vui lòng đăng nhập để truy cập tính năng này.", "warn")
      go(`/login?redirect=${encodeURIComponent(path)}`, { replace: true })
      return
    }

    // 2. Tài khoản Admin: Bị cô lập hoàn toàn trong không gian /admin/*
    if (auth === "admin") {
      if (seg[0] !== "admin" && !isStyleGuide) {
        go("/admin/dashboard", { replace: true })
        return
      }
    }

    // Tự động chuyển hướng /map sang /home sau khi hợp nhất
    if (seg[0] === "map") {
      go("/home", { replace: true })
      return
    }

    // 3. Tài khoản User: Cấm truy cập toàn bộ giao diện Admin
    if (auth === "user") {
      if (seg[0] === "admin") {
        toast("Bạn không có quyền truy cập trang quản trị.", "warn")
        go("/home", { replace: true })
        return
      }
      if (isAuthPage) {
        const redirectUrl = query.redirect
          ? decodeURIComponent(query.redirect)
          : null
        if (
          redirectUrl &&
          !redirectUrl.startsWith("/login") &&
          !redirectUrl.startsWith("/register") &&
          !redirectUrl.startsWith("/admin")
        ) {
          go(redirectUrl, { replace: true })
        } else {
          go("/home", { replace: true })
        }
        return
      }
    }
  }, [auth, path])

  if (isStyleGuide) return <StyleGuidePage />

  if (auth === "guest" && !isPublic) return null

  if (auth === "admin") {
    if (seg[0] !== "admin") return null
    return <AdminApp path={path} />
  }

  if (isLanding) return <LandingPage />
  if (seg[0] === "admin") return null

  if (USER_SEGMENTS.has(seg[0])) {
    return <UserApp />
  }

  if (COMMUNITY_SEGMENTS.has(seg[0])) {
    return <CommunityApp />
  }

  return (
    <UserShell>
      <Empty
        title="Không tìm thấy trang này"
        body="Đường dẫn có thể đã thay đổi."
        cta="Về trang chủ"
        onCta={() => go(auth === "guest" ? "/" : "/home")}
      />
    </UserShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<PageLoader />}>
        <Router />
      </Suspense>
      <ToastHost />
    </AppProvider>
  )
}
