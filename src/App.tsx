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
  const { path, auth, go } = useApp()
  const { seg } = parsePath(path)
  const isLanding = seg.length === 0 || seg[0] === 'landing'
  const isMap = seg[0] === 'map'
  const isCase = seg[0] === 'case'
  const pub = isLanding || isMap || isCase || seg[0] === 'login' || seg[0] === 'register'

  useEffect(() => {
    if (auth === 'guest' && !pub) go('/login')
    else if (auth !== 'guest' && (seg[0] === 'login' || seg[0] === 'register')) {
      go(auth === 'admin' ? '/admin/dashboard' : '/home')
    }
    else if (auth === 'user' && seg[0] === 'admin') go('/home')
  }, [auth, path])

  if (auth === 'guest' && !pub) return null
  if (isLanding) return <LandingPage />
  if (seg[0] === 'admin') return <AdminApp path={path} />
  const page = userRoute(path) ?? communityRoute(path)
  if (page) return <>{page}</>
  return <UserShell><Empty title="Không tìm thấy trang này" body="Đường dẫn có thể đã thay đổi." cta="Về trang chủ" onCta={() => go(auth === 'guest' ? '/' : '/home')} /></UserShell>
}

export default function App() {
  return (
    <AppProvider>
      <Router />
      <ToastHost />
    </AppProvider>
  )
}
