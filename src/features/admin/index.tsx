import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Bell,
  Ban,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Cross,
  FileWarning,
  Gavel,
  Home,
  LayoutDashboard,
  ListChecks,
  Map as MapIcon,
  Menu,
  PawPrint,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Store,
  TriangleAlert,
  UserCheck,
  Users,
  X,
  LogOut,
  MapPin,
  Siren,
  Skull,
  Hourglass,
  CheckCircle2,
  Layers,
  Activity,
  UserCog,
  Building2,
  ShieldQuestion,
} from 'lucide-react'
import { parsePath, cx } from '@/lib'
import { useApp } from '@/store'
import { Logo, Btn, IconBtn, Input } from '@ui'
import { USERS } from '@/constants'
import { MOCK_ADMIN_ACCOUNT } from '@/constants/mock/accounts'
import { useAdmin } from './store/adminStore'
import { useCases } from './components/AdminCommon'
import Dashboard from './components/Dashboard'
import { CaseList, CaseDetail } from './components/Cases'
import Verification from './components/Verification'
import { UserList, UserDetail, UserVerification } from './components/Users'
import { ReportQueue, Fraud, Blacklist } from './components/Moderation'
import RiskPage from './components/Risk'
import { ShelterPage, ClinicPage, PlaceVerification, RatingsPage } from './components/Places'
import MapManagement from './components/MapManagement'

interface Item { to: string; label: string; icon: ReactNode }
interface Group { title?: string; items: Item[] }
const I = 'size-[18px] shrink-0'
const GROUPS: Group[] = [
  { items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className={I} /> }] },
  {
    title: 'Rescue Management',
    items: [
      { to: '/admin/cases', label: 'Tất cả case', icon: <PawPrint className={I} /> },
      { to: '/admin/cases?status=progress', label: 'Đang xử lý', icon: <Activity className={I} /> },
      { to: '/admin/verification', label: 'Chờ xác minh', icon: <Hourglass className={I} /> },
      { to: '/admin/cases?status=resolved', label: 'Đã giải quyết', icon: <CheckCircle2 className={I} /> },
    ],
  },
  {
    title: 'User Management',
    items: [
      { to: '/admin/users', label: 'Users', icon: <Users className={I} /> },
      { to: '/admin/user-verification', label: 'Verification', icon: <UserCheck className={I} /> },
      { to: '/admin/users?filter=ban', label: 'Ban / Unban', icon: <Ban className={I} /> },
    ],
  },
  {
    title: 'Report & Moderation',
    items: [
      { to: '/admin/reports', label: 'Report Queue', icon: <FileWarning className={I} /> },
      { to: '/admin/fraud', label: 'Fraud Investigation', icon: <ShieldQuestion className={I} /> },
      { to: '/admin/blacklist', label: 'Blacklist', icon: <Skull className={I} /> },
    ],
  },
  {
    title: 'Shelter & Clinic',
    items: [
      { to: '/admin/shelters', label: 'Shelters', icon: <Home className={I} /> },
      { to: '/admin/clinics', label: 'Clinics', icon: <Cross className={I} /> },
      { to: '/admin/place-verification', label: 'Verification', icon: <BadgeCheck className={I} /> },
      { to: '/admin/ratings', label: 'Ratings', icon: <Star className={I} /> },
    ],
  },
  {
    title: 'Map Management',
    items: [
      { to: '/admin/map?layer=rescue', label: 'Rescue pins', icon: <Siren className={I} /> },
      { to: '/admin/map?layer=lost', label: 'Lost pins', icon: <MapPin className={I} /> },
      { to: '/admin/map?layer=shelter', label: 'Shelters', icon: <Building2 className={I} /> },
      { to: '/admin/map?layer=clinic', label: 'Clinics', icon: <Store className={I} /> },
      { to: '/admin/risk', label: 'Risk zones', icon: <TriangleAlert className={I} /> },
    ],
  },
]

