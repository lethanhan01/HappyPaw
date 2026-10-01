import { useState } from 'react'
import { Building2, Crown, Globe, Heart, HandHeart, MapPin, Package, Stethoscope, Trophy, TriangleAlert, ExternalLink } from 'lucide-react'
import { useApp } from '@/store'
import { LEADERS, SHELTERS, STORIES, USERS } from '@/constants'
import type { LeaderRow, Shelter } from '@/types'
import { Avatar, Badge, Btn, Card, Chip, Empty, Modal, Note, PageHead, Segmented, Select, Verified } from '@ui'
import { cx } from '@/lib'
import { PseudoQR, SectionTitle } from './Shared'

/* ---------------- Community hub ---------------- */
export function CommunityHub() {
  const { go } = useApp()
  const tiles = [
    { to: '/shelters', label: 'Mái ấm', sub: `${SHELTERS.length} nơi đang chăm sóc các bé`, icon: Building2, bg: 'bg-sage-soft' },
    { to: '/clinics', label: 'Phòng khám', sub: 'Thú y đáng tin cậy gần bạn', icon: Stethoscope, bg: 'bg-sky-soft' },
    { to: '/leaderboard', label: 'Leaderboard', sub: 'Những người hùng thầm lặng', icon: Trophy, bg: 'bg-butter/70' },
    { to: '/donate', label: 'Donate', sub: 'Chung tay giúp các mái ấm', icon: Heart, bg: 'bg-pink' },
  ]
  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border-2 border-brown bg-butter/60 p-6 shadow-soft md:p-8">
        <h1 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">Những người tạo nên Happy Paws</h1>
        <p className="mt-2 max-w-2xl text-lg text-brown-2">Mỗi bé được về nhà là nhờ một cộng đồng nhỏ nhưng ấm: tình nguyện viên, mái ấm, bác sĩ thú y và cả những người chỉ kịp chia sẻ một bài viết.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.to} hover onClick={() => go(t.to)} className={cx('flex flex-col gap-2 p-5', t.bg)}>
            <span className="grid size-12 place-items-center rounded-2xl border-2 border-brown bg-paper"><t.icon className="size-6" /></span>
            <h3 className="font-display text-xl font-extrabold leading-tight">{t.label}</h3>
            <p className="text-sm text-brown-soft">{t.sub}</p>
          </Card>
        ))}
      </div>

      <section>
        <SectionTitle sub="Những câu chuyện nhỏ làm ấm cả ngày">Pet rescue stories</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {STORIES.map((s) => (
            <Card key={s.id} className="overflow-hidden p-0">
              <img src={s.photo} alt={s.title} loading="lazy" className="h-40 w-full object-cover" />
              <div className="space-y-1.5 p-4">
                <h3 className="font-display text-lg font-extrabold leading-snug">{s.title}</h3>
                <p className="text-sm text-brown-soft">{s.excerpt}</p>
                <p className="flex items-center gap-1 pt-1 text-xs font-extrabold text-brown-soft"><MapPin className="size-3.5" />{s.place} · {s.author}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle right={<Btn size="sm" variant="secondary" onClick={() => go('/leaderboard')}>Xem tất cả</Btn>} sub="Cảm ơn vì đã luôn có mặt khi các bé cần">Thành viên nổi bật</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {LEADERS.slice(0, 3).map((l, i) => (
            <Card key={l.name} className="flex items-center gap-3 p-4">
              <Avatar name={l.name} tone={l.avatar} size={52} />
              <div className="min-w-0"><p className="truncate font-extrabold">{l.name}</p><p className="text-sm text-brown-soft">{l.area} · {l.rescues} ca cứu hộ</p></div>
              {i === 0 && <Crown className="ml-auto size-5 shrink-0" />}
            </Card>
          ))}
        </div>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-3 bg-pink/50">
        <div><h3 className="font-display text-xl font-extrabold">Bạn muốn đồng hành cùng các bé?</h3><p className="text-sm text-brown-2">Một món quà nhỏ cũng là một ngày no bụng cho các bé ở mái ấm.</p></div>
        <Btn onClick={() => go('/donate')} icon={<HandHeart className="size-5" />}>Tìm cách giúp đỡ</Btn>
      </Card>
    </div>
  )
}

/* ---------------- Donate ---------------- */
function UrgentShelters() {
  const { go } = useApp()
  const list = SHELTERS.filter((s) => s.urgent).sort((a, b) => a.distance - b.distance)
  return (
    <section>
      <SectionTitle sub="Sắp xếp theo khoảng cách">Mái ấm gần bạn đang cần hỗ trợ</SectionTitle>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((s) => (
          <Card key={s.id} className="flex items-center gap-3 p-4">
            <img src={s.photo} alt={s.name} className="size-16 shrink-0 rounded-2xl border-2 border-brown object-cover" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-1.5 font-display text-lg font-extrabold leading-tight">{s.name}{s.verified && <Verified />}</p>
              <p className="text-sm text-brown-soft">{s.district} · {s.distance} km</p>
              <p className="line-clamp-1 text-sm font-bold">Cần: {s.needs.join(', ')}</p>
            </div>
            <Btn size="sm" onClick={() => go(`/donate/money?shelter=${s.id}`)}>Giúp</Btn>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function DonateHome() {
  const { go } = useApp()
  const opts = [
    { to: '/donate/money', emoji: '💰', title: 'Quyên góp tiền', sub: 'Chuyển trực tiếp tới tài khoản chính thức của mái ấm đã xác minh.', bg: 'bg-butter/70' },
    { to: '/donate/goods', emoji: '📦', title: 'Gửi hiện vật', sub: 'Thức ăn, thuốc, chăn đệm… theo đúng danh sách mái ấm đang cần.', bg: 'bg-sage-soft' },
  ]
  return (
    <div className="space-y-8">
      <PageHead title="Bạn muốn giúp theo cách nào?" sub="Mọi khoản hỗ trợ đều đến thẳng tay mái ấm, Happy Paws không đứng giữa." />
      <div className="grid gap-5 md:grid-cols-2">
        {opts.map((o) => (
          <Card key={o.to} hover onClick={() => go(o.to)} className={cx('flex flex-col gap-3 p-7', o.bg)}>
            <span className="text-6xl" aria-hidden>{o.emoji}</span>
            <h2 className="font-display text-3xl font-extrabold">{o.title}</h2>
            <p className="text-brown-2">{o.sub}</p>
            <span className="font-extrabold">Tiếp tục →</span>
          </Card>
        ))}
      </div>
      <UrgentShelters />
    </div>
  )
}

export function DonateMoney({ shelterId }: { shelterId?: string }) {
  const { toast, back } = useApp()
  const [id, setId] = useState(SHELTERS.find((s) => s.id === shelterId)?.id || SHELTERS[0].id)
  const s = SHELTERS.find((x) => x.id === id) as Shelter
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHead title="Quyên góp tiền" sub="Chọn mái ấm bạn muốn đồng hành." back={back} />
      <Card>
        <label className="mb-1.5 block text-sm font-extrabold" htmlFor="shelter-pick">Mái ấm nhận quyên góp</label>
        <Select id="shelter-pick" value={id} onChange={(e) => setId(e.target.value)}>
          {SHELTERS.map((x) => <option key={x.id} value={x.id}>{x.name} · {x.district}</option>)}
        </Select>
      </Card>

      <Card className="space-y-5">
        <div className="flex items-center gap-3">
          <img src={s.photo} alt={s.name} className="size-16 rounded-2xl border-2 border-brown object-cover" />
          <div>
            <p className="font-display text-xl font-extrabold leading-tight">{s.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {s.verified ? <Verified label="Danh tính đã xác minh" /> : <Badge tone="orange" icon={<TriangleAlert className="size-3.5" />}>Chưa xác minh danh tính</Badge>}
              <span className="text-sm text-brown-soft">{s.address}</span>
            </div>
          </div>
        </div>
        {!s.verified && <Note tone="coral" icon={<TriangleAlert className="size-5 shrink-0" />}>Đơn vị này chưa được Happy Paws xác minh. Hãy tìm hiểu kỹ trước khi chuyển tiền.</Note>}
        <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
          <div className="mx-auto"><PseudoQR seed={s.id + s.bank} /></div>
          <dl className="space-y-3">
            <div><dt className="text-xs font-extrabold uppercase tracking-wide text-brown-soft">Kênh quyên góp chính thức</dt><dd className="text-lg font-extrabold">{s.bank}</dd></div>
            <div><dt className="text-xs font-extrabold uppercase tracking-wide text-brown-soft">Chủ tài khoản</dt><dd className="font-bold">{s.name}</dd></div>
            <div><dt className="text-xs font-extrabold uppercase tracking-wide text-brown-soft">Website</dt><dd className="flex items-center gap-1.5 font-bold"><Globe className="size-4" />{s.website}</dd></div>
          </dl>
        </div>
        <Note tone="butter" icon={<TriangleAlert className="size-5 shrink-0" />}><b>Happy Paws không trực tiếp giữ tiền donate.</b> Bạn chuyển khoản thẳng đến mái ấm qua kênh chính thức ở trên.</Note>
        <Btn full size="lg" icon={<ExternalLink className="size-5" />} onClick={() => toast(`Đang mở kênh quyên góp của ${s.name}`)}>Mở kênh quyên góp chính thức</Btn>
      </Card>
    </div>
  )
}

const CATS = ['Thức ăn', 'Hạt', 'Thuốc', 'Đồ dùng', 'Quần áo'] as const
const catOf = (n: string): (typeof CATS)[number] => {
  const t = n.toLowerCase()
  if (/hạt/.test(t)) return 'Hạt'
  if (/thuốc|vaccine|tẩy giun/.test(t)) return 'Thuốc'
  if (/chăn|đệm|áo/.test(t)) return 'Quần áo'
  if (/thức ăn|pate|sữa/.test(t)) return 'Thức ăn'
  return 'Đồ dùng'
}
const lc = (s: string) => (/^\d/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1))

export function DonateGoods() {
  const { back } = useApp()
  const [cat, setCat] = useState<string>('all')
  const [open, setOpen] = useState<Shelter | null>(null)
  const items = SHELTERS.flatMap((s) => s.needs.map((n) => ({ s, n, c: catOf(n) }))).filter((i) => cat === 'all' || i.c === cat)
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageHead title="Gửi hiện vật" sub="Chọn loại hiện vật bạn có thể gửi, xem mái ấm nào đang cần." back={back} />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        <Chip active={cat === 'all'} onClick={() => setCat('all')}>Tất cả</Chip>
        {CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>
      {items.length === 0 ? <Empty title="Hiện chưa có mái ấm cần loại này." body="Bạn thử chọn loại khác nhé." /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((i) => (
            <Card key={i.s.id + i.n} className="flex flex-col gap-2 p-4">
              <Badge tone="sage" className="self-start"><Package className="size-3" />{i.c}</Badge>
              <p className="font-display text-lg font-extrabold leading-snug">Cần {lc(i.n)}</p>
              <p className="flex flex-wrap items-center gap-1.5 text-sm text-brown-soft"><span className="font-bold text-brown">{i.s.name}</span>{i.s.verified && <Verified />}<span>· {i.s.distance} km</span></p>
              <Btn size="sm" variant="secondary" className="mt-1 self-start" onClick={() => setOpen(i.s)}>Xem địa chỉ nhận</Btn>
            </Card>
          ))}
        </div>
      )}
      <Modal open={!!open} onClose={() => setOpen(null)} title="Địa chỉ nhận hiện vật">
        {open && (
          <div className="space-y-3">
            <p className="font-display text-xl font-extrabold">{open.name}</p>
            <p className="flex items-start gap-2 font-bold"><MapPin className="mt-0.5 size-5 shrink-0" />{open.address}</p>
            <p className="text-sm text-brown-soft">Liên hệ trước: {open.phone}</p>
            <Note tone="butter">Hãy gọi báo trước khi mang hiện vật đến để mái ấm kịp sắp xếp nhé.</Note>
            <Btn full variant="secondary" onClick={() => setOpen(null)}>Đã hiểu</Btn>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ---------------- Leaderboard ---------------- */
const MY_DISTRICT = 'Cầu Giấy'
const LOCAL_EXTRA: LeaderRow[] = [
  { name: 'Mai Thùy Dương', area: 'Cầu Giấy', rescues: 3, joined: '08/2025', verified: false, avatar: 'sage' },
  ...USERS.filter((u) => u.area === MY_DISTRICT && u.id !== 'u1' && u.rescues > 0).map((u) => ({ name: u.name, area: u.area, rescues: u.rescues, joined: u.joined, verified: u.verified, avatar: u.avatar })),
]

export function Leaderboard() {
  const [tab, setTab] = useState<'city' | 'mine'>('city')
  const rows = (tab === 'city' ? LEADERS : [...LEADERS, ...LOCAL_EXTRA].filter((l) => l.area === MY_DISTRICT)).slice().sort((a, b) => b.rescues - a.rescues)
  const top = rows.slice(0, 3)
  const rest = rows.slice(3)
  const style = ['bg-butter md:-translate-y-3', 'bg-sky-soft', 'bg-peach/70']
  return (
    <div className="space-y-6">
      <PageHead title="Những người hùng của Happy Paws" sub="Xếp hạng theo số ca cứu hộ thành công (Successful Rescue Cases)." right={
        <Segmented value={tab} onChange={setTab} options={[{ v: 'city', label: 'Hà Nội' }, { v: 'mine', label: `Quận của tôi (${MY_DISTRICT})` }]} />} />
      <Note tone="sage" icon={<Heart className="size-5 shrink-0" />}>Bảng xếp hạng <b>không bao giờ</b> dựa trên số tiền donate. Chỉ những ca cứu hộ thành công được xác nhận mới được tính.</Note>
      <div className="grid gap-4 md:grid-cols-3 md:pt-3">
        {top.map((l, i) => (
          <Card key={l.name} className={cx('flex flex-col items-center gap-1.5 py-6 text-center', style[i], i === 0 && 'md:order-2', i === 1 && 'md:order-1', i === 2 && 'md:order-3')}>
            <span className="grid size-10 place-items-center rounded-full border-2 border-brown bg-paper font-display text-lg font-extrabold">#{i + 1}</span>
            <Avatar name={l.name} tone={l.avatar} size={72} />
            <p className="flex items-center gap-1.5 font-display text-xl font-extrabold">{l.name}{l.verified && <Verified label="" />}</p>
            <p className="text-sm font-bold text-brown-soft">{l.area}</p>
            <p className="font-display text-4xl font-extrabold leading-none">{l.rescues}</p>
            <p className="text-xs font-extrabold uppercase tracking-wide text-brown-soft">ca cứu hộ thành công</p>
          </Card>
        ))}
      </div>
      {rest.length > 0 && (
        <Card className="p-2">
          <ol>
            {rest.map((l, i) => (
              <li key={l.name} className="flex items-center gap-3 rounded-2xl px-3 py-3 odd:bg-cream-2/40">
                <span className="w-7 text-center font-display text-lg font-extrabold text-brown-soft">{i + 4}</span>
                <Avatar name={l.name} tone={l.avatar} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-1.5 font-extrabold"><span className="truncate">{l.name}</span>{l.verified && <Verified />}</p>
                  <p className="text-xs text-brown-soft">{l.area} · Tham gia {l.joined}</p>
                </div>
                <p className="text-right"><span className="font-display text-2xl font-extrabold">{l.rescues}</span><span className="block text-[11px] font-bold text-brown-soft">ca cứu hộ</span></p>
              </li>
            ))}
          </ol>
        </Card>
      )}
      {rows.length === 0 && <Empty title="Chưa có dữ liệu cho khu vực này." />}
      <p className="text-sm text-brown-soft">Dữ liệu minh họa cho bản prototype.</p>
    </div>
  )
}
