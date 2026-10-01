import { useState, type ReactNode } from 'react'
import {
  Bell,
  Bookmark,
  Home,
  Map as MapIcon,
  PawPrint,
  Plus,
  Search,
  Users,
  ShieldAlert,
  User,
  LogOut,
  Settings2,
  LayoutDashboard,
} from 'lucide-react'
import { useApp } from '@/store'
import { Avatar, Btn, Logo, cx } from '@/components/ui'
import { USERS } from '@/constants/mock/users'

const NAV = [
  { to: '/find', label: 'Tìm & Cứu Pet', icon: PawPrint, match: ['/find', '/ai-match', '/report'] },
  { to: '/map', label: 'Bản đồ', icon: MapIcon, match: ['/map'] },
  {
    to: '/community',
    label: 'Cộng đồng',
    icon: Users,
    match: ['/community', '/shelters', '/clinics', '/donate', '/leaderboard'],
  },
  { to: '/safety', label: 'An toàn', icon: ShieldAlert, match: ['/safety'] },
]

const TABS = [
  { to: '/home', label: 'Trang chủ', icon: Home, match: ['/home'] },
  { to: '/map', label: 'Bản đồ', icon: MapIcon, match: ['/map'] },
  { to: '/find', label: 'Tìm & Cứu', icon: PawPrint, match: ['/find', '/ai-match', '/report', '/case'] },
  {
    to: '/community',
    label: 'Cộng đồng',
    icon: Users,
    match: ['/community', '/shelters', '/clinics', '/donate', '/leaderboard', '/safety'],
  },
  { to: '/profile', label: 'Hồ sơ', icon: User, match: ['/profile', '/saved', '/notifications'] },
]

const on = (path: string, m: string[]) =>
  m.some((x) => path === x || path.startsWith(x + '/') || path.startsWith(x + '?'))

export default function UserShell({
  children,
  fullBleed,
  hideFab,
}: {
  children: ReactNode
  fullBleed?: boolean
  hideFab?: boolean
}) {
  const { path, go, notifs, logout, auth, saved, login } = useApp()
  const [menu, setMenu] = useState(false)
  const unread = notifs.filter((n) => n.unread).length
  const me = USERS[0]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b-2 border-brown/15 bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-3 md:gap-5 md:px-6">
          <Logo onClick={() => go(auth === 'guest' ? '/' : '/home')} />
          <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
            {NAV.map((n) => (
              <button
                key={n.to}
                onClick={() => go(n.to)}
                aria-current={on(path, n.match) ? 'page' : undefined}
                className={cx(
                  'rounded-2xl px-3.5 py-2 text-[15px] font-extrabold transition',
                  on(path, n.match)
                    ? 'bg-butter text-brown shadow-[inset_0_0_0_2px_var(--color-brown)]'
                    : 'text-brown/75 hover:bg-brown/10 hover:text-brown',
                )}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brown/50" />
            <input
              onKeyDown={(e) => e.key === 'Enter' && go('/map')}
              placeholder="Tìm quanh đây…"
              aria-label="Tìm kiếm"
              className="h-11 w-full rounded-full border-2 border-line bg-white pl-10 pr-4 text-sm font-semibold placeholder:text-brown/45 focus:border-brown focus:outline-none focus:ring-4 focus:ring-butter/70"
            />
          </div>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {auth === 'guest' ? (
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => go('/login')}>
                  Đăng nhập
                </Btn>
                <Btn size="sm" pill onClick={() => go('/register')}>
                  Đăng ký
                </Btn>
              </div>
            ) : (
              <>
                <button
                  onClick={() => go('/saved')}
                  aria-label="Bài đã lưu"
                  className="relative hidden size-11 place-items-center rounded-2xl hover:bg-brown/10 md:grid"
                >
                  <Bookmark className="size-5" />
                  {saved.length > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-pink-2" />}
                </button>
                <button
                  onClick={() => go('/notifications')}
                  aria-label={`Thông báo (${unread} mới)`}
                  className="relative grid size-11 place-items-center rounded-2xl hover:bg-brown/10"
                >
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 grid size-5 animate-[pop_.3s_both] place-items-center rounded-full border-2 border-cream bg-coral text-[10px] font-extrabold text-white">
                      {unread}
                    </span>
                  )}
                </button>
                <div className="hidden sm:block">
                  <Btn pill onClick={() => go('/report')} icon={<Plus className="size-5" strokeWidth={3} />}>
                    Báo một case
                  </Btn>
                </div>
                <div className="relative">
                  <button onClick={() => setMenu(!menu)} aria-label="Tài khoản" aria-expanded={menu}>
                    <Avatar name={me.name} tone="pink" size={42} />
                  </button>
                  {menu && (
                    <div
                      className="absolute right-0 top-14 z-50 w-60 animate-[pop_.2s_both] rounded-3xl border-2 border-brown bg-paper p-2 shadow-soft"
                      onMouseLeave={() => setMenu(false)}
                    >
                      <div className="px-3 py-2">
                        <p className="font-display font-extrabold">{me.name}</p>
                        <p className="text-xs text-brown-soft">{me.area}, Hà Nội</p>
                      </div>
                      {[
                        ['/profile', 'Hồ sơ của tôi', User],
                        ['/saved', 'Bài đã lưu & theo dõi', Bookmark],
                        ['/leaderboard', 'Bảng vinh danh', Users],
                      ].map(([to, l, I]: any) => (
                        <button
                          key={to}
                          onClick={() => {
                            setMenu(false)
                            go(to)
                          }}
                          className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-sm font-bold hover:bg-butter/60"
                        >
                          <I className="size-4" />
                          {l}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setMenu(false)
                          login('admin')
                        }}
                        className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-sm font-bold hover:bg-butter/60"
                      >
                        <LayoutDashboard className="size-4" />
                        Chuyển sang Admin (demo)
                      </button>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-sm font-bold text-coral hover:bg-coral-soft"
                      >
                        <LogOut className="size-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main
        className={cx(
          'flex-1',
          !fullBleed && 'mx-auto w-full max-w-[1280px] px-4 py-6 pb-28 md:px-6 md:py-8 lg:pb-10',
        )}
      >
        {children}
      </main>

      {!hideFab && auth !== 'guest' && (
        <button
          onClick={() => go('/report')}
          aria-label="Báo case"
          className="fixed bottom-24 right-4 z-40 inline-flex h-14 items-center gap-2 rounded-full border-2 border-brown bg-coral px-5 font-extrabold text-white shadow-[0_5px_0_var(--color-brown)] transition active:translate-y-1 active:shadow-none sm:hidden"
        >
          <Plus className="size-6" strokeWidth={3} />
          Báo case
        </button>
      )}
      {auth !== 'guest' && (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-brown/15 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
          aria-label="Điều hướng di động"
        >
          <ul className="mx-auto grid max-w-xl grid-cols-5">
            {TABS.map((t) => {
              const a = on(path, t.match)
              return (
                <li key={t.to}>
                  <button
                    onClick={() => go(t.to)}
                    aria-current={a ? 'page' : undefined}
                    className="flex w-full flex-col items-center gap-0.5 py-2 text-[11px] font-extrabold"
                  >
                    <span
                      className={cx(
                        'grid h-8 w-14 place-items-center rounded-full transition',
                        a ? 'bg-butter' : '',
                      )}
                    >
                      <t.icon className={cx('size-[22px]', a && 'fill-brown')} strokeWidth={a ? 2.2 : 2} />
                    </span>
                    <span className={a ? 'font-black text-brown' : 'text-brown/65'}>{t.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
      <span className="hidden">
        <Settings2 />
      </span>
    </div>
  )
}
