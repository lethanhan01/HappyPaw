import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Clock,
  Flag,
  FileImage,
  HandHeart,
  Lock,
  MapPin,
  Navigation,
  Phone,
  Eye,
  TriangleAlert,
  Check,
  Copy,
  Download,
  Share2 as Facebook,
  MessageCircle,
  Link2,
  Sparkles,
  Siren,
  PawPrint,
} from 'lucide-react'
import UserShell from '@/layouts/UserShell'
import { useApp } from '@/store'
import { parsePath, cx } from '@/lib'
import CityMap, { ME_POS, kmFrom } from '@/features/map'
import { SHELTERS, timeAgo, userById } from '@/constants'
import type { Case } from '@/types'
import {
  Badge,
  Btn,
  Card,
  Check2,
  Confetti,
  Empty,
  Field,
  Input,
  Modal,
  Note,
  PetPhoto,
  StatusBadge,
  Textarea,
  UploadBox,
  UserAvatar,
  SuccessScreen,
  MatchBadge,
  Segmented,
  Paw,
} from '@ui'
import {
  MismatchCard,
  PlaceRow,
  ProgressStepper,
  VerifyStepper,
  findPlace,
  flowOf,
  flowPatch,
  kindLabel,
  placesOf,
  stepFromProgress,
  type PlaceKind,
} from './FlowUI'
import { SaveBtn } from '@/components/common'

const typeLabel = (c: Case) => (c.type === 'rescue' ? 'Cần cứu hộ' : c.type === 'found' ? 'Được báo thấy' : 'Thú cưng bị lạc')

function NotFound() {
  const { go } = useApp()
  return <UserShell><Empty title="Không tìm thấy case này" body="Case có thể đã bị xoá hoặc đường dẫn chưa đúng." cta="Về bản đồ" onCta={() => go('/map')} /></UserShell>
}

function timeline(c: Case) {
  const base = (c.trail || []).map((t) => ({ t: t.t, text: t.note }))
  if (!base.length) base.push({ t: timeAgo(c.minutesAgo), text: 'Đã đăng case' })
  const ev = [...base]
  if (c.assignee) ev.push({ t: 'Vừa xong', text: `${userById(c.assignee)?.name ?? 'Một thành viên'} đã nhận ca cứu hộ` })
  if (c.status === 'pending') ev.push({ t: 'Vừa xong', text: 'Đã gửi xác nhận cứu hộ, chờ xác minh' })
  if (c.status === 'resolved') ev.push({ t: 'Vừa xong', text: 'Case đã được giải quyết thành công' })
  return ev
}

