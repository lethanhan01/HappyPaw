import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts'
import { ChevronRight, CheckCircle2, FileWarning, MapPinned, PawPrint, Siren, TriangleAlert, UserPlus, Search as SearchIcon } from 'lucide-react'
import { useApp } from '@/store'
import { CLINICS, SHELTERS } from '@/constants'
import CityMap, { MapLegend, type Sel } from '@/features/map'
import { PetPhoto, Btn } from '@ui'
import { useAdmin } from '../store/adminStore'
import { ABtn, KpiCard, Panel, Title, useCases } from './AdminCommon'
import CaseTable from './CaseTable'

const C = { brown: '#6b4128', butter: '#e3c23a', sage: '#4f7f3e', soft: '#e6d3ad', coral: '#d8503f', grid: '#eadcb8', axis: '#8f6a55' }

interface TipP { active?: boolean; payload?: { name?: string; value?: number | string; color?: string; fill?: string }[]; label?: string | number }
function Tip({ active, payload, label, unit }: TipP & { unit?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brown/40 bg-paper px-2.5 py-1.5 text-xs shadow-md">
      {label !== undefined && <p className="mb-0.5 font-bold">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-1.5 font-semibold"><span className="size-2 rounded-sm" style={{ background: p.color || p.fill }} />{p.name}: <b>{p.value}{unit}</b></p>
      ))}
    </div>
  )
}
const axisProps = { tick: { fill: C.axis, fontSize: 11, fontWeight: 600 }, axisLine: false, tickLine: false } as const
const legend = { iconType: 'circle' as const, iconSize: 8, wrapperStyle: { fontSize: 12, fontWeight: 600 } }

const DAYS = [
  { d: 'T2', n: 9, r: 5 }, { d: 'T3', n: 12, r: 7 }, { d: 'T4', n: 8, r: 6 }, { d: 'T5', n: 15, r: 9 },
  { d: 'T6', n: 11, r: 8 }, { d: 'T7', n: 18, r: 10 }, { d: 'CN', n: 14, r: 9 },
]
const REP_DAYS = [{ d: 'T2', v: 3 }, { d: 'T3', v: 5 }, { d: 'T4', v: 4 }, { d: 'T5', v: 7 }, { d: 'T6', v: 6 }, { d: 'T7', v: 9 }, { d: 'CN', v: 8 }]

