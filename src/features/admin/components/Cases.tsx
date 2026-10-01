import { useMemo, useState } from 'react'
import { Activity, CheckCircle2, Check, FileSearch, Flag, Hourglass, MapPin, PawPrint, X } from 'lucide-react'
import { parsePath } from '@/lib'
import { useApp } from '@/store'
import { SHELTERS, CLINICS, timeAgo, userById } from '@/constants'
import type { Status } from '@/types'
import CityMap from '@/features/map'
import { Badge, PetPhoto, StatusBadge, Verified } from '@ui'
import { useAdmin, toggleIn } from '../store/adminStore'
import CaseTable from './CaseTable'
import { ABtn, ASelect, FilterBar, KpiCard, KpiRow, Panel, SearchBox, SevChip, Title, UserCell, caseTimeline, typeLabel, useCases, useRisk, type RiskLevel } from './AdminCommon'

const STATUS_OPTS: [string, string][] = [['', 'Mọi trạng thái'], ['active', 'Đang cần hỗ trợ'], ['progress', 'Đang xử lý'], ['pending', 'Chờ xác minh'], ['resolved', 'Đã giải quyết']]
const DATE_OPTS: [string, string][] = [['', 'Mọi thời gian'], ['60', 'Trong 1 giờ'], ['1440', 'Trong 24 giờ'], ['10080', 'Trong 7 ngày']]

export function CaseList({ path }: { path: string }) {
  const { go } = useApp()
  const cases = useCases()
  const risk = useRisk()
  const { query } = parsePath(path)
  const qStatus = query.status || ''
  const [f, setF] = useState({ q: '', type: '', district: '', date: '', risk: '' })
  const [prevQ, setPrevQ] = useState(qStatus)
  const [status, setStatus] = useState(qStatus)
  if (prevQ !== qStatus) { setPrevQ(qStatus); setStatus(qStatus) }
  const set = (k: keyof typeof f) => (v: string) => setF((o) => ({ ...o, [k]: v }))

  const rows = useMemo(() => cases.filter((c) => {
    const t = f.q.trim().toLowerCase()
    if (t && !(c.id + ' ' + c.name + ' ' + c.district + ' ' + c.street + ' ' + (userById(c.assignee)?.name || '')).toLowerCase().includes(t)) return false
    if (status === 'active' ? c.status !== 'active' : status && c.status !== status) return false
    if (f.type && c.type !== f.type) return false
    if (f.district && c.district !== f.district) return false
    if (f.date && c.minutesAgo > Number(f.date)) return false
    if (f.risk && risk(c) !== f.risk) return false
    return true
  }), [cases, f, status, risk])

  const districts = Array.from(new Set(cases.map((c) => c.district))).sort()
  const clear = () => { setF({ q: '', type: '', district: '', date: '', risk: '' }); setStatus('') }
  const activeN = (status ? 1 : 0) + Object.values(f).filter(Boolean).length
  const counts = { all: cases.length, progress: cases.filter((c) => c.status === 'progress').length, pending: cases.filter((c) => c.status === 'pending').length, resolved: cases.filter((c) => c.status === 'resolved').length }
  return (
    <div>
      <Title title="Quản lý case" sub={`${rows.length}/${cases.length} case`} />
      <KpiRow>
        <KpiCard icon={<PawPrint />} label="Tổng case" value={counts.all} onClick={() => setStatus('')} />
        <KpiCard icon={<Activity />} label="Đang xử lý" value={counts.progress} tone="bg-butter/60 text-brown" onClick={() => setStatus('progress')} />
        <KpiCard icon={<Hourglass />} label="Chờ xác minh" value={counts.pending} tone="bg-orange-soft text-brown" onClick={() => setStatus('pending')} />
        <KpiCard icon={<CheckCircle2 />} label="Đã giải quyết" value={counts.resolved} tone="bg-sage-soft text-sage-2" onClick={() => setStatus('resolved')} />
      </KpiRow>
      <SearchBox value={f.q} onChange={set('q')} placeholder="Tìm mã case, tên pet, quận…" className="mb-2 w-full sm:max-w-md md:hidden" />
      <FilterBar active={activeN - (f.q ? 1 : 0)} onClear={clear}>
        <SearchBox value={f.q} onChange={set('q')} placeholder="Tìm mã case, tên pet, quận…" className="hidden md:block" />
        <ASelect aria-label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)} className="!w-auto">{STATUS_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</ASelect>
        <ASelect aria-label="Loại" value={f.type} onChange={(e) => set('type')(e.target.value)} className="!w-auto"><option value="">Mọi loại</option><option value="lost">Thất lạc</option><option value="found">Nhặt được</option><option value="rescue">Cứu hộ</option></ASelect>
        <ASelect aria-label="Quận" value={f.district} onChange={(e) => set('district')(e.target.value)} className="!w-auto"><option value="">Mọi quận</option>{districts.map((d) => <option key={d}>{d}</option>)}</ASelect>
        <ASelect aria-label="Ngày" value={f.date} onChange={(e) => set('date')(e.target.value)} className="!w-auto">{DATE_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</ASelect>
        <ASelect aria-label="Risk" value={f.risk} onChange={(e) => set('risk')(e.target.value)} className="!w-auto"><option value="">Mọi mức risk</option>{(['Cao', 'Trung bình', 'Thấp'] as RiskLevel[]).map((r) => <option key={r}>{r}</option>)}</ASelect>
      </FilterBar>
      <CaseTable rows={rows} />
    </div>
  )
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return <div className="flex gap-3 border-b border-line/60 py-1.5 text-sm last:border-0"><dt className="w-32 shrink-0 text-brown-soft">{k}</dt><dd className="min-w-0 font-bold">{children}</dd></div>
}

