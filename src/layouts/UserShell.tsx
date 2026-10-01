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
import { Avatar, Btn, IconBtn, Input, Logo, cx } from '@ui'
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
              <Btn
                key={n.to}
                variant={on(path, n.match) ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => go(n.to)}
                aria-current={on(path, n.match) ? 'page' : undefined}
                className={cx(
                  '!rounded-2xl !px-3.5 !py-2 text-[15px] font-extrabold',
                  !on(path, n.match) && 'text-brown/75 hover:bg-brown/10 hover:text-brown',
                )}
              >
                {n.label}
              </Btn>
            ))}
          </nav>
          <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-brown/50" />
            <Input
              size="sm"
              onKeyDown={(e) => e.key === 'Enter' && go('/map')}
              placeholder="Tìm quanh đây…"
              aria-label="Tìm kiếm"
              className="!h-11 !rounded-full pl-10 pr-4"
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
                <IconBtn
                  label="Bài đã lưu"
                  variant="ghost"
                  size="md"
                  onClick={() => go('/saved')}
                  className="relative hidden md:grid"
                >
                  <Bookmark className="size-5" />
                  {saved.length > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-pink-2" />}
                </IconBtn>
                <IconBtn
                  label={`Thông báo (${unread} mới)`}
                  variant="ghost"
                  size="md"
                  onClick={() => go('/notifications')}
                  className="relative"
                >
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 grid size-5 animate-[pop_.3s_both] place-items-center rounded-full border-2 border-cream bg-coral text-[10px] font-extrabold text-white">
                      {unread}
                    </span>
                  )}
                </IconBtn>
                <div className="hidden sm:block">
                  <Btn pill onClick={() => go('/report')} icon={<Plus className="size-5" strokeWidth={3} />}>
                    Báo một case
                  </Btn>
                </div>
                <div className="relative">
                  <IconBtn
                    label="Tài khoản"
                    variant="ghost"
                    onClick={() => setMenu(!menu)}
                    aria-expanded={menu}
                    className="!size-auto !rounded-full !border-0 !p-0"
                  >
                    <Avatar name={me.name} tone="pink" size={42} />
                  </IconBtn>
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
                        <Btn
                          key={to}
                          variant="ghost"
                          size="sm"
                          full
                          onClick={() => {
                            setMenu(false)
                            go(to)
                          }}
                          className="!justify-start !rounded-2xl !px-3 !py-2 text-left font-bold hover:!bg-butter/60"
                        >
                          <I className="size-4" />
                          {l}
                        </Btn>
                      ))}
                      <Btn
                        variant="ghost"
                        size="sm"
                        full
                        onClick={() => {
                          setMenu(false)
                          login('admin')
                        }}
                        className="!justify-start !rounded-2xl !px-3 !py-2 text-left font-bold hover:!bg-butter/60"
                      >
                        <LayoutDashboard className="size-4" />
                        Chuyển sang Admin (demo)
                      </Btn>
                      <Btn
                        variant="ghost"
                        size="sm"
                        full
                        onClick={logout}
                        className="!justify-start !rounded-2xl !px-3 !py-2 text-left font-bold !text-coral hover:!bg-coral-soft"
                      >
                        <LogOut className="size-4" />
                        Đăng xuất
                      </Btn>
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
        <Btn
          variant="danger"
          size="lg"
          pill
          icon={<Plus className="size-6" strokeWidth={3} />}
          onClick={() => go('/report')}
          className="fixed bottom-24 right-4 z-40 !h-14 !px-5 shadow-[0_5px_0_var(--color-brown)] sm:hidden"
        >
          Báo case
        </Btn>
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
                  <Btn
                    variant="ghost"
                    size="sm"
                    full
                    onClick={() => go(t.to)}
                    aria-current={a ? 'page' : undefined}
                    className="!flex !h-auto !flex-col !items-center !gap-0.5 !border-0 !px-0 !py-2 text-[11px] font-extrabold hover:!bg-transparent"
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
                  </Btn>
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
