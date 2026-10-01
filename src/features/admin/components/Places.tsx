import { useMemo, useState } from 'react'
import { BadgeCheck, Clock, Home, EyeOff, Eye, Pencil, Plus, ShieldX, Trash2, Check, Star as StarI } from 'lucide-react'
import { useApp } from '@/store'
import { DISTRICTS, userById } from '@/constants'
import { Badge, Modal, Stars, UploadBox, Toggle } from '@ui'
import {
  jitterXY,
  patchRating,
  removeClinic,
  removeShelter,
  setVerify,
  upsertClinic,
  upsertShelter,
  useAdmin,
  type AClinic,
  type AShelter,
  type Verify,
} from '../store/adminStore'
import { ABtn, AInput, ASelect, ATextarea, Col, Confirm, DataTable, FormRow, KpiCard, KpiRow, Panel, SearchBox, Title, UserCell } from './AdminCommon'

export const VerifyBadge = ({ v }: { v: Verify }) =>
  v === 'verified' ? <Badge tone="sky" icon={<BadgeCheck className="size-3.5" />}>Đã xác minh</Badge>
    : v === 'pending' ? <Badge tone="butter" icon={<Clock className="size-3.5" />}>Chờ xác minh</Badge>
    : <Badge tone="coral" icon={<ShieldX className="size-3.5" />}>Từ chối</Badge>
export const PlaceStatusBadge = ({ s }: { s: 'Hoạt động' | 'Ẩn' }) =>
  s === 'Hoạt động' ? <Badge tone="sage" icon={<Check className="size-3.5" />}>Hoạt động</Badge> : <Badge tone="brown" icon={<EyeOff className="size-3.5" />}>Ẩn</Badge>