/* ---------------- CASE DETAIL ---------------- */
export function CaseDetail({ id, query }: { id: string; query: Record<string, string> }) {
  const { getCase, go, back, myRescue, setMyRescue, updateCase, me, following, toggleFollow, toast, proof } = useApp()
  const c = getCase(id)
  const [accept, setAccept] = useState(false)
  const [seen, setSeen] = useState(false)
  const [ok, setOk] = useState(false)
  useEffect(() => { if (query.help === '1') setAccept(true) }, [query.help])
  if (!c) return <NotFound />
  const mine = c.assignee === me
  const isOwner = c.reporter === me
  const hidden = c.critical && c.status === 'active' && !mine
  const hasRescue = !!myRescue && myRescue !== c.id
  const assignee = userById(c.assignee)
  const tl = timeline(c)
  const fl = flowOf(proof, c.id)
  const hp = findPlace(c.shelterId)
  const last = c.trail?.[c.trail.length - 1]
  const confirm = () => {
    updateCase(c.id, { status: 'progress', assignee: me })
    setMyRescue(c.id); setAccept(false); toast('Bạn đang phụ trách ca này.'); go(`/case/${c.id}/rescue`)
  }

  const primary = c.status === 'active' && !hasRescue
    ? <Btn size="lg" full variant={c.critical || c.type === 'rescue' ? 'danger' : 'primary'} pill icon={<HandHeart className="size-5" />} onClick={() => setAccept(true)}>{c.type === 'rescue' ? 'Tôi muốn cứu bé' : 'Tôi muốn giúp tìm bé'}</Btn>
    : c.status === 'progress' && !mine ? <Btn full size="lg" disabled variant="secondary">Đã có người nhận ca này</Btn>
    : mine && c.status === 'progress' ? <Btn size="lg" full pill onClick={() => go(`/case/${c.id}/rescue`)} icon={<Navigation className="size-5" />}>Tiếp tục ca cứu hộ</Btn>
    : null

  return (
    <UserShell hideFab>
      <div className="mx-auto max-w-6xl">
        <Btn variant="ghost" size="sm" onClick={back} icon={<ArrowLeft className="size-4" />} className="mb-3">Quay lại</Btn>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={c.status} critical={c.critical} type={c.type} />
          <Badge tone="cream">{c.id}</Badge>
          <span className="flex items-center gap-1 text-sm font-bold text-brown-soft"><Clock className="size-4" />Cập nhật {timeAgo(c.updatedAgo)}</span>
        </div>

        {c.status === 'progress' && (
          <div className="mb-5 flex items-center gap-3 rounded-3xl border-2 border-brown bg-butter p-4" role="status">
            <UserAvatar id={c.assignee} size={44} />
            <p className="font-display text-lg font-extrabold leading-tight">{mine ? 'Bạn đang phụ trách ca này.' : `${assignee?.name ?? 'Nguyễn Minh'} đang trên đường đến cứu bé.`}</p>
          </div>
        )}
        {c.status === 'pending' && (
          <div className="mb-5 space-y-3">
            <Note tone="butter" icon={<Clock className="size-5 shrink-0" />}>Ca cứu hộ đang <b>chờ xác minh</b>. Admin sẽ kiểm tra bằng chứng và xác nhận từ nơi tiếp nhận.</Note>
            {mine && <Card className="p-4"><VerifyStepper kind={hp?.kind ?? 'shelter'} shelter={fl.mismatch ? 'warn' : fl.shelterConfirmed ? 'done' : 'wait'} admin="wait" /></Card>}
          </div>
        )}
        {c.status === 'resolved' && <div className="mb-5"><Note tone="sage" icon={<Check className="size-5 shrink-0" />}><span>Case đã được giải quyết thành công và không còn hiển thị trên bản đồ realtime.{mine && <> <Btn variant="ghost" size="sm" className="inline h-auto p-0 font-extrabold underline" onClick={() => go(`/case/${c.id}/resolved`)}>Xem kết quả</Btn></>}</span></Note></div>}
        {fl.mismatch && c.status !== 'resolved' && <div className="mb-5"><MismatchCard onView={() => go(`/case/${c.id}/shelter-confirm`)} /></div>}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5">
            <div className="relative overflow-hidden rounded-[32px] border-2 border-brown bg-cream-2 shadow-soft">
              <PetPhoto src={c.photo} species={c.species} alt={`${c.species} ${c.color} tên ${c.name}`} className="aspect-[4/3] w-full" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brown/80 to-transparent p-5 text-white">
                <p className="text-sm font-bold opacity-90">{typeLabel(c)}</p>
                <h1 className="font-display text-4xl font-extrabold leading-none">{c.name.toUpperCase()}</h1>
              </div>
              <div className="absolute right-4 top-4 flex gap-2"><SaveBtn id={c.id} /></div>
              {c.match && <div className="absolute left-4 top-4"><MatchBadge v={c.match} /></div>}
            </div>

            <Card className="p-5">
              <h2 className="mb-3 font-display text-xl font-extrabold">Thông tin</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                {[['Loài', c.species], ['Giống', c.breed], ['Giới tính', c.gender], ['Màu lông', c.color], ['Cân nặng', c.weight || '—'], ['Tuổi', c.age || '—']].map(([k, v]) => (<div key={k}><dt className="text-xs font-bold text-brown-soft">{k}</dt><dd className="font-extrabold">{v}</dd></div>))}
              </dl>
              <p className="mt-4 rounded-2xl bg-cream-2 p-3 text-sm font-semibold"><b>Đặc điểm:</b> {c.traits}</p>
              <p className="mt-3 text-sm font-semibold text-brown-soft">“{c.desc}”</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-bold">
                <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{hidden ? `Khu vực ${c.district}` : `${c.street}, ${c.district}`}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="size-4" />{timeAgo(c.minutesAgo)}</span>
                <span className="inline-flex items-center gap-1.5"><Navigation className="size-4" />{kmFrom(c.x, c.y)} km</span>
              </div>
              {c.reward && <div className="mt-3"><Badge tone="pink">Chủ nuôi có hậu tạ</Badge></div>}
              <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-sm"><UserAvatar id={c.reporter} size={30} /><span>Đăng bởi <b>{userById(c.reporter)?.name}</b></span></div>
            </Card>
          </div>

          <div className="space-y-5">
            <div className="-mx-4 overflow-hidden border-y-2 border-brown bg-paper shadow-soft md:mx-0 md:rounded-[32px] md:border-2">
              <div className="h-72 md:h-80">
                <CityMap className="size-full" cases={[c]} selected={null} me={ME_POS} revealIds={mine || !hidden ? [c.id] : []}
                  trail={c.trail?.map((t) => ({ x: t.x, y: t.y, t: t.t }))} predicted={c.type === 'lost' && c.status !== 'resolved' ? { x: last?.x ?? c.x, y: last?.y ?? c.y, r: 46 } : null}
                  center={{ x: c.x, y: c.y, k: 1.6 }} />
              </div>
              <div className="space-y-1.5 p-4 text-sm font-bold">
                {c.trail && <p className="flex items-center gap-2"><Eye className="size-4" />Nhìn thấy cách đây {c.minutesAgo} phút · Cập nhật {c.updatedAgo} phút trước</p>}
                {c.type === 'lost' && <p className="flex items-center gap-2 text-plum"><Sparkles className="size-4" />Vùng có thể di chuyển · 500m</p>}
                <p className={cx('flex items-center gap-2 rounded-xl px-3 py-2', hidden ? 'bg-ink text-white' : 'bg-cream-2 text-brown-soft')}><Lock className="size-4 shrink-0" />Vị trí chính xác được bảo vệ để đảm bảo an toàn cho bé.</p>
              </div>
            </div>

            <Card className="p-5">
              <h2 className="mb-4 font-display text-xl font-extrabold">Hành trình</h2>
              <ol className="relative space-y-4 border-l-2 border-dashed border-brown/30 pl-6">
                {tl.map((e, i) => (
                  <li key={i} className="relative">
                    <span className={cx('absolute -left-[33px] top-0.5 grid size-5 place-items-center rounded-full border-2 border-brown', i === tl.length - 1 ? 'bg-butter' : 'bg-paper')}>{i === tl.length - 1 && <span className="size-2 rounded-full bg-brown" />}</span>
                    <p className="font-display text-lg font-extrabold leading-none">{e.t}</p>
                    <p className="text-sm font-semibold text-brown-soft">{e.text}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="space-y-2.5 p-5">
              {hasRescue && c.status === 'active' && <Note tone="butter" icon={<TriangleAlert className="size-5 shrink-0" />}>Bạn đang phụ trách một ca khác (<Btn variant="ghost" size="sm" className="inline h-auto p-0 font-extrabold underline" onClick={() => go(`/case/${myRescue}`)}>{myRescue}</Btn>). Mỗi người chỉ nhận một ca tại một thời điểm.</Note>}
              {primary && <div className="hidden lg:block">{primary}</div>}
              {mine && c.status === 'pending' && c.shelterId && <Btn size="lg" full variant="secondary" onClick={() => go(`/case/${c.id}/shelter-confirm`)}>Xem xác nhận từ nơi tiếp nhận</Btn>}
              {c.status !== 'resolved' && (
                <div className="grid grid-cols-2 gap-2.5">
                  <Btn className="h-12" variant="secondary" onClick={() => setSeen(true)} icon={<Eye className="size-4" />}>Tôi đã thấy bé</Btn>
                  <Btn className="h-12" variant="secondary" onClick={() => go(`/case/${c.id}/update`)} icon={<MapPin className="size-4" />}>Cập nhật vị trí</Btn>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2.5">
                <Btn className="h-12" variant={following.includes(c.id) ? 'soft' : 'secondary'} onClick={() => { toggleFollow(c.id); toast(following.includes(c.id) ? 'Đã bỏ theo dõi' : 'Đang theo dõi case này') }} icon={<Bell className="size-4" />}>{following.includes(c.id) ? 'Đang theo dõi' : 'Theo dõi case'}</Btn>
                {isOwner || c.type === 'lost' ? <Btn className="h-12" variant="secondary" onClick={() => go(`/case/${c.id}/flyer`)} icon={<FileImage className="size-4" />}>Tạo tờ rơi</Btn> : <Btn className="h-12" variant="secondary" onClick={() => go('/ai-match')} icon={<Sparkles className="size-4" />}>So khớp AI</Btn>}
              </div>
              <Btn variant="ghost" full size="sm" onClick={() => go(`/safety/report?case=${c.id}&user=${c.reporter}`)} icon={<Flag className="size-4" />}>Báo cáo case này</Btn>
            </Card>
          </div>
        </div>
      </div>

      {primary && (
        <>
          <div className="h-20 lg:hidden" aria-hidden />
          <div className="fixed inset-x-0 bottom-[calc(68px+env(safe-area-inset-bottom))] z-40 border-t-2 border-brown/15 bg-paper/95 p-3 backdrop-blur-sm lg:hidden">{primary}</div>
        </>
      )}
      <Modal open={accept} onClose={() => setAccept(false)} title="Bạn muốn nhận ca cứu hộ này?">
        <div className="space-y-4">
          <dl className="divide-y divide-line rounded-2xl bg-cream-2 px-3 text-sm">
            <div className="flex items-center gap-3 py-2.5"><dt className="w-20 shrink-0 font-bold text-brown-soft">Pet</dt><dd className="flex min-w-0 flex-1 items-center gap-2 font-extrabold"><PetPhoto src={c.photo} species={c.species} alt="" className="size-10 shrink-0 rounded-xl border-2 border-brown" /><span className="min-w-0">{c.name} · {c.species}{c.condition ? ` · ${c.condition}` : ''}</span></dd></div>
            <div className="flex gap-3 py-2.5"><dt className="w-20 shrink-0 font-bold text-brown-soft">Location</dt><dd className="font-extrabold">{hidden ? `Khu vực ${c.district}` : `${c.street}, ${c.district}`}</dd></div>
            <div className="flex gap-3 py-2.5"><dt className="w-20 shrink-0 font-bold text-brown-soft">Distance</dt><dd className="font-extrabold">{kmFrom(c.x, c.y)} km</dd></div>
            <div className="flex items-center gap-3 py-2.5"><dt className="w-20 shrink-0 font-bold text-brown-soft">Status</dt><dd><StatusBadge status="active" critical={c.critical} type={c.type} /></dd></div>
          </dl>
          <Note tone="coral" icon={<TriangleAlert className="size-5 shrink-0" />}>Hãy đảm bảo an toàn cho bản thân. Không tiếp cận nếu bé hung dữ; gọi hỗ trợ khi cần. Chỉ nhận ca khi bạn thực sự có thể đến.</Note>
          <Check2 on={ok} onChange={setOk}>Tôi hiểu và sẽ chịu trách nhiệm với ca này.</Check2>
          <div className="flex gap-2"><Btn size="lg" variant="secondary" className="w-24 shrink-0 px-3" onClick={() => setAccept(false)}>Hủy</Btn><Btn size="lg" className="flex-1 px-3 text-base" disabled={!ok} onClick={confirm}>Xác nhận nhận case</Btn></div>
        </div>
      </Modal>
      <Modal open={seen} onClose={() => setSeen(false)} title="Bạn đã thấy bé?">
        <p className="mb-4 font-semibold text-brown-soft">Cập nhật vị trí và thời điểm bạn nhìn thấy để chủ nhân theo dõi hành trình của bé.</p>
        <Btn full onClick={() => { setSeen(false); go(`/case/${c.id}/update`) }}>Cập nhật vị trí mới</Btn>
      </Modal>
    </UserShell>
  )
}

/* ---------------- UPDATE LOCATION ---------------- */
export function UpdateLocation({ id }: { id: string }) {
  const { getCase, updateCase, back, go, toast } = useApp()
  const c = getCase(id)
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null)
  const [time, setTime] = useState('20:40')
  const [desc, setDesc] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [done, setDone] = useState(false)
  if (!c) return <NotFound />
  if (done) return (
    <UserShell>
      <SuccessScreen title="Đã cập nhật hành trình của bé." species={c.species}>
        <p className="font-semibold text-brown-soft">Những người theo dõi case đã được thông báo.</p>
        <Btn size="lg" onClick={() => go(`/case/${c.id}`)}>Xem hành trình</Btn>
      </SuccessScreen>
    </UserShell>
  )
  const submit = () => {
    if (!pin) { toast('Hãy ghim vị trí mới trên bản đồ', 'warn'); return }
    const trail = [...(c.trail ?? [{ x: c.x, y: c.y, t: '—', note: `Vị trí ban đầu tại ${c.district}` }]), { x: pin.x, y: pin.y, t: time, note: desc || 'Người dùng cập nhật vị trí' }]
    updateCase(c.id, { trail, x: pin.x, y: pin.y, minutesAgo: 0 }); setDone(true)
  }
  return (
    <UserShell>
      <div className="mx-auto max-w-4xl">
        <Btn variant="ghost" size="sm" onClick={back} icon={<ArrowLeft className="size-4" />} className="mb-2">Quay lại</Btn>
        <h1 className="bubble mb-5 font-display text-4xl font-extrabold">Cập nhật vị trí mới</h1>
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <div className="h-80 overflow-hidden rounded-3xl border-2 border-brown lg:h-[440px]">
              <CityMap className="size-full" cases={[c]} revealIds={[c.id]} me={ME_POS} trail={c.trail?.map((t) => ({ x: t.x, y: t.y, t: t.t }))} dropPin={pin} onMapClick={(x, y) => setPin({ x: Math.round(x), y: Math.round(y) })} center={{ x: c.x, y: c.y, k: 1.5 }} />
            </div>
            <Btn variant="soft" size="sm" className="mt-2" onClick={() => setPin({ ...ME_POS })} icon={<Navigation className="size-4" />}>Dùng vị trí hiện tại</Btn>
          </div>
          <Card className="space-y-4 p-5">
            <Field label="Thời điểm nhìn thấy"><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
            <Field label="Mô tả"><Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="VD: Bé đang đi về phía chợ, có vẻ khoẻ." /></Field>
            <Field label="Ảnh / video"><UploadBox label="Thêm ảnh hoặc video" max={3} files={files} onChange={setFiles} /></Field>
            <Btn full size="lg" pill onClick={submit}>Cập nhật vị trí</Btn>
          </Card>
        </div>
      </div>
    </UserShell>
  )
}

/* ---------------- RESCUE IN PROGRESS ---------------- */
const CHECKLIST = ['Đã tới vị trí', 'Đã tiếp cận bé', 'Đã đưa bé đi an toàn', 'Đã đưa tới mái ấm / phòng khám']

export function RescueProgress({ id }: { id: string }) {
  const { getCase, go, me, toast, setMyRescue, updateCase, proof, setProof } = useApp()
  const c = getCase(id)
  const saved = flowOf(proof, id)
  const progress = Math.min(4, saved.progress ?? 0)
  const [cancel, setCancel] = useState(false)
  const [kind, setKind] = useState<PlaceKind>(findPlace(saved.handoff)?.kind ?? 'shelter')
  const [pick, setPick] = useState<string | null>(saved.handoff ?? null)
  if (!c) return <NotFound />
  if (c.assignee !== me) return <UserShell><Empty title="Bạn chưa phụ trách ca này" cta="Xem case" onCta={() => go(`/case/${c.id}`)} /></UserShell>
  const route = [{ ...ME_POS }, { x: (ME_POS.x + c.x) / 2 + 20, y: (ME_POS.y + c.y) / 2 - 15 }, { x: c.x, y: c.y }]
  const dist = kmFrom(c.x, c.y)
  const places = placesOf(kind)
  const confirmHandoff = () => {
    if (!pick) return
    setProof(c.id, flowPatch({ handoff: pick, progress: 4 }))
    updateCase(c.id, { shelterId: pick })
    go(`/case/${c.id}/proof`)
  }
  return (
    <UserShell hideFab>
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 rounded-3xl border-2 border-brown bg-butter p-4" role="status">
          <p className="font-display text-sm font-extrabold tracking-wide">🟡 ĐANG XỬ LÝ</p>
          <h1 className="font-display text-2xl font-extrabold leading-tight md:text-3xl">Bạn đang phụ trách ca này.</h1>
          <p className="mt-0.5 text-sm font-bold text-brown-soft">{c.id} · {c.name} · {c.species}</p>
        </div>
        <Card className="mb-5 px-3 py-4 md:px-6"><ProgressStepper current={stepFromProgress(progress)} /></Card>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="-mx-4 overflow-hidden border-y-2 border-brown bg-paper shadow-soft md:mx-0 md:rounded-3xl md:border-2 lg:self-start">
            <div className="h-72 lg:h-[460px]"><CityMap className="size-full" cases={[c]} revealIds={[c.id]} me={ME_POS} route={route} dest={{ x: c.x, y: c.y, label: c.name }} center={{ x: (ME_POS.x + c.x) / 2, y: (ME_POS.y + c.y) / 2, k: 1.5 }} /></div>
            <div className="space-y-1 p-4 text-sm font-extrabold">
              <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><Navigation className="size-4" />Cách bạn {dist} km</span><span>~{Math.max(3, Math.round(dist * 6))} phút di chuyển</span></div>
              <p className="text-xs font-bold text-brown-soft">Bản đồ hiển thị vị trí của bạn, vị trí cứu hộ và lộ trình gợi ý.</p>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-extrabold">Các bước cứu hộ</h2><span className="text-xs font-extrabold text-brown-soft">{progress}/4 hoàn thành</span></div>
              <ol className="space-y-2.5">
                {CHECKLIST.map((l, i) => {
                  const done = i < progress
                  const current = i === progress
                  const circle = (
                    <span className={cx('grid size-8 shrink-0 place-items-center rounded-full border-2 font-display text-sm font-extrabold', done ? 'border-brown bg-sage' : current ? 'border-brown bg-white' : 'border-brown/25 bg-paper text-brown/40')}>
                      {done ? <Check className="size-4" strokeWidth={3.5} /> : i + 1}
                    </span>
                  )
                  const cls = 'flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left'
                  if (current && i < 3) return (
                    <li key={l}><Btn type="button" variant="ghost" onClick={() => setProofProgress(i + 1)} className={cx(cls, 'border-brown bg-butter shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none')}>
                      {circle}<span className="flex-1 text-[15px] font-extrabold">{l}</span><span className="rounded-full border-2 border-brown bg-white px-2.5 py-1 text-xs font-extrabold">Bấm khi xong</span></Btn></li>
                  )
                  return (
                    <li key={l}><div aria-current={current ? 'step' : undefined} className={cx(cls, done ? 'border-sage bg-sage-soft' : current ? 'border-brown bg-butter' : 'border-line bg-cream-2/60 opacity-60')}>
                      {circle}<span className={cx('flex-1 text-[15px] font-extrabold', done && 'text-brown-soft')}>{l}</span>
                      {done && <span className="text-xs font-extrabold text-brown-soft">Hoàn thành</span>}
                      {current && <span className="text-xs font-extrabold">Chọn điểm bên dưới</span>}
                    </div></li>
                  )
                })}
              </ol>
            </Card>

            {progress >= 3 && (
              <Card className="space-y-3 p-4 md:p-5">
                <h2 className="font-display text-xl font-extrabold">Bàn giao bé</h2>
                <p className="text-sm font-semibold text-brown-soft">Chọn nơi bạn sẽ đưa bé tới. Chỉ chọn nơi đã được xác minh nếu có thể.</p>
                <Segmented value={kind} onChange={(k) => { setKind(k); setPick(null) }} options={[{ v: 'shelter', label: 'Mái ấm' }, { v: 'clinic', label: 'Phòng khám' }]} />
                <div className="space-y-2">{places.map((p) => <PlaceRow key={p.id} place={p} selected={pick === p.id} onClick={() => setPick(p.id)} />)}</div>
                <Btn full size="lg" pill disabled={!pick} onClick={confirmHandoff} className="px-4 text-base">Xác nhận điểm bàn giao</Btn>
                {!pick && <p className="text-center text-xs font-bold text-brown-soft">Chọn một {kindLabel(kind).toLowerCase()} để tiếp tục.</p>}
              </Card>
            )}

            <Note tone="coral" icon={<TriangleAlert className="size-5 shrink-0" />}>Giữ an toàn cho bản thân. Nếu bé hung dữ, đừng tự tiếp cận; gọi hỗ trợ.</Note>
            <Card className="flex items-center gap-3 p-4"><UserAvatar id={c.reporter} size={40} /><div className="flex-1 text-sm"><p className="font-extrabold">{userById(c.reporter)?.name}</p><p className="text-brown-soft">Người báo case</p></div><Btn size="sm" className="h-12" variant="secondary" icon={<Phone className="size-4" />} onClick={() => toast('Đang gọi người báo… (demo)')}>Gọi</Btn></Card>
            <Btn full variant="ghost" className="h-12" onClick={() => setCancel(true)}>Tôi không thể tiếp tục ca này</Btn>
          </div>
        </div>
      </div>
      <Modal open={cancel} onClose={() => setCancel(false)} title="Rút khỏi ca cứu hộ?">
        <p className="mb-4 font-semibold text-brown-soft">Ca này sẽ được mở lại cho người khác nhận. Bạn có thể nhận ca mới sau đó.</p>
        <div className="flex gap-2"><Btn variant="secondary" className="flex-1" onClick={() => setCancel(false)}>Tiếp tục cứu</Btn><Btn variant="danger" className="flex-1" onClick={() => { updateCase(c.id, { status: 'active', assignee: undefined }); setProof(c.id, flowPatch({ progress: 0, handoff: undefined })); setMyRescue(null); toast('Đã rút khỏi ca. Case được mở lại.', 'warn'); go(`/case/${c.id}`) }}>Rút khỏi ca</Btn></div>
      </Modal>
    </UserShell>
  )
  function setProofProgress(n: number) { setProof(id, flowPatch({ progress: n })) }
}

/* ---------------- PROOF ---------------- */
export function Proof({ id }: { id: string }) {
  const { getCase, updateCase, setMyRescue, go, proof } = useApp()
  const c = getCase(id)
  const [pet, setPet] = useState<string[]>([])
  const [spot, setSpot] = useState<string[]>([])
  const [conf, setConf] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)
  if (!c) return <NotFound />
  const hp = findPlace(flowOf(proof, id).handoff ?? c.shelterId)
  const ready = pet.length > 0 && spot.length > 0 && conf.length > 0 && !!hp
  if (done) return (
    <UserShell hideFab>
      <SuccessScreen title="Chờ xác minh" species={c.species} calm>
        <p className="max-w-md font-semibold text-brown-soft">Cảm ơn bạn đã cứu bé! Admin sẽ kiểm tra bằng chứng và xác nhận cùng nơi tiếp nhận trong thời gian sớm nhất.</p>
        <div className="w-full rounded-3xl border-2 border-brown bg-paper p-4"><VerifyStepper kind={hp?.kind ?? 'shelter'} shelter="wait" admin="wait" /></div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><Btn size="lg" onClick={() => go(`/case/${c.id}`)}>Xem trạng thái</Btn><Btn size="lg" variant="secondary" onClick={() => go(`/case/${c.id}/shelter-confirm`)}>Mô phỏng nơi tiếp nhận</Btn></div>
      </SuccessScreen>
    </UserShell>
  )
  const submit = () => {
    if (!ready || !hp) return
    updateCase(c.id, { status: 'pending', shelterId: hp.place.id }); setMyRescue(null); setDone(true)
  }
  const slots: { label: string; hint: string; files: string[]; set: (f: string[]) => void }[] = [
    { label: 'Ảnh pet', hint: 'Ảnh rõ bé sau khi đã an toàn', files: pet, set: setPet },
    { label: 'Ảnh tại địa điểm', hint: 'Ảnh tại nơi bạn đã bàn giao bé', files: spot, set: setSpot },
    { label: 'Ảnh xác nhận', hint: 'Ảnh cùng người tiếp nhận hoặc biên nhận', files: conf, set: setConf },
  ]
  return (
    <UserShell hideFab>
      <div className="mx-auto max-w-2xl">
        <Btn variant="ghost" size="sm" onClick={() => go(`/case/${c.id}/rescue`)} icon={<ArrowLeft className="size-4" />} className="mb-2">Quay lại</Btn>
        <h1 className="mb-1 font-display text-3xl font-extrabold md:text-4xl">Gửi xác nhận cứu hộ</h1>
        <p className="mb-5 font-semibold text-brown-soft">Cảm ơn bạn đã giúp bé. Tải 3 ảnh để Happy Paw xác minh nhanh hơn.</p>
        <Card className="space-y-5 p-4 md:p-7">
          <Field label="Điểm bàn giao">
            {hp ? <PlaceRow place={hp.place} trailing={<Badge tone="cream">{kindLabel(hp.kind)}</Badge>} />
              : <Note tone="butter" icon={<TriangleAlert className="size-5 shrink-0" />}>Bạn chưa chọn điểm bàn giao. <Btn variant="ghost" size="sm" className="inline h-auto p-0 font-extrabold underline" onClick={() => go(`/case/${c.id}/rescue`)}>Chọn ngay</Btn></Note>}
            {hp && <Btn variant="ghost" size="sm" onClick={() => go(`/case/${c.id}/rescue`)} className="mt-1 h-10 text-sm font-extrabold text-brown-soft underline">Đổi điểm bàn giao</Btn>}
          </Field>
          {slots.map((s, i) => (
            <Field key={s.label} label={`${i + 1}. ${s.label}`} required>
              <UploadBox label={s.files.length ? `Đã có ${s.label.toLowerCase()}` : `Thêm ${s.label.toLowerCase()}`} hint={s.hint} max={1} files={s.files} onChange={s.set} />
            </Field>
          ))}
          <Field label="Ghi chú"><Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tình trạng của bé, những gì đã làm…" /></Field>
          <Btn full size="lg" pill disabled={!ready} onClick={submit}>Gửi xác nhận cứu hộ</Btn>
          {!ready && <p className="text-center text-xs font-bold text-brown-soft">{hp ? `Còn thiếu ${3 - [pet, spot, conf].filter((f) => f.length).length} ảnh để gửi.` : 'Hãy chọn điểm bàn giao trước khi gửi.'}</p>}
        </Card>
      </div>
    </UserShell>
  )
}

/* ---------------- SHELTER CONFIRM ---------------- */
export function ShelterConfirm({ id }: { id: string }) {
  const { getCase, proof, setProof, updateCase, go, toast } = useApp()
  const c = getCase(id)
  if (!c) return <NotFound />
  const hp = findPlace(c.shelterId) ?? { place: SHELTERS[0], kind: 'shelter' as PlaceKind }
  const sh = hp.place
  const p = proof[c.id] || {}
  const resolved = c.status === 'resolved'
  return (
    <UserShell>
      <div className="mx-auto max-w-xl">
        <Badge tone="sky">Màn hình dành cho {kindLabel(hp.kind).toLowerCase()} (mô phỏng)</Badge>
        <h1 className="mb-1 mt-2 font-display text-3xl font-extrabold">Xác nhận tiếp nhận</h1>
        <p className="mb-5 font-semibold text-brown-soft">{sh.name} · {sh.district}</p>
        <Card className="space-y-4 p-4 md:p-5">
          <div className="rounded-2xl bg-cream-2 p-3"><VerifyStepper kind={hp.kind} shelter={resolved || p.shelterConfirmed ? 'done' : p.mismatch ? 'warn' : 'wait'} admin={resolved ? 'done' : 'wait'} /></div>
          <div className="flex gap-3"><PetPhoto src={c.photo} species={c.species} alt={c.name} className="size-24 shrink-0 rounded-2xl border-2 border-brown" />
            <div className="text-sm font-bold"><p className="font-display text-xl font-extrabold">{c.name}</p><p>{c.species} · {c.color}</p><p className="text-brown-soft">Người cứu: {userById(c.assignee)?.name ?? 'Nguyễn Minh'}</p><StatusBadge status={c.status} critical={c.critical} /></div></div>
          {resolved ? <Btn full size="lg" onClick={() => go(`/case/${c.id}/resolved`)}>Xem kết quả</Btn>
            : p.mismatch ? <MismatchCard onView={() => go(`/case/${c.id}`)} />
            : p.shelterConfirmed ? (
              <>
                <Note tone="sage" icon={<Check className="size-5 shrink-0" />}>Đã xác nhận tiếp nhận. Admin sẽ duyệt và đóng case.</Note>
                <Btn full size="lg" variant="secondary" onClick={() => { updateCase(c.id, { status: 'resolved' }); toast('Admin đã duyệt (demo)'); go(`/case/${c.id}/resolved`) }}>Mô phỏng Admin duyệt</Btn>
              </>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                <Btn size="lg" onClick={() => { setProof(c.id, { shelterConfirmed: true }); toast('Đã xác nhận tiếp nhận') }}>Xác nhận đã tiếp nhận</Btn>
                <Btn size="lg" variant="danger" onClick={() => { setProof(c.id, { mismatch: true }); toast('Đã báo không khớp', 'warn') }}>Không khớp thông tin</Btn>
              </div>)}
          <Btn variant="ghost" full onClick={() => go(`/case/${c.id}`)}>Về trang case</Btn>
        </Card>
      </div>
    </UserShell>
  )
}

/* ---------------- RESOLVED ---------------- */
export function Resolved({ id }: { id: string }) {
  const { getCase, go } = useApp()
  const c = getCase(id)
  if (!c) return <NotFound />
  if (c.status !== 'resolved') return <UserShell><Empty title="Case này chưa được giải quyết" body="Chúng mình sẽ báo ngay khi Admin xác minh xong." cta="Xem case" onCta={() => go(`/case/${c.id}`)} /></UserShell>
  return (
    <UserShell hideFab>
      <div className="relative mx-auto max-w-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-60 overflow-hidden opacity-60 motion-reduce:hidden" aria-hidden><Confetti /></div>
        <SuccessScreen title="🟢 Đã giải quyết thành công" species={c.species} calm>
          <p className="font-display text-xl font-extrabold">Bé đã được an toàn 🐾</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-brown bg-butter px-4 py-1.5 font-extrabold"><Paw className="size-4" />+1 ca cứu hộ</span>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><Btn size="lg" onClick={() => go('/profile')}>Xem thành tích</Btn><Btn size="lg" variant="secondary" onClick={() => go('/map')}>Về bản đồ</Btn></div>
        </SuccessScreen>
      </div>
    </UserShell>
  )
}

/* ---------------- FLYER ---------------- */
export function Flyer({ id }: { id: string }) {
  const { getCase, back, toast } = useApp()
  const c = getCase(id)
  const [tpl, setTpl] = useState<'yellow' | 'cream' | 'pink'>('yellow')
  const [phone, setPhone] = useState('0912 *** 345')
  const [msg, setMsg] = useState('Gia đình rất nhớ bé. Ai thấy xin liên hệ giúp!')
  const [reward, setReward] = useState(!!c?.reward)
  const [share, setShare] = useState(false)
  if (!c) return <NotFound />
  const bg = { yellow: 'bg-butter', cream: 'bg-cream-2', pink: 'bg-pink' }[tpl]
  return (
    <UserShell>
      <div className="mx-auto max-w-5xl">
        <Btn variant="ghost" size="sm" onClick={back} icon={<ArrowLeft className="size-4" />} className="mb-2">Quay lại</Btn>
        <h1 className="bubble mb-5 font-display text-4xl font-extrabold">Tạo tờ rơi tìm boss</h1>
        <div className="grid gap-6 md:grid-cols-[1fr_380px]">
          <Card className="order-2 space-y-4 p-5 md:order-1">
            <Field label="Mẫu tờ rơi"><Segmented value={tpl} onChange={setTpl} options={[{ v: 'yellow', label: 'Bơ vàng' }, { v: 'cream', label: 'Kem' }, { v: 'pink', label: 'Hồng' }]} /></Field>
            <Field label="Số điện thoại"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
            <Field label="Lời nhắn"><Textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
            <Check2 on={reward} onChange={setReward}>Hiển thị “Có hậu tạ”</Check2>
            <div className="grid grid-cols-2 gap-2"><Btn onClick={() => setShare(true)} icon={<Link2 className="size-4" />}>Chia sẻ</Btn><Btn variant="secondary" onClick={() => toast('Đã tải tờ rơi (demo)')} icon={<Download className="size-4" />}>Tải xuống</Btn></div>
          </Card>
          <div className="order-1 md:order-2">
            <div className={cx('mx-auto w-full max-w-[380px] rounded-[28px] border-[3px] border-brown p-5 text-center shadow-pop', bg)}>
              <p className="bubble font-display text-5xl font-extrabold leading-none">TÌM BÉ</p>
              <p className="mt-1 font-display text-xl font-extrabold">{c.species === 'Mèo' ? 'MÈO' : 'CHÓ'} BỊ LẠC</p>
              <PetPhoto src={c.photo} species={c.species} alt={c.name} className="mx-auto mt-3 aspect-square w-full rounded-3xl border-[3px] border-brown" />
              <h2 className="mt-3 font-display text-4xl font-extrabold">{c.name.toUpperCase()}</h2>
              <p className="text-sm font-bold">{c.breed} · {c.color} · {c.gender}</p>
              <p className="mt-1 text-sm font-semibold">Lạc tại {c.street}, {c.district}</p>
              <p className="mt-2 rounded-2xl bg-paper/80 p-2 text-sm font-semibold">{msg}</p>
              {reward && <p className="mt-2 inline-block rounded-full bg-coral px-4 py-1 font-extrabold text-white">CÓ HẬU TẠ</p>}
              <p className="mt-3 flex items-center justify-center gap-2 font-display text-2xl font-extrabold"><Phone className="size-5" />{phone}</p>
              <p className="mt-1 text-xs font-bold opacity-70">Mã case {c.id} · happypaw.vn</p>
            </div>
          </div>
        </div>
      </div>
      <Modal open={share} onClose={() => setShare(false)} title="Chia sẻ tờ rơi">
        <div className="grid grid-cols-2 gap-3">
          {[['Facebook Group', Facebook], ['Messenger', MessageCircle], ['Copy link', Copy], ['Tải xuống', Download]].map(([l, I]: any) => (
            <Btn key={l} variant="ghost" onClick={() => { toast(l === 'Copy link' ? 'Đã sao chép liên kết' : `Đã chia sẻ qua ${l} (demo)`); setShare(false) }} className="flex h-auto flex-col items-center gap-2 rounded-3xl border-2 border-brown bg-cream-2 p-5 font-extrabold transition hover:bg-butter"><I className="size-7" />{l}</Btn>
          ))}
        </div>
      </Modal>
      <span className="hidden"><Bookmark /><Siren /></span>
    </UserShell>
  )
}

export function caseRoute(path: string) {
  const { seg, query } = parsePath(path)
  if (seg[0] !== 'case' || !seg[1]) return null
  const id = seg[1]
  switch (seg[2]) {
    case undefined: return <CaseDetail id={id} query={query} />
    case 'update': return <UpdateLocation id={id} />
    case 'rescue': return <RescueProgress id={id} />
    case 'proof': return <Proof id={id} />
    case 'resolved': return <Resolved id={id} />
    case 'shelter-confirm': return <ShelterConfirm id={id} />
    case 'flyer': return <Flyer id={id} />
  }
  return null
}
