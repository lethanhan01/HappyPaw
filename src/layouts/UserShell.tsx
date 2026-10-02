import { useState, type ReactNode } from "react"
import {
  Bell,
  Bookmark,
  Home,
  PawPrint,
  Plus,
  Users,
  ShieldAlert,
  User,
  LogOut,
  Settings2,
} from "lucide-react"
import { useApp } from "@/store"
import { Avatar, Btn, IconBtn, Logo, cx } from "@ui"
import { USERS } from "@/constants/mock/users"

const NAV = [
  { to: "/home", label: "Trang chủ", icon: Home, match: ["/home", "/map"] },
  {
    to: "/find",
    label: "Tìm & Cứu Pet",
    icon: PawPrint,
    match: ["/find", "/ai-match", "/report"],
  },
  {
    to: "/community",
    label: "Cộng đồng",
    icon: Users,
    match: ["/community", "/shelters", "/clinics", "/donate", "/leaderboard"],
  },
  { to: "/safety", label: "An toàn", icon: ShieldAlert, match: ["/safety"] },
]

const TABS = [
  { to: "/home", label: "Trang chủ", icon: Home, match: ["/home", "/map"] },
  {
    to: "/find",
    label: "Tìm & Cứu",
    icon: PawPrint,
    match: ["/find", "/ai-match", "/report", "/case"],
  },
  {
    to: "/community",
    label: "Cộng đồng",
    icon: Users,
    match: [
      "/community",
      "/shelters",
      "/clinics",
      "/donate",
      "/leaderboard",
      "/safety",
    ],
  },
  {
    to: "/profile",
    label: "Hồ sơ",
    icon: User,
    match: ["/profile", "/saved", "/notifications"],
  },
]

const on = (path: string, m: string[]) =>
  m.some(
    (x) => path === x || path.startsWith(x + "/") || path.startsWith(x + "?"),
  )

export default function UserShell({
  children,
  fullBleed,
  hideFab,
  mobileHeaderContent,
}: {
  children: ReactNode
  fullBleed?: boolean
  hideFab?: boolean
  mobileHeaderContent?: ReactNode
}) {
  const { path, go, notifs, logout, auth, saved, account } = useApp()
  const [menu, setMenu] = useState(false)
  const unread = notifs.filter((n) => n.unread).length
  const me = account || USERS[0]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b-2 border-brown/15 bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-3 px-3 md:px-6">
          <div className="flex shrink-0 items-center">
            {mobileHeaderContent ? (
              <>
                <div className="hidden sm:block">
                  <Logo onClick={() => go(auth === "guest" ? "/" : "/home")} />
                </div>
                <div className="flex-1 min-w-0 mr-1 sm:hidden">
                  {mobileHeaderContent}
                </div>
              </>
            ) : (
              <Logo onClick={() => go(auth === "guest" ? "/" : "/home")} />
            )}
          </div>
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <nav
              className="flex items-center gap-1.5"
              aria-label="Điều hướng chính"
            >
              {NAV.map((n) => (
                <Btn
                  key={n.to}
                  variant={on(path, n.match) ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => go(n.to)}
                  aria-current={on(path, n.match) ? "page" : undefined}
                  className={cx(
                    "!rounded-2xl !px-4 !py-2 text-[15px] font-extrabold transition-all",
                    !on(path, n.match) &&
                      "text-brown/75 hover:bg-brown/10 hover:text-brown",
                  )}
                >
                  {n.label}
                </Btn>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {auth === "guest" ? (
              <div className="flex items-center gap-2">
                <Btn size="sm" variant="ghost" onClick={() => go("/login")}>
                  Đăng nhập
                </Btn>
                <Btn size="sm" pill onClick={() => go("/register")}>
                  Đăng ký
                </Btn>
              </div>
            ) : (
              <>
                <IconBtn
                  label="Bài đã lưu"
                  variant="ghost"
                  size="md"
                  onClick={() => go("/saved")}
                  className="relative hidden md:grid"
                >
                  <Bookmark className="size-5" />
                  {saved.length > 0 && (
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-pink-2" />
                  )}
                </IconBtn>
                <IconBtn
                  label={`Thông báo (${unread} mới)`}
                  variant="ghost"
                  size="md"
                  onClick={() => go("/notifications")}
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
                  <Btn
                    pill
                    onClick={() => go("/report")}
                    icon={<Plus className="size-5" strokeWidth={3} />}
                  >
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
                        <p className="text-xs text-brown-soft">
                          {me.area}, Hà Nội
                        </p>
                      </div>
                      {[
                        ["/profile", "Hồ sơ của tôi", User],
                        ["/saved", "Bài đã lưu & theo dõi", Bookmark],
                        ["/leaderboard", "Bảng vinh danh", Users],
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
          "flex-1",
          !fullBleed &&
            "mx-auto w-full max-w-[1280px] px-4 py-6 pb-28 md:px-6 md:py-8 lg:pb-10",
        )}
      >
        {children}
      </main>

      {!hideFab && auth !== "guest" && (
        <IconBtn
          variant="danger"
          size="lg"
          label="Báo case"
          onClick={() => go("/report")}
          className="fixed bottom-20 right-4 z-40 !size-12 !rounded-full shadow-[0_4px_0_var(--color-brown)] active:translate-y-1 active:shadow-none sm:hidden"
        >
          <Plus className="size-6" strokeWidth={3} />
        </IconBtn>
      )}
      {auth !== "guest" && (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-brown/15 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
          aria-label="Điều hướng di động"
        >
          <ul className="mx-auto grid max-w-xl grid-cols-4">
            {TABS.map((t) => {
              const a = on(path, t.match)
              return (
                <li key={t.to}>
                  <Btn
                    variant="ghost"
                    size="sm"
                    full
                    onClick={() => go(t.to)}
                    aria-current={a ? "page" : undefined}
                    className="!flex !h-auto !min-h-[52px] !flex-col !items-center !justify-center !gap-0.5 !border-0 !px-0 !py-1 text-[11px] font-extrabold hover:!bg-transparent active:scale-95 transition-transform"
                  >
                    <span
                      className={cx(
                        "grid h-8 w-14 place-items-center rounded-full transition-colors",
                        a ? "bg-butter shadow-sm" : "",
                      )}
                    >
                      <t.icon
                        className={cx("size-[22px]", a && "fill-brown")}
                        strokeWidth={a ? 2.4 : 2}
                      />
                    </span>
                    <span
                      className={cx(
                        "text-[11px] tracking-tight leading-tight",
                        a ? "font-black text-brown" : "font-bold text-brown/70",
                      )}
                    >
                      {t.label}
                    </span>
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
