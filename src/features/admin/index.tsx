import { useEffect, useMemo, useState, type ReactNode } from "react"
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileWarning,
  Gavel,
  LayoutDashboard,
  ListChecks,
  Map as MapIcon,
  Menu,
  PawPrint,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
  LogOut,
  Layers,
  UserCog,
  Building2,
} from "lucide-react"
import { parsePath, cx } from "@lib"
import { useApp } from "@store"
import { Btn, IconBtn, logoSvg, NavBtn } from "@ui"
import { SearchInput, type SearchHitItem } from "@/components/common"
import { USERS } from "@/constants"
import { MOCK_ADMIN_ACCOUNT } from "@/constants/mock/accounts"
import { useAdmin } from "./store/adminStore"
import { useCases } from "./components/AdminCommon"
import Dashboard from "./components/Dashboard"
import { CaseList, CaseDetail } from "./components/Cases"
import Verification from "./components/Verification"
import { UserList, UserDetail, UserVerification } from "./components/Users"
import { ReportQueue, Fraud, Blacklist } from "./components/Moderation"
import RiskPage from "./components/Risk"
import {
  ShelterPage,
  ClinicPage,
  PlaceVerification,
  RatingsPage,
} from "./components/Places"
import MapManagement from "./components/MapManagement"

interface SubNavItem {
  to: string
  label: string
  badgeKey?: string
}

interface NavSection {
  id: string
  title: string
  to?: string
  icon: ReactNode
  badgeKey?: string
  children?: SubNavItem[]
}

const I = "size-[18px] shrink-0"

const NAV_SECTIONS: NavSection[] = [
  {
    id: "dashboard",
    title: "Tổng quan",
    to: "/admin/dashboard",
    icon: <LayoutDashboard className={I} />,
  },
  {
    id: "cases",
    title: "Ca cứu hộ",
    to: "/admin/cases",
    icon: <PawPrint className={I} />,
    badgeKey: "pendingCases",
    children: [
      { to: "/admin/cases", label: "Tất cả ca cứu hộ" },
      { to: "/admin/verification", label: "Chờ xác minh", badgeKey: "pendingCases" },
      { to: "/admin/cases?status=progress", label: "Đang xử lý" },
      { to: "/admin/cases?status=resolved", label: "Đã giải quyết" },
    ],
  },
  {
    id: "users",
    title: "Người dùng",
    to: "/admin/users",
    icon: <Users className={I} />,
    children: [
      { to: "/admin/users", label: "Danh sách thành viên" },
      { to: "/admin/user-verification", label: "Xác thực danh tính" },
      { to: "/admin/users?filter=ban", label: "Tài khoản bị khóa" },
    ],
  },
  {
    id: "reports",
    title: "Kiểm duyệt & Báo cáo",
    to: "/admin/reports",
    icon: <ShieldAlert className={I} />,
    badgeKey: "newReports",
    children: [
      { to: "/admin/reports", label: "Hàng đợi báo cáo", badgeKey: "newReports" },
      { to: "/admin/fraud", label: "Điều tra gian lận" },
      { to: "/admin/blacklist", label: "Danh sách đen" },
    ],
  },
  {
    id: "places",
    title: "Cơ sở đối tác",
    to: "/admin/shelters",
    icon: <Building2 className={I} />,
    children: [
      { to: "/admin/shelters", label: "Trạm cứu hộ" },
      { to: "/admin/clinics", label: "Phòng khám thú y" },
      { to: "/admin/place-verification", label: "Xác minh địa điểm" },
      { to: "/admin/ratings", label: "Đánh giá & phản hồi" },
    ],
  },
  {
    id: "map",
    title: "Bản đồ hệ thống",
    to: "/admin/map",
    icon: <MapIcon className={I} />,
    children: [
      { to: "/admin/map", label: "Bản đồ tương tác" },
      { to: "/admin/map?layer=rescue", label: "Ghim ca cứu hộ" },
      { to: "/admin/map?layer=lost", label: "Ghim thú lạc" },
      { to: "/admin/risk", label: "Vùng rủi ro cảnh báo" },
    ],
  },
]

