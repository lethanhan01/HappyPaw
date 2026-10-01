import { useEffect } from 'react'
import { AppProvider, useApp } from '@/store'
import { parsePath } from '@/lib'
import { ToastHost, Empty } from '@ui'
import { userRoute } from '@/features/user'
import { communityRoute } from '@/features/community'
import LandingPage from '@/features/landing'
import AdminApp from '@/features/admin'
import UserShell from '@/layouts/UserShell'

function Router() {
  const { path, auth, go, toast } = useApp()
  const { seg, query } = parsePath(path)
  const isLanding = seg.length === 0 || seg[0] === 'landing'
  const isAuthPage = seg[0] === 'login' || seg[0] === 'register'
  const isPublic = isLanding || isAuthPage

  useEffect(() => {
    // 1. Khách chưa đăng nhập cố truy cập route được bảo vệ
    if (auth === 'guest' && !isPublic) {
      toast('Vui lòng đăng nhập để truy cập tính năng này.', 'warn')
      go(`/login?redirect=${encodeURIComponent(path)}`, { replace: true })
      return
    }

    // 2. Tài khoản Admin: Bị cô lập hoàn toàn trong không gian /admin/*
    if (auth === 'admin') {
      if (seg[0] !== 'admin') {
        go('/admin/dashboard', { replace: true })
        return
      }
    }

    // 3. Tài khoản User: Cấm truy cập toàn bộ giao diện Admin
    if (auth === 'user') {
      if (seg[0] === 'admin') {
        toast('Bạn không có quyền truy cập trang quản trị.', 'warn')
        go('/home', { replace: true })
        return
      }
      if (isAuthPage) {
        const redirectUrl = query.redirect ? decodeURIComponent(query.redirect) : null
        if (
          redirectUrl &&
          !redirectUrl.startsWith('/login') &&
          !redirectUrl.startsWith('/register') &&
          !redirectUrl.startsWith('/admin')
        ) {
          go(redirectUrl, { replace: true })
        } else {
          go('/home', { replace: true })
        }
        return
      }
    }
  }, [auth, path])

  if (auth === 'guest' && !isPublic) return null

  if (auth === 'admin') {
    if (seg[0] !== 'admin') return null
    return <AdminApp path={path} />
  }

  if (isLanding) return <LandingPage />
  if (seg[0] === 'admin') return null
  const page = userRoute(path) ?? communityRoute(path)
  if (page) return <>{page}</>
  return (
    <UserShell>
      <Empty
        title="Không tìm thấy trang này"
        body="Đường dẫn có thể đã thay đổi."
        cta="Về trang chủ"
        onCta={() => go(auth === 'guest' ? '/' : '/home')}
      />
    </UserShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router />
      <ToastHost />
    </AppProvider>
  )
}