export function CaseDetail({ id }: { id: string }) {
  const { go, getCase, updateCase, toast, proof } = useApp()
  const cases = useCases()
  const { reports, flaggedCases, evidenceCases } = useAdmin()
  const c = getCase(id)
  if (!c || !cases.find((x) => x.id === id)) return <Panel><p className="py-8 text-center font-bold">Không tìm thấy case {id}. <button className="underline" onClick={() => go('/admin/cases')}>Về danh sách</button></p></Panel>

  const rel = reports.filter((r) => r.caseId === c.id)
  const shelter = SHELTERS.find((s) => s.id === c.shelterId)
  const clinic = !shelter && c.type === 'rescue' ? [...CLINICS].sort((a, b) => Math.hypot(a.x - c.x, a.y - c.y) - Math.hypot(b.x - c.x, b.y - c.y))[0] : undefined
  const flagged = flaggedCases.includes(c.id)
  const evid = evidenceCases.includes(c.id)
  const pf = proof[c.id]
  const setStatus = (status: Status, msg: string) => { updateCase(c.id, { status }); toast(msg) }
  const trail = c.trail || [{ x: c.x, y: c.y, t: new Date(Date.now() - c.minutesAgo * 60000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), note: 'Vị trí báo cáo ban đầu: ' + c.street }]
  const rescuer = userById(c.assignee)
  const reporter = userById(c.reporter)

  return (
    <div>
      <Title back={() => go('/admin/cases')} title={`${c.id} · ${c.name}`} sub={`${typeLabel[c.type]} · ${c.district} · tạo ${timeAgo(c.minutesAgo)}`}
        right={<><StatusBadge status={c.status} critical={c.critical} type={c.type} />{flagged && <Badge tone="coral" icon={<Flag className="size-3.5" />}>Đã gắn cờ</Badge>}{evid && <Badge tone="sky" icon={<FileSearch className="size-3.5" />}>Đã yêu cầu bằng chứng</Badge>}</>} />

      <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-line bg-paper p-3">
        <ABtn v="ok" icon={<Check />} disabled={c.status === 'resolved'} onClick={() => setStatus('resolved', `Đã duyệt case ${c.id}`)}>Approve</ABtn>
        <ABtn v="danger" icon={<X />} onClick={() => { updateCase(c.id, { status: 'active', assignee: undefined }); toast(`Đã từ chối - case ${c.id} quay lại trạng thái cần hỗ trợ`, 'warn') }}>Reject</ABtn>
        <ABtn icon={<FileSearch />} onClick={() => { toggleIn('evidenceCases', c.id, true); toast('Đã gửi yêu cầu bổ sung bằng chứng') }}>Request evidence</ABtn>
        <ABtn v="dark" icon={<Check />} disabled={c.status === 'resolved'} onClick={() => setStatus('resolved', `Case ${c.id} đã đánh dấu giải quyết`)}>Mark resolved</ABtn>
        <ABtn v={flagged ? 'primary' : 'outline'} icon={<Flag />} onClick={() => { toggleIn('flaggedCases', c.id); toast(flagged ? 'Đã bỏ gắn cờ' : 'Đã gắn cờ case để theo dõi', flagged ? 'ok' : 'warn') }}>{flagged ? 'Bỏ cờ' : 'Flag'}</ABtn>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Panel title="Pet & thông tin case">
            <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
              <div>
                <PetPhoto src={c.photo} species={c.species} alt={c.name} className="aspect-square w-full rounded-xl border border-line" />
                <div className="mt-2 grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <img key={i} src={c.photo} alt="" className="aspect-square rounded-lg border border-line object-cover" style={{ objectPosition: ['center', 'left top', 'right bottom'][i] }} />)}</div>
              </div>
              <dl>
                <Row k="Loài / giống">{c.species} · {c.breed}</Row>
                <Row k="Màu / giới tính">{c.color} · {c.gender}</Row>
                <Row k="Tuổi / cân nặng">{c.age || '—'} · {c.weight || '—'}</Row>
                <Row k="Đặc điểm">{c.traits}</Row>
                <Row k="Mô tả">{c.desc}</Row>
                <Row k="Tình trạng">{c.condition || 'Bình thường'}</Row>
                {c.match && <Row k="AI match">{c.match}%</Row>}
              </dl>
            </div>
          </Panel>

          <Panel title="Vị trí & lịch sử di chuyển">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-bold"><MapPin className="size-4" />{c.street}, {c.district}</p>
            <CityMap className="h-60 rounded-xl border-2 border-line" cases={[c]} revealIds={[c.id]} trail={c.trail} center={{ x: c.x, y: c.y, k: 1.6 }} focusKey={c.id} showLabels={false} />
            <ol className="mt-3 space-y-1.5 border-l-2 border-line pl-4">
              {trail.map((t, i) => <li key={i} className="relative text-sm"><span className="absolute -left-[22px] top-1.5 size-2.5 rounded-full border-2 border-brown bg-butter" /><b>{t.t}</b> · {t.note}</li>)}
            </ol>
          </Panel>

          <Panel title="Timeline case">
            <ol className="space-y-2 border-l-2 border-line pl-4">
              {caseTimeline(c).map((t, i) => <li key={i} className="relative text-sm"><span className="absolute -left-[22px] top-1.5 size-2.5 rounded-full bg-brown" /><span className="mr-2 text-xs font-extrabold text-brown-soft">{t.at}</span>{t.text}</li>)}
            </ol>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Người báo cáo">{reporter ? <UserCell id={reporter.id} sub={`${reporter.area} · ${reporter.phone}`} /> : '—'}</Panel>
          <Panel title="Người cứu hộ">{rescuer ? <div className="space-y-2"><UserCell id={rescuer.id} sub={`${rescuer.rescues} lần cứu hộ`} />{rescuer.verified && <Verified />}</div> : <p className="text-sm text-brown-soft">Chưa có người nhận cứu hộ.</p>}</Panel>
          <Panel title="Mái ấm / phòng khám">
            {shelter ? <div className="text-sm"><img src={shelter.photo} alt={shelter.name} className="mb-2 h-24 w-full rounded-xl object-cover" /><b>{shelter.name}</b><p className="text-brown-soft">{shelter.address}</p><p>{shelter.phone}</p></div>
              : clinic ? <div className="text-sm"><p className="mb-1 text-xs text-brown-soft">Gần nhất:</p><b>{clinic.name}</b><p className="text-brown-soft">{clinic.address}</p><p>{clinic.phone}</p></div>
              : <p className="text-sm text-brown-soft">Chưa gắn mái ấm / phòng khám.</p>}
          </Panel>
          <Panel title="Xác minh">
            <ul className="space-y-1.5 text-sm font-bold">
              <li className="flex items-center gap-2"><StatusBadge status={c.status} critical={c.critical} type={c.type} /></li>
              <li>Mái ấm xác nhận: {pf?.shelterConfirmed ? 'Đã xác nhận' : pf?.mismatch ? 'Báo không khớp' : 'Chưa có'}</li>
              <li>Yêu cầu bổ sung: {pf?.needMore ? 'Đã gửi' : 'Không'}</li>
            </ul>
            {c.status === 'pending' && <ABtn className="mt-2" v="primary" s="sm" onClick={() => go('/admin/verification')}>Mở hàng chờ xác minh</ABtn>}
          </Panel>
          <Panel title={`Report liên quan (${rel.length})`}>
            {rel.length === 0 ? <p className="text-sm text-brown-soft">Không có report.</p> : (
              <ul className="space-y-2">{rel.map((r) => (
                <li key={r.id}><button onClick={() => go('/admin/reports')} className="w-full rounded-xl border border-line p-2 text-left text-sm hover:border-brown"><span className="flex items-center justify-between gap-2"><b>{r.id} · {r.reason}</b><SevChip s={r.severity} /></span><span className="text-xs text-brown-soft">{r.created} · {r.status}</span></button></li>
              ))}</ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
