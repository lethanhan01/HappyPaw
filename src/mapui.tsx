import { useRef, useState } from 'react'
import { Search, X, Clock, History, Sparkles, Lock, MapPin, Eye, HandHeart, Star } from 'lucide-react'
import { CLINICS, SHELTERS, RISKS, timeAgo, type Case } from './data'
import { PIN_META, caseType, kmFrom, type PinType, type Sel } from './map'
import { useApp } from './store'
import { Btn, Input, MatchBadge, PetPhoto, StatusBadge, Verified, WarnBadge, cx } from './ui'

/* ---------- Filters ---------- */
export type StatusKey = 'active' | 'progress' | 'resolved'
export interface Filters { types: PinType[]; species: string; district: string; ward: string; street: string; breed: string; color: string; radius: number; time: number; status: StatusKey[] }
export const F0: Filters = { types: [], species: '', district: '', ward: '', street: '', breed: '', color: '', radius: 10, time: 0, status: [] }
export const TIME_OPTS: [number, string][] = [[0, 'Mọi lúc'], [15, '15 phút'], [60, '1 giờ'], [360, '6 giờ'], [1440, '24 giờ'], [10080, '7 ngày']]

export function countFilters(f: Filters) {
  return f.types.length + f.status.length + (f.time ? 1 : 0) + (f.radius !== F0.radius ? 1 : 0) +
    [f.species, f.district, f.ward, f.street, f.breed, f.color].filter(Boolean).length
}
const stKey = (c: Case): StatusKey => (c.status === 'pending' ? 'progress' : c.status)
export const placeAllowed = (f: Filters, t: PinType) => f.types.length === 0 || f.types.includes(t)

export function matchCase(c: Case, f: Filters, q = '') {
  const st = f.status.length ? f.status : (['active', 'progress'] as StatusKey[])
  if (!st.includes(stKey(c))) return false
  const t = q.trim().toLowerCase()
  if (t && ![c.name, c.district, c.street, c.breed, c.color, c.species, c.desc].join(' ').toLowerCase().includes(t)) return false
  if (kmFrom(c.x, c.y) > f.radius) return false
  if (!placeAllowed(f, caseType(c))) return false
  if (f.species && c.species !== f.species) return false
  if (f.breed && !c.breed.toLowerCase().includes(f.breed.toLowerCase())) return false
  if (f.color && !c.color.toLowerCase().includes(f.color.toLowerCase())) return false
  if (f.district && c.district !== f.district) return false
  if (f.ward && !`${c.street} ${c.desc}`.toLowerCase().includes(f.ward.toLowerCase())) return false
  if (f.street && !c.street.toLowerCase().includes(f.street.toLowerCase())) return false
  if (f.time && c.minutesAgo > f.time) return false
  return true
}

export function approxLoc(c: Case) {
  return c.critical && c.status === 'active' ? `Khu vực ${c.district} (xấp xỉ ~500m)` : `${c.street}, ${c.district}`
}

/* ---------- Search ---------- */
export interface SearchHit { key: string; label: string; sub: string; type: PinType; onPick: () => void }
const SUGGESTED = ['Cần cứu hộ gần tôi', 'Mèo bị thương', 'Chó vàng thất lạc', 'Mái ấm Đống Đa', 'Phòng khám 24h']