function isActive(item: Item, path: string) {
  const cur = parsePath(path)
  const it = parsePath(item.to)
  if (cur.seg[1] !== it.seg[1]) return false
  const keys = ['status', 'filter', 'layer']
  for (const k of keys) {
    const want = it.query[k]
    const have = cur.query[k]
    if (cur.seg[1] === 'map' && k === 'layer') { if ((have || 'rescue') !== want) return false; continue }
    if (want !== undefined ? have !== want : have !== undefined && cur.seg[1] !== 'map') return false
  }
  return true
}

function crumbs(path: string) {
  const { seg } = parsePath(path)
  const flat = GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })))
  const hit = flat.find((i) => isActive(i, path)) || flat.find((i) => parsePath(i.to).seg[1] === seg[1])
  const out: { label: string; to?: string }[] = [{ label: 'Admin', to: '/admin/dashboard' }]
  if (hit?.group) out.push({ label: hit.group })
  if (hit) out.push({ label: hit.label, to: seg[2] ? hit.to : undefined })
  if (seg[2]) out.push({ label: seg[2].toUpperCase() === seg[2] || /^[a-z]\d+$/i.test(seg[2]) ? seg[2] : seg[2] })
  return out
}

function Sidebar({ collapsed, onNav, onToggle, drawer }: { collapsed: boolean; onNav: () => void; onToggle?: () => void; drawer?: boolean }) {
  const { go, path } = useApp()
  const { reports } = useAdmin()
  const cases = useCases()
  const badges: Record<string, number> = {
    '/admin/verification': cases.filter((c) => c.status === 'pending').length,
    '/admin/reports': reports.filter((r) => r.status === 'Mới').length,
  }
  const slim = collapsed && !drawer
  return (
    <div className="flex h-full flex-col bg-ink text-cream">
      <div className={cx('flex h-14 shrink-0 items-center gap-1.5 border-b border-white/10 px-3', slim && 'justify-center')}>
        <div className="min-w-0"><Logo compact={slim} onClick={() => { go('/admin/dashboard'); onNav() }} /></div>
        {!slim && <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 font-display text-[10px] font-bold text-butter uppercase tracking-wider">Admin</span>}
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Điều hướng admin">
        {GROUPS.map((g, gi) => (
          <div key={gi} className="mb-3">
            {g.title && (slim ? <div className="mx-3 mb-1 border-t border-white/10" /> : <p className="mb-1 px-3 text-[10.5px] font-bold uppercase tracking-[0.12em] text-cream/50">{g.title}</p>)}
            {g.items.map((it) => {
              const act = isActive(it, path)
              const bd = badges[it.to.split('?')[0]] && !it.to.includes('?') ? badges[it.to] : 0
              return (
                <Btn key={it.to + it.label} variant="ghost" title={it.label} aria-current={act ? 'page' : undefined}
                  onClick={() => { go(it.to); onNav() }}
                  className={cx('mb-0.5 flex h-auto min-h-11 w-full items-center justify-start gap-2.5 rounded-lg px-3 py-1.5 text-left text-[13.5px] font-semibold transition lg:min-h-9', slim && 'justify-center px-0',
                    act ? 'bg-butter text-brown font-bold' : 'text-cream/80 hover:bg-white/10 hover:text-white')}>
                  {it.icon}
                  {!slim && <span className="flex-1 truncate">{it.label}</span>}
                  {!slim && bd > 0 && <span className={cx('rounded-full px-1.5 text-[11px] font-extrabold', act ? 'bg-brown text-butter' : 'bg-coral text-white')}>{bd}</span>}
                </Btn>
              )
            })}
          </div>
        ))}
      </nav>
      {onToggle && !drawer && (
        <Btn variant="ghost" onClick={onToggle} className="hidden h-10 shrink-0 items-center justify-center gap-2 border-t border-white/10 text-xs font-bold text-cream/70 hover:text-white lg:flex" aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}>
          {collapsed ? <ChevronRight className="size-4" /> : <><ChevronLeft className="size-4" />Thu gọn</>}
        </Btn>
      )}
    </div>
  )
}