function isUrlActive(to: string, path: string) {
  const cur = parsePath(path)
  const it = parsePath(to)
  if (cur.seg[1] !== it.seg[1]) return false

  const targetKeys = Object.keys(it.query)
  if (targetKeys.length > 0) {
    for (const k of targetKeys) {
      if (cur.query[k] !== it.query[k]) return false
    }
    return true
  }

  if (cur.seg[1] === "map") {
    if (!cur.query.layer || cur.query.layer === "rescue") {
      return !it.query.layer || it.query.layer === "rescue"
    }
    return false
  }

  if (Object.keys(cur.query).length > 0) {
    return false
  }

  return true
}

function isSectionActive(section: NavSection, path: string) {
  const cur = parsePath(path)
  if (section.id === "dashboard") {
    return cur.seg[1] === "dashboard" || !cur.seg[1]
  }
  if (section.id === "cases") {
    return cur.seg[1] === "cases" || cur.seg[1] === "verification"
  }
  if (section.id === "users") {
    return cur.seg[1] === "users" || cur.seg[1] === "user-verification"
  }
  if (section.id === "reports") {
    return cur.seg[1] === "reports" || cur.seg[1] === "fraud" || cur.seg[1] === "blacklist"
  }
  if (section.id === "places") {
    return (
      cur.seg[1] === "shelters" ||
      cur.seg[1] === "clinics" ||
      cur.seg[1] === "place-verification" ||
      cur.seg[1] === "ratings"
    )
  }
  if (section.id === "map") {
    return cur.seg[1] === "map" || cur.seg[1] === "risk"
  }
  return false
}

function crumbs(path: string) {
  const { seg } = parsePath(path)
  const out: { label: string; to?: string }[] = [
    { label: "Admin", to: "/admin/dashboard" },
  ]
  const sec = NAV_SECTIONS.find((s) => isSectionActive(s, path))
  if (sec && sec.id !== "dashboard") {
    out.push({ label: sec.title, to: sec.to })
  }
  const child = sec?.children?.find((c) => isUrlActive(c.to, path))
  if (child && child.label !== sec?.title) {
    out.push({ label: child.label, to: seg[2] ? child.to : undefined })
  }
  if (seg[2]) {
    out.push({
      label:
        seg[2].toUpperCase() === seg[2] || /^[a-z]\d+$/i.test(seg[2])
          ? seg[2]
          : seg[2],
    })
  }
  return out
}