export function SearchBar({ value, onChange, hits, recent, onCommit, onClearRecent, className, size = 'md' }: {
  value: string; onChange: (v: string) => void; hits: SearchHit[]; recent: string[]; onCommit: (v: string) => void; onClearRecent: () => void; className?: string; size?: 'md' | 'lg'
}) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const typed = value.trim().length > 0
  const pick = (v: string) => { onChange(v); onCommit(v); setOpen(false) }
  return (
    <div ref={box} className={cx('relative', className)} onBlur={(e) => { if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false) }}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brown/55" />
      <Input value={value} onFocus={() => setOpen(true)} onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onKeyDown={(e) => { if (e.key === 'Enter') { onCommit(value); setOpen(false); (e.target as HTMLInputElement).blur() } if (e.key === 'Escape') setOpen(false) }}
        placeholder="Tìm pet, đường, quận, mái ấm, phòng khám…" aria-label="Tìm kiếm trên bản đồ"
        className={cx('rounded-full pl-10 pr-10 text-sm', size === 'lg' ? 'h-12 border-brown shadow-soft' : 'h-11')} />
      {typed && <button onClick={() => { onChange(''); setOpen(true) }} aria-label="Xóa tìm kiếm" className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full hover:bg-brown/10"><X className="size-4" /></button>}
      {open && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-[55vh] animate-[rise_.18s_both] overflow-y-auto rounded-3xl border-2 border-brown bg-paper p-2 shadow-soft">
          {typed ? (
            hits.length ? (
              <ul>{hits.map((h) => (
                <li key={h.key}><button onClick={() => { h.onPick(); onCommit(value); setOpen(false) }} className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-2.5 py-1.5 text-left hover:bg-butter/60">
                  <span className="size-3.5 shrink-0 rounded-full border-2 border-brown" style={{ background: PIN_META[h.type].color }} />
                  <span className="min-w-0"><span className="block truncate text-sm font-extrabold">{h.label}</span><span className="block truncate text-xs font-semibold text-brown-soft">{h.sub}</span></span>
                </button></li>
              ))}</ul>
            ) : <p className="px-3 py-4 text-center text-sm font-bold text-brown-soft">Không tìm thấy kết quả cho “{value}”. Thử từ khóa khác nhé 🐾</p>
          ) : (
            <>
              {recent.length > 0 && (
                <div className="pb-1">
                  <div className="flex items-center justify-between px-2.5 pb-1 pt-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft"><span>Tìm gần đây</span><button onClick={onClearRecent} className="normal-case underline">Xóa</button></div>
                  {recent.map((r) => <button key={r} onClick={() => pick(r)} className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-2.5 text-left text-sm font-bold hover:bg-butter/60"><History className="size-4 text-brown/50" />{r}</button>)}
                </div>
              )}
              <div className="px-2.5 pb-1 pt-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft">Gợi ý</div>
              {SUGGESTED.map((r) => <button key={r} onClick={() => pick(r)} className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-2.5 text-left text-sm font-bold hover:bg-butter/60"><Sparkles className="size-4 text-brown/50" />{r}</button>)}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ---------- Preview card (click on a pin) ---------- */
const Close = ({ onClose }: { onClose: () => void }) => <button onClick={onClose} aria-label="Đóng" className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-brown/10"><X className="size-4" /></button>

export function MapPreview({ sel, onClose, className }: { sel: Sel; onClose: () => void; className?: string }) {
  const { go, getCase } = useApp()
  const shell = 'animate-[rise_.22s_both] overflow-hidden rounded-3xl border-2 border-brown bg-paper shadow-soft'
  if (sel.kind === 'case') {
    const c = getCase(sel.id)
    if (!c) return null
    const hide = c.critical && c.status === 'active'
    const urgent = c.status === 'active' && c.type === 'rescue'
    return (
      <div className={cx(shell, className)}>
        <div className="flex gap-3 p-3">
          <PetPhoto src={c.photo} species={c.species} alt={`${c.species} ${c.color} tên ${c.name}`} className="size-24 shrink-0 rounded-2xl border-2 border-brown" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1"><h3 className="truncate font-display text-xl font-extrabold leading-tight">{c.name.toUpperCase()}</h3><Close onClose={onClose} /></div>
            <div className="mt-0.5 flex flex-wrap gap-1.5"><StatusBadge status={c.status} critical={c.critical} type={c.type} />{c.match && <MatchBadge v={c.match} />}</div>
            <p className="mt-1.5 flex items-center gap-1 text-[13px] font-bold"><MapPin className="size-3.5 shrink-0" /><span className="truncate">{approxLoc(c)}</span></p>
            <p className="flex items-center gap-1 text-[13px] text-brown-soft"><Clock className="size-3.5" />{timeAgo(c.minutesAgo)} · cách bạn {kmFrom(c.x, c.y)} km</p>
          </div>
        </div>
        {hide && <p className="mx-3 mb-2 flex items-start gap-1.5 rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white"><Lock className="mt-0.5 size-3.5 shrink-0" />Vị trí chính xác được bảo vệ để đảm bảo an toàn cho bé.</p>}
        <div className="flex gap-2 p-3 pt-0">
          <Btn size="sm" variant="secondary" className="flex-1" onClick={() => go(`/case/${c.id}`)} icon={<Eye className="size-4" />}>Xem chi tiết</Btn>
          {c.status === 'active' && <Btn size="sm" variant={urgent ? 'danger' : 'primary'} className="flex-1" onClick={() => go(`/case/${c.id}?help=1`)} icon={<HandHeart className="size-4" />}>{urgent ? 'Cứu bé' : 'Giúp bé'}</Btn>}
          {c.status !== 'active' && c.assignee && <span className="flex flex-1 items-center justify-center rounded-2xl bg-butter/70 px-2 text-center text-xs font-extrabold">Đã có người phụ trách</span>}
        </div>
      </div>
    )
  }
  if (sel.kind === 'risk') {
    const r = RISKS.find((x) => x.id === sel.id)
    if (!r) return null
    return (
      <div className={cx(shell, 'border-plum bg-plum-soft p-4', className)}>
        <div className="flex items-start justify-between"><WarnBadge>Khu vực cảnh báo · {r.severity}</WarnBadge><Close onClose={onClose} /></div>
        <h3 className="mt-2 font-display text-xl font-extrabold">{r.title}</h3>
        <p className="text-sm font-semibold">Hãy cẩn thận — cộng đồng đã đánh dấu khu vực này có rủi ro.</p>
        <p className="mt-1 text-sm text-brown-soft">{r.note}</p>
        <Btn size="sm" variant="secondary" className="mt-3" onClick={() => go('/safety')}>Xem cảnh báo an toàn</Btn>
      </div>
    )
  }
  const p = sel.kind === 'shelter' ? SHELTERS.find((x) => x.id === sel.id) : CLINICS.find((x) => x.id === sel.id)
  if (!p) return null
  return (
    <div className={cx(shell, className)}>
      <div className="flex gap-3 p-3">
        <PetPhoto src={p.photo} species="Chó" alt={p.name} className="size-20 shrink-0 rounded-2xl border-2 border-brown" />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-1"><h3 className="font-display text-lg font-extrabold leading-tight">{p.name}</h3><Close onClose={onClose} /></div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">{p.verified && <Verified />}<span className="inline-flex items-center gap-0.5 text-sm font-extrabold"><Star className="size-3.5 fill-butter-2" />{p.rating}</span></div>
          <p className="text-sm text-brown-soft">{p.district} · {kmFrom(p.x, p.y)} km</p>
        </div>
      </div>
      <div className="p-3 pt-0"><Btn size="sm" full onClick={() => go(`/${sel.kind === 'shelter' ? 'shelters' : 'clinics'}/${p.id}`)}>Xem {sel.kind === 'shelter' ? 'mái ấm' : 'phòng khám'}</Btn></div>
    </div>
  )
}