function GlobalSearch() {
  const { go } = useApp()
  const cases = useCases()
  const { users } = useAdmin()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const t = q.trim().toLowerCase()
  const rc = t ? cases.filter((c) => (c.id + c.name + c.district).toLowerCase().includes(t)).slice(0, 4) : []
  const ru = t ? users.filter((u) => u.name.toLowerCase().includes(t) || u.id === t).slice(0, 4) : []
  const pick = (to: string) => { go(to); setOpen(false); setQ('') }
  return (
    <div ref={ref} className="relative min-w-0 flex-1 md:max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brown-soft" />
      <Input size="sm" value={q} onChange={(e) => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)}
        placeholder="Tìm case, user, mã báo cáo…" aria-label="Tìm kiếm toàn hệ thống"
        className="h-11 pl-9 md:h-9" />
      {open && t && (
        <div className="absolute left-0 right-0 top-11 z-50 max-h-80 overflow-y-auto rounded-xl border border-brown/40 bg-paper p-2 shadow-lg">
          {rc.length === 0 && ru.length === 0 && <p className="px-3 py-4 text-center text-sm text-brown-soft">Không tìm thấy kết quả.</p>}
          {rc.map((c) => <Btn variant="ghost" size="sm" key={c.id} onClick={() => pick('/admin/cases/' + c.id)} className="flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-butter/40"><PawPrint className="size-4" /><b>{c.id}</b> {c.name} <span className="text-brown-soft">· {c.district}</span></Btn>)}
          {ru.map((u) => <Btn variant="ghost" size="sm" key={u.id} onClick={() => pick('/admin/users/' + u.id)} className="flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-butter/40"><UserCog className="size-4" /><b>{u.name}</b> <span className="text-brown-soft">· {u.area}</span></Btn>)}
        </div>
      )}
    </div>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { go, logout, path, account } = useApp()
  const adminAccount = account?.role === 'admin' ? account : MOCK_ADMIN_ACCOUNT
  const { reports, users } = useAdmin()
  const cases = useCases()
  const [bell, setBell] = useState(false)
  const [menu, setMenu] = useState(false)
  const pendingRescue = cases.filter((c) => c.status === 'pending').length
  const newReports = reports.filter((r) => r.status === 'Mới').length
  const suspicious = users.filter((u) => u.status !== 'Hoạt động' || u.reports >= 3).length
  const total = pendingRescue + newReports
  const notes = [
    { icon: <ClipboardCheck className="size-4 text-orange" />, text: `${pendingRescue} rescue chờ xác minh`, to: '/admin/verification' },
    { icon: <FileWarning className="size-4 text-coral" />, text: `${newReports} report mới cần xử lý`, to: '/admin/reports' },
    { icon: <ShieldAlert className="size-4 text-plum" />, text: `${suspicious} user đáng ngờ`, to: '/admin/fraud' },
  ]
  const cr = crumbs(path)
  return (
    <header className="sticky top-0 z-40 flex min-h-12 items-center gap-x-2 md:gap-x-3 border-b border-line bg-cream/95 px-2.5 py-1.5 backdrop-blur-sm md:px-5">
      <IconBtn variant="ghost" onClick={onMenu} aria-label="Mở menu" className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper md:size-9 lg:hidden"><Menu className="size-5" /></IconBtn>
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 text-[13px] font-bold text-brown-soft md:flex">
        {cr.map((c, i) => (
          <span key={i} className="flex items-center gap-1 whitespace-nowrap">
            {i > 0 && <ChevronRight className="size-3.5" />}
            {c.to ? <Btn variant="ghost" size="sm" onClick={() => go(c.to!)} className="inline h-auto p-0 hover:text-brown hover:underline font-bold text-[13px]">{c.label}</Btn> : <span className={i === cr.length - 1 ? 'text-brown' : ''}>{c.label}</span>}
          </span>
        ))}
      </nav>
      <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none">
        <GlobalSearch />
        <div className="relative">
          <IconBtn variant="ghost" onClick={() => { setBell(!bell); setMenu(false) }} aria-label={`Thông báo (${total})`} className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-paper hover:border-brown md:size-9">
            <Bell className="size-[18px]" />
            {total > 0 && <span className="absolute -right-1 -top-1 grid min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[10px] font-extrabold text-white">{total}</span>}
          </IconBtn>
          {bell && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-brown/40 bg-paper p-2 shadow-lg">
              <p className="px-2 py-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft">Cần xử lý</p>
              {notes.map((n) => <Btn variant="ghost" size="sm" key={n.to} onClick={() => { go(n.to); setBell(false) }} className="flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-2 text-left text-sm font-bold hover:bg-butter/40">{n.icon}{n.text}</Btn>)}
            </div>
          )}
        </div>
        <div className="relative">
          <IconBtn variant="ghost" onClick={() => { setMenu(!menu); setBell(false) }} aria-label="Menu quản trị viên" className="grid size-11 shrink-0 place-items-center rounded-full border border-brown bg-ink font-display text-sm font-bold text-butter md:size-9">AD</IconBtn>
          {menu && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-brown/40 bg-paper p-2 shadow-lg">
              <div className="border-b border-line px-2 pb-2"><p className="text-sm font-extrabold">{adminAccount.name}</p><p className="text-xs text-brown-soft">{adminAccount.email}</p></div>
              <Btn variant="ghost" size="sm" onClick={() => { logout(); setMenu(false) }} className="mt-1 flex h-auto w-full items-center justify-start gap-2 rounded-lg px-2 py-2 text-left text-sm font-bold text-coral hover:bg-coral-soft"><LogOut className="size-4" />Đăng xuất</Btn>
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
    case 'cases': return id ? <CaseDetail id={id} /> : <CaseList path={path} />
    case 'verification': return <Verification />
    case 'users': return id ? <UserDetail id={id} /> : <UserList path={path} />
    case 'user-verification': return <UserVerification />
    case 'reports': return <ReportQueue />
    case 'fraud': return <Fraud uid={id} />
    case 'blacklist': return <Blacklist />
    case 'risk': return <RiskPage />
    case 'shelters': return <ShelterPage />
    case 'clinics': return <ClinicPage />
    case 'place-verification': return <PlaceVerification />
    case 'ratings': return <RatingsPage />
    case 'map': return <MapManagement path={path} />
    default: return <Dashboard />
  }
}