function Sidebar({
  collapsed,
  onNav,
  onToggle,
  drawer,
}: {
  collapsed: boolean
  onNav: () => void
  onToggle?: () => void
  drawer?: boolean
}) {
  const { go, path } = useApp()
  const { reports } = useAdmin()
  const cases = useCases()

  const pendingCasesCount = cases.filter((c) => c.status === "pending").length
  const newReportsCount = reports.filter((r) => r.status === "Mới").length

  const badges: Record<string, number> = {
    pendingCases: pendingCasesCount,
    newReports: newReportsCount,
  }

  const slim = collapsed && !drawer

  // Manage open state for Accordion sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    NAV_SECTIONS.forEach((s) => {
      if (s.children && isSectionActive(s, path)) {
        init[s.id] = true
      }
    })
    return init
  })

  // Auto-expand section when current route changes
  useEffect(() => {
    NAV_SECTIONS.forEach((s) => {
      if (s.children && isSectionActive(s, path)) {
        setOpenSections((prev) => ({ ...prev, [s.id]: true }))
      }
    })
  }, [path])

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Hover state for floating flyout when slim
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  return (
    <div className="relative flex h-full flex-col bg-ink text-cream select-none">
      {/* 1. Header: Branded Warm Card Logo, NO "HAPPY PAWS" text */}
      <div
        className={cx(
          "flex h-16 shrink-0 items-center border-b border-cream/10 px-3",
          slim ? "justify-center" : "justify-between"
        )}
      >
        <NavBtn
          type="button"
          onClick={() => {
            go("/admin/dashboard")
            onNav()
          }}
          className="flex items-center gap-2.5 group cursor-pointer text-left select-none outline-none"
          title="HappyPaw Quản Trị"
        >
          {/* Card nền kem ấm bo góc làm bừng sáng logo móng vuốt */}
          <div
            className={cx(
              "flex items-center justify-center rounded-xl bg-paper border border-line/60 shadow-sm transition-transform group-hover:scale-105 shrink-0",
              slim ? "size-10 p-1" : "h-10 px-2.5 py-1"
            )}
          >
            <img
              src={logoSvg}
              alt="HappyPaw Logo"
              className={cx("object-contain", slim ? "size-7" : "h-7 w-auto")}
            />
          </div>

          {!slim && (
            <div className="flex flex-col min-w-0">
              <span className="font-display font-extrabold text-cream text-[15px] leading-tight tracking-wide">
                Admin Portal
              </span>
              <span className="text-[10px] font-bold text-butter/80 uppercase tracking-wider">
                Hệ thống Quản trị
              </span>
            </div>
          )}
        </NavBtn>
      </div>

      {/* 2. Scrollable Navigation List */}
      <nav
        className="flex-1 overflow-y-auto min-h-0 px-2.5 py-3 space-y-1 dark-scrollbar"
        aria-label="Điều hướng quản trị"
      >
        {NAV_SECTIONS.map((sec) => {
          const secActive = isSectionActive(sec, path)
          const isOpen = !!openSections[sec.id]
          const badgeCount = sec.badgeKey ? badges[sec.badgeKey] || 0 : 0
          const hasChildren = !!sec.children && sec.children.length > 0

          return (
            <div
              key={sec.id}
              className="relative"
              onMouseEnter={() => slim && setHoveredSection(sec.id)}
              onMouseLeave={() => slim && setHoveredSection(null)}
            >
              {/* Parent Item */}
              <NavBtn
                type="button"
                onClick={() => {
                  if (slim) {
                    if (sec.to) {
                      go(sec.to)
                      onNav()
                    }
                    return
                  }
                  if (hasChildren) {
                    toggleSection(sec.id)
                  } else if (sec.to) {
                    go(sec.to)
                    onNav()
                  }
                }}
                title={slim ? sec.title : undefined}
                className={cx(
                  "group relative flex w-full items-center gap-2.5 rounded-xl text-left text-[13.5px] font-bold transition-all duration-150 outline-none cursor-pointer",
                  slim
                    ? "h-11 justify-center px-0"
                    : "min-h-10 px-3 py-2 justify-between",
                  // Active styling: Solid Butter Tag with WCAG AAA contrast
                  secActive && (!hasChildren || !isOpen)
                    ? "bg-butter text-ink font-black shadow-[0_2px_8px_rgba(255,242,122,0.25)]"
                    : secActive && hasChildren && isOpen
                      ? "bg-white/10 text-white font-extrabold"
                      : "text-cream/75 hover:bg-white/8 hover:text-white"
                )}
              >
                <div className={cx("flex items-center gap-2.5 min-w-0", slim && "justify-center")}>
                  <span
                    className={cx(
                      "shrink-0 transition-transform group-hover:scale-110",
                      secActive && (!hasChildren || !isOpen)
                        ? "text-ink"
                        : secActive
                          ? "text-butter"
                          : "text-cream/80 group-hover:text-butter"
                    )}
                  >
                    {sec.icon}
                  </span>

                  {!slim && (
                    <span className="truncate tracking-wide font-display text-[13.5px]">
                      {sec.title}
                    </span>
                  )}
                </div>

                {/* Right side: Badge & Accordion Arrow (when not slim) */}
                {!slim && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {badgeCount > 0 && (
                      <span
                        className={cx(
                          "rounded-full px-1.5 py-0.2 text-[10.5px] font-black min-w-5 text-center",
                          secActive && (!hasChildren || !isOpen)
                            ? "bg-ink text-butter"
                            : sec.badgeKey === "newReports"
                              ? "bg-coral text-white"
                              : "bg-orange text-white"
                        )}
                      >
                        {badgeCount}
                      </span>
                    )}

                    {hasChildren && (
                      <ChevronDown
                        className={cx(
                          "size-4 shrink-0 transition-transform duration-200",
                          isOpen ? "rotate-180 text-cream" : "text-cream/40 group-hover:text-cream"
                        )}
                      />
                    )}
                  </div>
                )}

                {/* Slim Badge indicator (dot or small pill) */}
                {slim && badgeCount > 0 && (
                  <span
                    className={cx(
                      "absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full text-[9px] font-black",
                      sec.badgeKey === "newReports" ? "bg-coral text-white" : "bg-orange text-white"
                    )}
                  >
                    {badgeCount}
                  </span>
                )}
              </NavBtn>

              {/* Submenu Accordion Items (when expanded) */}
              {!slim && hasChildren && isOpen && (
                <div className="relative mt-1 ml-4 pl-3 space-y-0.5 border-l-2 border-cream/15 animate-[pop_0.15s_ease-out]">
                  {sec.children?.map((child) => {
                    const subAct = isUrlActive(child.to, path)
                    const subBadge = child.badgeKey ? badges[child.badgeKey] || 0 : 0

                    return (
                      <NavBtn
                        key={child.to + child.label}
                        type="button"
                        onClick={() => {
                          go(child.to)
                          onNav()
                        }}
                        className={cx(
                          "group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors outline-none cursor-pointer",
                          subAct
                            ? "bg-butter text-ink font-black shadow-sm"
                            : "text-cream/65 hover:bg-white/8 hover:text-white font-semibold"
                        )}
                      >
                        <span className="truncate">{child.label}</span>
                        {subBadge > 0 && (
                          <span
                            className={cx(
                              "rounded-full px-1.5 py-0.2 text-[10px] font-black",
                              subAct
                                ? "bg-ink text-butter"
                                : child.badgeKey === "newReports"
                                  ? "bg-coral text-white"
                                  : "bg-orange text-white"
                            )}
                          >
                            {subBadge}
                          </span>
                        )}
                      </NavBtn>
                    )
                  })}
                </div>
              )}

              {/* Collapsed Mode: Floating Flyout Popover on Hover */}
              {slim && hoveredSection === sec.id && (
                <div
                  className="absolute left-full top-0 ml-2 z-50 min-w-52 rounded-2xl border border-cream/20 bg-ink p-2 text-cream shadow-2xl animate-[pop_0.15s_ease-out]"
                  onMouseEnter={() => setHoveredSection(sec.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="flex items-center justify-between border-b border-cream/15 px-2.5 pb-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-butter">{sec.icon}</span>
                      <span className="font-display text-sm font-bold text-white">
                        {sec.title}
                      </span>
                    </div>
                    {badgeCount > 0 && (
                      <span
                        className={cx(
                          "rounded-full px-1.5 py-0.2 text-[10px] font-black",
                          sec.badgeKey === "newReports"
                            ? "bg-coral text-white"
                            : "bg-orange text-white"
                        )}
                      >
                        {badgeCount}
                      </span>
                    )}
                  </div>

                  {hasChildren ? (
                    <div className="mt-1.5 space-y-0.5">
                      {sec.children?.map((child) => {
                        const subAct = isUrlActive(child.to, path)
                        const subBadge = child.badgeKey ? badges[child.badgeKey] || 0 : 0
                        return (
                          <NavBtn
                            key={child.to + child.label}
                            type="button"
                            onClick={() => {
                              go(child.to)
                              onNav()
                              setHoveredSection(null)
                            }}
                            className={cx(
                              "flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs font-semibold transition-colors outline-none cursor-pointer",
                              subAct
                                ? "bg-butter text-ink font-black shadow-sm"
                                : "text-cream/80 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <span className="truncate">{child.label}</span>
                            {subBadge > 0 && (
                              <span
                                className={cx(
                                  "rounded-full px-1.5 text-[10px] font-black",
                                  subAct ? "bg-ink text-butter" : "bg-coral text-white"
                                )}
                              >
                                {subBadge}
                              </span>
                            )}
                          </NavBtn>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-1">
                      <NavBtn
                        type="button"
                        onClick={() => {
                          if (sec.to) {
                            go(sec.to)
                            onNav()
                            setHoveredSection(null)
                          }
                        }}
                        className="w-full text-left rounded-lg px-2 py-1 text-xs font-semibold hover:bg-white/10 text-cream/90 cursor-pointer"
                      >
                        Mở {sec.title}
                      </NavBtn>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 3. Footer: Nút Thu gọn / Mở rộng cố định ở chân trang */}
      {onToggle && !drawer && (
        <div className="border-t border-cream/15 p-2 shrink-0 bg-ink">
          <NavBtn
            type="button"
            onClick={onToggle}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-cream/70 hover:bg-white/10 hover:text-white transition-colors outline-none cursor-pointer"
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <>
                <ChevronLeft className="size-4" />
                <span>Thu gọn</span>
              </>
            )}
          </NavBtn>
        </div>
      )}
    </div>
  )
}

function GlobalSearch({
  autoFocus,
  onClose,
}: {
  autoFocus?: boolean
  onClose?: () => void
}) {
  const { go } = useApp()
  const cases = useCases()
  const { users } = useAdmin()
  const [q, setQ] = useState("")

  const t = q.trim().toLowerCase()
  const hits: SearchHitItem[] = useMemo(() => {
    if (!t) return []
    const rc: SearchHitItem[] = cases
      .filter((c) => (c.id + c.name + c.district).toLowerCase().includes(t))
      .slice(0, 4)
      .map((c) => ({
        key: `case-${c.id}`,
        label: `${c.id} · ${c.name}`,
        sub: `${c.species} · ${c.district}`,
        icon: <PawPrint className="size-4 text-coral shrink-0" />,
        onPick: () => {
          go("/admin/cases/" + c.id)
          setQ("")
          onClose?.()
        },
      }))

    const ru: SearchHitItem[] = users
      .filter((u) => u.name.toLowerCase().includes(t) || u.id.toLowerCase() === t)
      .slice(0, 4)
      .map((u) => ({
        key: `user-${u.id}`,
        label: u.name,
        sub: `${u.role} · ${u.area || u.phone}`,
        icon: <UserCog className="size-4 text-sky shrink-0" />,
        onPick: () => {
          go("/admin/users/" + u.id)
          setQ("")
          onClose?.()
        },
      }))

    return [...rc, ...ru]
  }, [t, cases, users, go, onClose])

  return (
    <div className="relative min-w-0 flex-1 md:max-w-md">
      <SearchInput
        mode="rich"
        value={q}
        onChange={setQ}
        hits={hits}
        autoFocus={autoFocus}
        placeholder="Tìm case, user, mã báo cáo…"
        className="w-full"
      />
    </div>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { go, logout, path, account } = useApp()
  const adminAccount = account?.role === "admin" ? account : MOCK_ADMIN_ACCOUNT
  const { reports, users } = useAdmin()
  const cases = useCases()
  const [bell, setBell] = useState(false)
  const [menu, setMenu] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const pendingRescue = cases.filter((c) => c.status === "pending").length
  const newReports = reports.filter((r) => r.status === "Mới").length
  const suspicious = users.filter(
    (u) => u.status !== "Hoạt động" || u.reports >= 3,
  ).length
  const total = pendingRescue + newReports
  const notes = [
    {
      icon: <ClipboardCheck className="size-4 text-orange" />,
      text: `${pendingRescue} rescue chờ xác minh`,
      to: "/admin/verification",
    },
    {
      icon: <FileWarning className="size-4 text-coral" />,
      text: `${newReports} report mới cần xử lý`,
      to: "/admin/reports",
    },
    {
      icon: <ShieldAlert className="size-4 text-plum" />,
      text: `${suspicious} user đáng ngờ`,
      to: "/admin/fraud",
    },
  ]
  const cr = crumbs(path)

  if (mobileSearchOpen) {
    return (
      <header className="sticky top-0 z-40 flex min-h-12 items-center gap-2 border-b border-line bg-cream/95 px-2.5 py-1.5 backdrop-blur-sm md:px-5">
        <GlobalSearch
          autoFocus
          onClose={() => setMobileSearchOpen(false)}
        />
        <IconBtn
          variant="ghost"
          label="Đóng tìm kiếm"
          onClick={() => setMobileSearchOpen(false)}
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper md:hidden"
        >
          <X className="size-5" />
        </IconBtn>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 flex min-h-12 items-center gap-x-2 md:gap-x-3 border-b border-line bg-cream/95 px-2.5 py-1.5 backdrop-blur-sm md:px-5">
      <IconBtn
        variant="ghost"
        label="Mở menu điều hướng"
        onClick={onMenu}
        className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper md:size-9 lg:hidden"
      >
        <Menu className="size-5" />
      </IconBtn>
      <nav
        aria-label="Breadcrumb"
        className="hidden min-w-0 items-center gap-1 text-[13px] font-bold text-brown-soft md:flex"
      >
        {cr.map((c, i) => (
          <span key={i} className="flex items-center gap-1 whitespace-nowrap">
            {i > 0 && <ChevronRight className="size-3.5" />}
            {c.to ? (
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => go(c.to!)}
                className="inline h-auto p-0 hover:text-brown hover:underline font-bold text-[13px]"
              >
                {c.label}
              </Btn>
            ) : (
              <span className={i === cr.length - 1 ? "text-brown" : ""}>
                {c.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none">
        <div className="hidden md:block">
          <GlobalSearch />
        </div>
        <IconBtn
          variant="ghost"
          label="Tìm kiếm toàn hệ thống"
          onClick={() => setMobileSearchOpen(true)}
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper md:hidden"
        >
          <Search className="size-5" />
        </IconBtn>
        <div className="relative">
          <IconBtn
            variant="ghost"
            label={`Thông báo (${total})`}
            onClick={() => {
              setBell(!bell)
              setMenu(false)
            }}
            className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper hover:border-brown md:size-9"
          >
            <Bell className="size-[18px]" />
            {total > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[10px] font-extrabold text-white">
                {total}
              </span>
            )}
          </IconBtn>
          {bell && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-brown/40 bg-paper p-2 shadow-lg">
              <p className="px-2 py-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
                Cần xử lý
              </p>
              {notes.map((n) => (
                <Btn
                  variant="ghost"
                  size="sm"
                  key={n.to}
                  onClick={() => {
                    go(n.to)
                    setBell(false)
                  }}
                  className="flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-2 text-left text-sm font-bold hover:bg-butter/40"
                >
                  {n.icon}
                  {n.text}
                </Btn>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <IconBtn
            variant="ghost"
            label="Menu quản trị viên"
            onClick={() => {
              setMenu(!menu)
              setBell(false)
            }}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-brown bg-ink font-display text-sm font-bold text-butter md:size-9"
          >
            AD
          </IconBtn>
          {menu && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-brown/40 bg-paper p-2 shadow-lg">
              <div className="border-b border-line px-2 pb-2">
                <p className="text-sm font-extrabold">{adminAccount.name}</p>
                <p className="text-xs text-brown-soft">{adminAccount.email}</p>
              </div>
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  setMenu(false)
                }}
                className="mt-1 flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-2 text-left text-sm font-bold text-coral hover:bg-coral-soft"
              >
                <LogOut className="size-4" />
                Đăng xuất
              </Btn>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Page({ path }: { path: string }) {
  const { seg } = parsePath(path)
  const [, section, id] = seg
  switch (section) {
    case "cases":
      return id ? <CaseDetail id={id} /> : <CaseList path={path} />
    case "verification":
      return <Verification />
    case "users":
      return id ? <UserDetail id={id} /> : <UserList path={path} />
    case "user-verification":
      return <UserVerification />
    case "reports":
      return <ReportQueue />
    case "fraud":
      return <Fraud uid={id} />
    case "blacklist":
      return <Blacklist />
    case "risk":
      return <RiskPage />
    case "shelters":
      return <ShelterPage />
    case "clinics":
      return <ClinicPage />
    case "place-verification":
      return <PlaceVerification />
    case "ratings":
      return <RatingsPage />
    case "map":
      return <MapManagement path={path} />
    default:
      return <Dashboard />
  }
}

const DEFAULT_SIDEBAR_WIDTH = 260
const MIN_SIDEBAR_WIDTH = 220
const MAX_SIDEBAR_WIDTH = 400

export default function AdminApp({ path }: { path: string }) {
  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth >= 1024 &&
      window.innerWidth < 1280,
  )
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_SIDEBAR_WIDTH
    const saved = localStorage.getItem("happypaw_admin_sidebar_width")
    const parsed = saved ? parseInt(saved, 10) : DEFAULT_SIDEBAR_WIDTH
    return isNaN(parsed)
      ? DEFAULT_SIDEBAR_WIDTH
      : Math.min(Math.max(parsed, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH)
  })
  const [isResizing, setIsResizing] = useState(false)
  const [drawer, setDrawer] = useState(false)

  // Drag-to-resize listener
  useEffect(() => {
    if (!isResizing) return
    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH)
      setSidebarWidth(newWidth)
    }
    const onMouseUp = () => {
      setIsResizing(false)
      localStorage.setItem("happypaw_admin_sidebar_width", sidebarWidth.toString())
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, sidebarWidth])

  useEffect(() => {
    setDrawer(false)
  }, [path])

  const key = useMemo(() => parsePath(path).seg.join("/"), [path])

  return (
    <div className="flex min-h-screen w-full max-w-full bg-cream text-brown">
      {/* Desktop & Laptop Sidebar */}
      <aside
        style={{ width: collapsed ? 64 : sidebarWidth }}
        className={cx(
          "relative sticky top-0 hidden h-screen shrink-0 transition-[width] duration-150 ease-out lg:block",
          isResizing && "transition-none",
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onNav={() => { }}
          onToggle={() => setCollapsed(!collapsed)}
        />

        {/* Resizer Handle */}
        {!collapsed && (
          <div
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizing(true)
            }}
            onDoubleClick={() => {
              setSidebarWidth(DEFAULT_SIDEBAR_WIDTH)
              localStorage.setItem("happypaw_admin_sidebar_width", DEFAULT_SIDEBAR_WIDTH.toString())
            }}
            className={cx(
              "absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-butter/70 transition-colors z-30 group",
              isResizing && "bg-butter w-1.5 shadow-[0_0_8px_var(--color-butter)]"
            )}
            title="Kéo để chỉnh độ rộng (Nhấp đúp để đặt lại 260px)"
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-8 rounded-full bg-cream/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </aside>

      {/* Mobile & Tablet Drawer (< 1024px) */}
      {drawer && (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu quản trị"
        >
          <div
            className="absolute inset-0 bg-brown/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 sm:w-80 max-w-[85vw] shadow-2xl animate-[rise_.2s_ease-out]">
            <Sidebar collapsed={false} drawer onNav={() => setDrawer(false)} />
            <IconBtn
              variant="ghost"
              label="Đóng menu"
              onClick={() => setDrawer(false)}
              className="!absolute right-2 top-2 grid size-10 place-items-center rounded-xl bg-white/10 text-cream hover:bg-white/20 transition-colors"
            >
              <X className="size-5" />
            </IconBtn>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setDrawer(true)} />
        <main key={key} className="min-w-0 flex-1 overflow-x-hidden p-3 md:p-5">
          <Page path={path} />
        </main>
      </div>
    </div>
  )
}

// keep lucide imports referenced for tree-shaking friendliness
void [ListChecks, Gavel, MapIcon, ShieldCheck, Layers, USERS]