export default function Dashboard() {
  const { go } = useApp()
  const cases = useCases()
  const { reports, users, risks } = useAdmin()
  const [sel, setSel] = useState<Sel | null>(null)

  const open = cases.filter((c) => c.status !== 'resolved')
  const resolved = cases.filter((c) => c.status === 'resolved').length
  const pending = cases.filter((c) => c.status === 'pending').length
  const rescueActive = cases.filter((c) => c.type === 'rescue' && c.status !== 'resolved').length
  const lost = cases.filter((c) => c.type === 'lost' && c.status !== 'resolved').length
  const openReports = reports.filter((r) => r.status !== 'Đã xử lý').length
  const newUsers = users.filter((u) => u.joined.endsWith('2026')).length
  const unassigned = cases.filter((c) => c.type === 'rescue' && c.status === 'active' && !c.assignee).length
  const highReports = reports.filter((r) => r.status !== 'Đã xử lý' && (r.severity === 'High' || r.severity === 'Critical')).length
  const multiReportUsers = users.filter((u) => u.reports >= 3).length
  const rate = cases.length ? Math.round((resolved / cases.length) * 100) : 0

  const alerts = [
    { n: unassigned || 3, dotColor: 'bg-coral', t: 'rescue chưa có người nhận', to: '/admin/cases?status=active' },
    { n: highReports || 4, dotColor: 'bg-orange', t: 'report mức độ cao', to: '/admin/reports' },
    { n: pending || 2, dotColor: 'bg-amber-500', t: 'rescue chờ xác minh', to: '/admin/verification' },
    { n: multiReportUsers || 1, dotColor: 'bg-plum', t: 'user nhiều report', to: '/admin/fraud' },
  ]

  const byDistrict = useMemo(() => {
    const m: Record<string, number> = {}
    cases.forEach((c) => { m[c.district] = (m[c.district] || 0) + 1 })
    return Object.entries(m).map(([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n).slice(0, 7)
  }, [cases])
  const byType = (['rescue', 'lost', 'found'] as const).map((t) => ({
    name: { rescue: 'Cứu hộ', lost: 'Thất lạc', found: 'Nhặt được' }[t],
    open: cases.filter((c) => c.type === t && c.status !== 'resolved').length,
    done: cases.filter((c) => c.type === t && c.status === 'resolved').length,
  }))
  const donut = [{ name: 'Đã giải quyết', v: resolved }, { name: 'Đang mở', v: cases.length - resolved }]
  const selCase = sel?.kind === 'case' ? cases.find((c) => c.id === sel.id) : null

  return (
    <div className="min-w-0">
      <Title title="Dashboard" sub="Tổng quan hoạt động cứu hộ Happy Paws tại Hà Nội" />

      <section aria-label="Cần xử lý ngay" className="mb-4 rounded-2xl border border-coral/40 bg-coral-soft/40">
        <header className="flex items-center justify-between gap-2 px-3 pt-3 md:px-4">
          <h2 className="font-display text-[15px] font-bold">Cần xử lý ngay</h2>
          <ABtn s="sm" v="dark" onClick={() => go('/admin/cases?status=active')}>Xem tất cả</ABtn>
        </header>
        <ul className="grid gap-1 p-2 sm:grid-cols-2 xl:grid-cols-4">
          {alerts.map((a) => (
            <li key={a.t}>
              <Btn variant="ghost" size="sm" onClick={() => go(a.to)} className="flex min-h-11 w-full items-center justify-start gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm hover:bg-paper">
                <span className={`size-2 shrink-0 rounded-full ${a.dotColor}`} />
                <span className="min-w-0 flex-1 font-semibold leading-tight"><b className="font-display text-lg">{a.n}</b> {a.t}</span>
                <ChevronRight className="size-4 shrink-0 text-brown-soft" />
              </Btn>
            </li>
          ))}
        </ul>
      </section>

      <div className="-mx-3 mb-4 flex snap-x snap-mandatory scroll-px-3 gap-2.5 overflow-x-auto px-3 pb-1 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-7 [&>*]:w-[44%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-[30%] md:[&>*]:w-auto">
        <KpiCard icon={<PawPrint />} label="Tổng case" value={cases.length} delta={8} hint="Tất cả case trên hệ thống" onClick={() => go('/admin/cases')} />
        <KpiCard icon={<Siren />} label="Đang cứu hộ" value={rescueActive} delta={12} goodWhenUp={false} hint="Rescue chưa đóng" tone="bg-coral-soft text-coral" onClick={() => go('/admin/cases?status=progress')} />
        <KpiCard icon={<SearchIcon />} label="Pet mất tích" value={lost} delta={-5} goodWhenUp={false} hint="Đang tìm chủ / pet" tone="bg-orange-soft text-orange" onClick={() => go('/admin/cases')} />
        <KpiCard icon={<CheckCircle2 />} label="Đã giải quyết" value={resolved} delta={15} hint="Đoàn tụ / cứu thành công" tone="bg-sage-soft text-sage-2" onClick={() => go('/admin/cases?status=resolved')} />
        <KpiCard icon={<UserPlus />} label="User mới" value={newUsers} delta={6} hint="Đăng ký tuần này" tone="bg-sky-soft text-sky-2" onClick={() => go('/admin/users')} />
        <KpiCard icon={<FileWarning />} label="Report chờ xử lý" value={openReports} delta={9} goodWhenUp={false} hint="Chưa được admin xử lý" tone="bg-coral-soft text-coral" onClick={() => go('/admin/reports')} />
        <KpiCard icon={<TriangleAlert />} label="Risk Areas" value={risks.length} delta={0} hint="Khu vực cảnh báo đang bật" tone="bg-plum-soft text-plum" onClick={() => go('/admin/risk')} />
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-3">
        <Panel title={<span className="inline-flex items-center gap-1.5"><MapPinned className="size-4" />Realtime Rescue Map</span>} right={<span className="text-xs font-semibold text-brown-soft">{open.length} case chưa giải quyết</span>} className="xl:col-span-2">
          <div className="relative overflow-hidden rounded-xl border border-line">
            <CityMap className="h-56 sm:h-64" cases={open} shelters={SHELTERS} clinics={CLINICS} risks={risks} selected={sel} onSelect={setSel} showLabels={false} revealIds={open.map((c) => c.id)} controlsClass="!bottom-2 !right-2 scale-90 origin-bottom-right" />
            {selCase && (
              <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-4rem)] items-center gap-2 rounded-xl border border-brown/40 bg-paper p-2 text-xs shadow">
                <PetPhoto src={selCase.photo} species={selCase.species} alt={selCase.name} className="size-10 shrink-0 rounded-lg" />
                <div className="min-w-0"><p className="truncate font-bold">{selCase.id} · {selCase.name}</p><p className="truncate text-brown-soft">{selCase.district}</p></div>
                <ABtn s="xs" v="dark" onClick={() => go('/admin/cases/' + selCase.id)}>Chi tiết</ABtn>
              </div>
            )}
          </div>
          <MapLegend defaultOpen={false} className="mt-2 !rounded-xl !border" />
        </Panel>
        <Panel title="Khu vực rủi ro" right={<ABtn s="sm" onClick={() => go('/admin/risk')}>Quản lý</ABtn>}>
          <ul className="divide-y divide-line/70">
            {[...risks].sort((a, b) => b.reports - a.reports).slice(0, 5).map((r) => (
              <li key={r.id}>
                <Btn variant="ghost" size="sm" onClick={() => go('/admin/risk')} className="flex min-h-11 w-full items-center justify-start gap-2 py-1.5 text-left text-[13px]">
                  <span className={`size-2 shrink-0 rounded-full ${r.severity === 'Cao' ? 'bg-coral' : r.severity === 'Trung bình' ? 'bg-orange' : 'bg-plum'}`} />
                  <span className="min-w-0 flex-1"><b className="block truncate">{r.title}</b><span className="text-xs text-brown-soft">{r.severity} · {r.reports} report</span></span>
                  <ChevronRight className="size-4 text-brown-soft" />
                </Btn>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Panel title="Case theo ngày (7 ngày)" className="xl:col-span-3">
          <div className="h-52" role="img" aria-label="Biểu đồ case mới và đã giải quyết theo ngày">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAYS} margin={{ top: 6, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="d" {...axisProps} /><YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<Tip />} />
                <Legend {...legend} />
                <Area type="monotone" dataKey="n" name="Case mới" stroke={C.brown} fill={C.brown} fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="r" name="Đã giải quyết" stroke={C.sage} fill={C.sage} fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Case theo quận" className="xl:col-span-3">
          <div className="h-52" role="img" aria-label="Biểu đồ số case theo quận">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDistrict} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 4" horizontal={false} />
                <XAxis type="number" {...axisProps} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={84} {...axisProps} />
                <Tooltip content={<Tip unit=" case" />} cursor={{ fill: 'rgba(107,65,40,.05)' }} />
                <Bar dataKey="n" name="Số case" fill={C.brown} radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Tỷ lệ thành công" className="xl:col-span-2">
          <div className="relative h-48" role="img" aria-label={`Tỷ lệ giải quyết thành công ${rate}%`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donut} dataKey="v" nameKey="name" innerRadius="64%" outerRadius="88%" startAngle={90} endAngle={-270} stroke="#fffaf0" strokeWidth={2}>
                  <Cell fill={C.sage} /><Cell fill={C.soft} />
                </Pie>
                <Tooltip content={<Tip unit=" case" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <p className="font-display text-3xl font-bold leading-none">{rate}%</p>
              <p className="text-[11px] font-semibold text-brown-soft">{resolved}/{cases.length} case</p>
            </div>
          </div>
        </Panel>
        <Panel title="Đang mở vs đã giải quyết" className="xl:col-span-2">
          <div className="h-48" role="img" aria-label="Biểu đồ case đang mở và đã giải quyết theo loại">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} margin={{ top: 6, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="name" {...axisProps} /><YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<Tip unit=" case" />} cursor={{ fill: 'rgba(107,65,40,.05)' }} />
                <Legend {...legend} />
                <Bar dataKey="open" name="Đang mở" stackId="a" fill={C.butter} barSize={26} />
                <Bar dataKey="done" name="Đã giải quyết" stackId="a" fill={C.sage} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Report theo thời gian" className="xl:col-span-2">
          <div className="h-48" role="img" aria-label="Biểu đồ số report theo ngày">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REP_DAYS} margin={{ top: 6, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke={C.grid} strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="d" {...axisProps} /><YAxis {...axisProps} allowDecimals={false} />
                <Tooltip content={<Tip unit=" report" />} />
                <Line type="monotone" dataKey="v" name="Report" stroke={C.coral} strokeWidth={2} dot={{ r: 3, fill: C.coral, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Case gần đây" right={<ABtn s="sm" onClick={() => go('/admin/cases')}>Xem tất cả</ABtn>}>
        <CaseTable dense rows={[...cases].sort((a, b) => a.minutesAgo - b.minutesAgo).slice(0, 8)} />
      </Panel>
    </div>
  )
}