export default function AdminApp({ path }: { path: string }) {
  const [collapsed, setCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024 && window.innerWidth < 1280)
  const [drawer, setDrawer] = useState(false)
  useEffect(() => { setDrawer(false) }, [path])
  const key = useMemo(() => parsePath(path).seg.join('/'), [path])
  return (
    <div className="flex min-h-screen w-full max-w-full bg-cream text-brown">
      <aside className={cx('sticky top-0 hidden h-screen shrink-0 transition-[width] lg:block', collapsed ? 'w-16' : 'w-64')}>
        <Sidebar collapsed={collapsed} onNav={() => {}} onToggle={() => setCollapsed(!collapsed)} />
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal aria-label="Menu">
          <div className="absolute inset-0 bg-brown/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-[rise_.2s_ease-out]">
            <Sidebar collapsed={false} drawer onNav={() => setDrawer(false)} />
            <IconBtn variant="ghost" onClick={() => setDrawer(false)} aria-label="Đóng menu" className="!absolute right-2 top-1.5 grid size-11 place-items-center rounded-lg text-cream hover:bg-white/10"><X className="size-5" /></IconBtn>
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setDrawer(true)} />
        <main key={key} className="min-w-0 flex-1 overflow-x-hidden p-3 md:p-5"><Page path={path} /></main>
      </div>
    </div>
  )
}

// keep lucide imports referenced for tree-shaking friendliness
void [ListChecks, Gavel, MapIcon, ShieldCheck, Layers, USERS]