/* ---------- form ---------- */
export function PlaceForm({ kind, initial, onClose }: { kind: 'shelter' | 'clinic'; initial: AShelter | AClinic | null; onClose: () => void }) {
  const { toast } = useApp()
  const isS = kind === 'shelter'
  const [f, setF] = useState(() => ({
    name: initial?.name || '', logo: initial?.logo ? [initial.logo] : ([] as string[]), cover: initial?.cover ? [initial.cover] : ([] as string[]), qr: (initial as AShelter | null)?.qr ? [(initial as AShelter).qr!] : ([] as string[]),
    district: initial?.district || DISTRICTS[0] as string, address: initial?.address || '', phone: initial?.phone || '', website: initial?.website || '',
    about: (initial as AShelter | null)?.about || '', needs: ((initial as AShelter | null)?.needs || []).join('\n'), verify: (initial?.verify || 'pending') as Verify, status: initial?.status || 'Hoạt động',
    services: ((initial as AClinic | null)?.services || []).join(', '), hours: (initial as AClinic | null)?.hours || '08:00 – 20:00', rating: String(initial?.rating ?? 0), emergency: (initial as AClinic | null)?.emergency || false,
  }))
  const [err, setErr] = useState('')
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((o) => ({ ...o, [k]: v }))
  const save = () => {
    if (!f.name.trim() || !f.address.trim()) { setErr('Vui lòng nhập tên và địa chỉ.'); return }
    const [x, y] = initial ? [initial.x, initial.y] : jitterXY(f.district)
    const base = {
      id: initial?.id || (isS ? 's' : 'c') + Date.now(), name: f.name.trim(), district: f.district, address: f.address, x, y, rating: Math.min(5, Math.max(0, Number(f.rating) || 0)), reviews: initial?.reviews ?? 0,
      verified: f.verify === 'verified', photo: f.cover[0] || initial?.photo || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=900&h=500&fit=crop&auto=format&q=75', distance: initial?.distance ?? 5,
      phone: f.phone, website: f.website, verify: f.verify, status: f.status, logo: f.logo[0], cover: f.cover[0],
    }
    if (isS) upsertShelter({ ...base, about: f.about, pets: (initial as AShelter | null)?.pets ?? 0, needs: f.needs.split('\n').map((s) => s.trim()).filter(Boolean), urgent: (initial as AShelter | null)?.urgent ?? false, bank: (initial as AShelter | null)?.bank ?? '', since: (initial as AShelter | null)?.since ?? 2026, qr: f.qr[0] })
    else upsertClinic({ ...base, services: f.services.split(',').map((s) => s.trim()).filter(Boolean), hours: f.hours, open: (initial as AClinic | null)?.open ?? true, emergency: f.emergency })
    toast(initial ? 'Đã lưu thay đổi' : isS ? 'Đã tạo mái ấm mới' : 'Đã tạo phòng khám mới')
    onClose()
  }
  return (
    <div className="space-y-3">
      <FormRow label={isS ? 'Tên mái ấm' : 'Tên phòng khám'}><AInput value={f.name} onChange={(e) => set('name', e.target.value)} /></FormRow>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormRow label="Logo"><UploadBox label="Tải logo" hint="Ảnh vuông" max={1} files={f.logo} onChange={(v) => set('logo', v)} /></FormRow>
        <FormRow label="Ảnh bìa"><UploadBox label="Tải ảnh bìa" max={1} files={f.cover} onChange={(v) => set('cover', v)} /></FormRow>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormRow label="Quận"><ASelect value={f.district} onChange={(e) => set('district', e.target.value)}>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</ASelect></FormRow>
        <FormRow label="Địa chỉ"><AInput value={f.address} onChange={(e) => set('address', e.target.value)} /></FormRow>
        <FormRow label="Liên hệ (SĐT)"><AInput value={f.phone} onChange={(e) => set('phone', e.target.value)} /></FormRow>
        <FormRow label="Website"><AInput value={f.website} onChange={(e) => set('website', e.target.value)} /></FormRow>
      </div>
      {isS ? (
        <>
          <FormRow label="QR quyên góp"><UploadBox label="Tải mã QR" max={1} files={f.qr} onChange={(v) => set('qr', v)} /></FormRow>
          <FormRow label="Giới thiệu"><ATextarea value={f.about} onChange={(e) => set('about', e.target.value)} /></FormRow>
          <FormRow label="Nhu cầu hiện tại" hint="Mỗi dòng một nhu cầu"><ATextarea value={f.needs} onChange={(e) => set('needs', e.target.value)} /></FormRow>
        </>
      ) : (
        <>
          <FormRow label="Dịch vụ" hint="Cách nhau bằng dấu phẩy"><AInput value={f.services} onChange={(e) => set('services', e.target.value)} /></FormRow>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormRow label="Giờ mở cửa"><AInput value={f.hours} onChange={(e) => set('hours', e.target.value)} /></FormRow>
            <FormRow label="Đánh giá (0-5)"><AInput type="number" min={0} max={5} step={0.1} value={f.rating} onChange={(e) => set('rating', e.target.value)} /></FormRow>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold"><Toggle on={f.emergency} onChange={(v) => set('emergency', v)} label="Cấp cứu 24/7" />Cấp cứu 24/7</div>
        </>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <FormRow label="Trạng thái xác minh"><ASelect value={f.verify} onChange={(e) => set('verify', e.target.value as Verify)}><option value="verified">Đã xác minh</option><option value="pending">Chờ xác minh</option><option value="rejected">Từ chối</option></ASelect></FormRow>
        <FormRow label="Trạng thái hiển thị"><ASelect value={f.status} onChange={(e) => set('status', e.target.value as 'Hoạt động' | 'Ẩn')}><option>Hoạt động</option><option>Ẩn</option></ASelect></FormRow>
      </div>
      {err && <p className="text-sm font-bold text-coral">{err}</p>}
      <div className="flex justify-end gap-2"><ABtn onClick={onClose}>Hủy</ABtn><ABtn v="dark" onClick={save}>Lưu</ABtn></div>
    </div>
  )
}

function PlaceCRUD({ kind }: { kind: 'shelter' | 'clinic' }) {
  const { toast } = useApp()
  const { shelters, clinics } = useAdmin()
  const isS = kind === 'shelter'
  const list = (isS ? shelters : clinics) as (AShelter | AClinic)[]
  const [q, setQ] = useState('')
  const [vf, setVf] = useState('')
  const [edit, setEdit] = useState<{ p: AShelter | AClinic | null } | null>(null)
  const [del, setDel] = useState<AShelter | AClinic | null>(null)
  const rows = useMemo(() => list.filter((p) => (!vf || p.verify === vf) && (!q.trim() || (p.name + p.district).toLowerCase().includes(q.trim().toLowerCase()))), [list, q, vf])
  const cols: Col<AShelter | AClinic>[] = [
    { key: 'n', label: isS ? 'Shelter' : 'Clinic', sort: (p) => p.name, render: (p) => <span className="flex items-center gap-2"><img src={p.logo || p.photo} alt="" className="size-9 rounded-lg object-cover" /><span className="min-w-0"><b className="block truncate leading-tight">{p.name}</b><span className="text-xs text-brown-soft">{p.phone}</span></span></span> },
    { key: 'd', label: 'District', sort: (p) => p.district, render: (p) => p.district },
    { key: 'v', label: 'Verified', sort: (p) => p.verify, render: (p) => <VerifyBadge v={p.verify} /> },
    { key: 'r', label: 'Rating', sort: (p) => p.rating, render: (p) => <span className="flex items-center gap-1 font-bold"><StarI className="size-3.5 fill-butter-2 text-brown" />{p.rating ? p.rating.toFixed(1) : '—'}</span> },
    isS ? { key: 'needs', label: 'Active needs', sort: (p) => (p as AShelter).needs.length, render: (p) => (p as AShelter).needs.length }
      : { key: 'svc', label: 'Dịch vụ / giờ', render: (p) => <span className="block max-w-[220px] truncate" title={(p as AClinic).services.join(', ')}>{(p as AClinic).hours} · {(p as AClinic).services.length} dịch vụ</span> },
    { key: 's', label: 'Status', sort: (p) => p.status, render: (p) => <PlaceStatusBadge s={p.status} /> },
    { key: 'a', label: 'Action', render: (p) => <div className="flex gap-1"><ABtn s="xs" icon={<Pencil />} onClick={() => setEdit({ p })}>Sửa</ABtn><ABtn s="xs" v="danger" icon={<Trash2 />} onClick={() => setDel(p)}>Xóa</ABtn></div> },
  ]
  const label = isS ? 'mái ấm' : 'phòng khám'
  return (
    <div>
      <Title title={isS ? 'Quản lý Shelters' : 'Quản lý Clinics'} sub={`${rows.length}/${list.length} ${label}`} right={<ABtn v="dark" icon={<Plus />} onClick={() => setEdit({ p: null })}>Tạo {label}</ABtn>} />
      <KpiRow>
        <KpiCard icon={<Home />} label={`Tổng ${label}`} value={list.length} />
        <KpiCard icon={<BadgeCheck />} label="Đã xác minh" value={list.filter((p) => p.verify === 'verified').length} tone="bg-sky-soft text-sky-2" />
        <KpiCard icon={<Clock />} label="Chờ xác minh" value={list.filter((p) => p.verify === 'pending').length} tone="bg-orange-soft text-orange" />
        <KpiCard icon={<StarI />} label="Đang hoạt động" value={list.filter((p) => p.status === 'Hoạt động').length} tone="bg-sage-soft text-sage-2" />
      </KpiRow>
      <div className="mb-3 flex flex-wrap gap-2">
        <SearchBox value={q} onChange={setQ} placeholder={`Tìm ${label}…`} />
        <ASelect aria-label="Xác minh" value={vf} onChange={(e) => setVf(e.target.value)} className="!w-auto"><option value="">Mọi trạng thái xác minh</option><option value="verified">Đã xác minh</option><option value="pending">Chờ xác minh</option><option value="rejected">Từ chối</option></ASelect>
      </div>
      <DataTable cols={cols} rows={rows} rowKey={(p) => p.id} />
      <Modal open={!!edit} onClose={() => setEdit(null)} wide title={edit?.p ? `Sửa ${label}` : `Tạo ${label} mới`}>
        {edit && <PlaceForm key={edit.p?.id || 'new'} kind={kind} initial={edit.p} onClose={() => setEdit(null)} />}
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} title={`Xóa ${label}?`} body={<>Bạn chắc chắn muốn xóa <b>{del?.name}</b>? Thao tác này không thể hoàn tác.</>}
        onOk={() => { if (del) { (isS ? removeShelter : removeClinic)(del.id); toast(`Đã xóa ${del.name}`) } }} />
    </div>
  )
}
export const ShelterPage = () => <PlaceCRUD kind="shelter" />
export const ClinicPage = () => <PlaceCRUD kind="clinic" />

/* ---------- verification ---------- */
export function PlaceVerification() {
  const { toast } = useApp()
  const { shelters, clinics } = useAdmin()
  const queue = [
    ...shelters.filter((s) => s.verify === 'pending').map((p) => ({ kind: 'shelter' as const, p })),
    ...clinics.filter((c) => c.verify === 'pending').map((p) => ({ kind: 'clinic' as const, p })),
  ]
  return (
    <div>
      <Title title="Xác minh Shelter & Clinic" sub={`${queue.length} địa điểm chờ xác minh`} />
      {queue.length === 0 ? <Panel><p className="py-8 text-center font-bold">Tất cả địa điểm đã được xử lý.</p></Panel> : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {queue.map(({ kind, p }) => (
            <Panel key={p.id} pad={false}>
              <img src={p.photo} alt={p.name} className="h-28 w-full rounded-t-2xl object-cover" />
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between gap-2"><Badge tone={kind === 'shelter' ? 'sage' : 'sky'}>{kind === 'shelter' ? 'Mái ấm' : 'Phòng khám'}</Badge><VerifyBadge v={p.verify} /></div>
                <h3 className="font-display text-base font-extrabold leading-tight">{p.name}</h3>
                <p className="text-sm text-brown-soft">{p.address}</p>
                <p className="text-sm">{p.phone} · {p.website}</p>
                <div className="mt-3 flex gap-2">
                  <ABtn v="ok" icon={<BadgeCheck />} onClick={() => { setVerify(kind, p.id, 'verified'); toast(`Đã xác minh ${p.name}`) }}>Xác minh</ABtn>
                  <ABtn v="danger" icon={<ShieldX />} onClick={() => { setVerify(kind, p.id, 'rejected'); toast(`Đã từ chối ${p.name}`, 'warn') }}>Từ chối</ABtn>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- ratings ---------- */
export function RatingsPage() {
  const { toast } = useApp()
  const { ratings } = useAdmin()
  const [f, setF] = useState('')
  const rows = ratings.filter((r) => !f || r.status === f)
  return (
    <div>
      <Title title="Ratings moderation" sub={`${ratings.filter((r) => r.status === 'Chờ duyệt').length} đánh giá chờ duyệt`} />
      <div className="mb-3"><ASelect aria-label="Trạng thái" value={f} onChange={(e) => setF(e.target.value)} className="!w-auto"><option value="">Mọi trạng thái</option><option>Chờ duyệt</option><option>Đã giữ</option><option>Đã ẩn</option></ASelect></div>
      <div className="space-y-2">
        {rows.map((r) => (
          <Panel key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><b>{r.place}</b><Badge tone={r.kind === 'shelter' ? 'sage' : 'sky'}>{r.kind === 'shelter' ? 'Mái ấm' : 'Phòng khám'}</Badge><Stars value={r.stars} size={14} /><span className="text-xs text-brown-soft">{r.created}</span></div>
                <p className={`mt-1 text-sm ${r.status === 'Đã ẩn' ? 'text-brown-soft line-through' : ''}`}>{r.comment}</p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-brown-soft">bởi <UserCell id={r.user} />{!userById(r.user) && 'Ẩn danh'}</div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge tone={r.status === 'Đã ẩn' ? 'ink' : r.status === 'Đã giữ' ? 'sage' : 'butter'} icon={r.status === 'Đã ẩn' ? <EyeOff className="size-3.5" /> : r.status === 'Đã giữ' ? <Eye className="size-3.5" /> : <Clock className="size-3.5" />}>{r.status}</Badge>
                <div className="flex gap-1.5">
                  <ABtn s="xs" icon={<Eye />} disabled={r.status === 'Đã giữ'} onClick={() => { patchRating(r.id, 'Đã giữ'); toast('Đã giữ đánh giá') }}>Giữ</ABtn>
                  <ABtn s="xs" v="danger" icon={<EyeOff />} disabled={r.status === 'Đã ẩn'} onClick={() => { patchRating(r.id, 'Đã ẩn'); toast('Đã ẩn đánh giá', 'warn') }}>Ẩn</ABtn>
                </div>
              </div>
            </div>
          </Panel>
        ))}
        {rows.length === 0 && <Panel><p className="py-6 text-center text-sm font-bold text-brown-soft">Không có đánh giá.</p></Panel>}
      </div>
    </div>
  )
}
