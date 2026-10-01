import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  SlidersHorizontal,
  Map as MapIcon,
  List,
  PawPrint,
  Siren,
  Home as HomeIcon,
  Stethoscope,
  Search as SearchIcon,
  Plus,
  Minus,
  LocateFixed,
  ChevronRight,
  ArrowLeft,
  X,
} from 'lucide-react'
import CityMap, {
  LegendSwatch,
  MapLegend,
  PIN_META,
  ME_POS,
  kmFrom,
  KM,
  type MapApi,
  type PinType,
  type Sel,
  F0,
  MapPreview,
  SearchBar,
  TIME_OPTS,
  countFilters,
  matchCase,
  placeAllowed,
  type Filters,
  type SearchHit,
  type StatusKey,
  approxLoc,
} from '@/features/map'
import UserShell from '@/layouts/UserShell'
import { useApp } from '@/store'
import { CLINICS, SHELTERS } from '@/constants/mock/places'
import { RISKS } from '@/constants/mock/risks'
import { DISTRICTS } from '@/constants/districts'
import { BottomSheet, Btn, IconBtn, Chip, Empty, Field, Input, Modal, Segmented, Select, Badge, StatusBadge, cx } from '@ui'
import { useMedia } from '@/hooks/useMedia'
import { CaseCard, CaseCardSkeleton } from '@/components/common'

export { approxLoc } from '@/features/map'

const QUICK = [
  { label: 'Tìm pet lạc', icon: SearchIcon, to: '/report/lost', tone: 'bg-orange-soft' },
  { label: 'Báo thấy pet', icon: PawPrint, to: '/report/found', tone: 'bg-butter/70' },
  { label: 'Cần cứu hộ', icon: Siren, to: '/report/rescue', tone: 'bg-coral-soft' },
  { label: 'Tìm mái ấm', icon: HomeIcon, to: '/shelters', tone: 'bg-sage-soft' },
  { label: 'Tìm phòng khám', icon: Stethoscope, to: '/clinics', tone: 'bg-sky-soft' },
]
const TYPES: PinType[] = ['rescue', 'lost', 'shelter', 'clinic', 'warning']
const STATUSES: [StatusKey, string][] = [
  ['active', 'Đang cần hỗ trợ'],
  ['progress', 'Đang xử lý'],
  ['resolved', 'Đã giải quyết'],
]
const toggle = <T,>(a: T[], v: T) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v])

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-extrabold">{title}</p>
      {children}
    </div>
  )
}

export default function Explorer({ variant }: { variant: 'home' | 'map' }) {
  const { cases, go } = useApp()
  const desktop = useMedia('(min-width: 1024px)')
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState<Sel | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState(['Cầu Giấy', 'Golden Retriever', 'Trần Thái Tông'])
  const [f, setF] = useState<Filters>(F0)
  const [draft, setDraft] = useState<Filters>(F0)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [snap, setSnap] = useState<0 | 1 | 2>(0)
  const [hiddenKinds, setHiddenKinds] = useState<PinType[]>([])
  const api = useRef<MapApi | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const list = useMemo(() => cases.filter((c) => matchCase(c, f, q)), [cases, f, q])
  const mapCases = useMemo(
    () =>
      (hiddenKinds.includes('rescue') || hiddenKinds.includes('lost')
        ? list.filter((c) => !hiddenKinds.includes(c.type === 'rescue' ? 'rescue' : 'lost'))
        : list
      ).filter((c) => c.status !== 'resolved'),
    [list, hiddenKinds],
  )
  const n = countFilters(f)
  const shown = (t: PinType) => placeAllowed(f, t) && !hiddenKinds.includes(t)
  const selCase = sel?.kind === 'case' ? cases.find((c) => c.id === sel.id) : undefined
  const examples = list.filter((c) => c.status !== 'resolved').slice(0, 3)
  const draftCount = cases.filter((c) => matchCase(c, draft, q)).length

  const select = (s: Sel | null) => {
    setSel(s)
    if (s) {
      setSnap(1)
      setView('map')
    }
  }
  const commit = (v: string) => {
    const t = v.trim()
    if (t) setRecent((r) => [t, ...r.filter((x) => x !== t)].slice(0, 4))
  }
  const clearAll = () => {
    setF(F0)
    setDraft(F0)
    setQ('')
    setHiddenKinds([])
  }

  const hits = useMemo<SearchHit[]>(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    const out: SearchHit[] = []
    cases
      .filter(
        (c) =>
          c.status !== 'resolved' &&
          [c.name, c.district, c.street, c.breed, c.color, c.species].join(' ').toLowerCase().includes(t),
      )
      .slice(0, 4)
      .forEach((c) =>
        out.push({
          key: c.id,
          label: `${c.name} · ${c.species} ${c.color.toLowerCase()}`,
          sub: `${c.street}, ${c.district} · ${c.type === 'rescue' ? 'Cần cứu hộ' : 'Thất lạc'}`,
          type: c.type === 'rescue' ? 'rescue' : 'lost',
          onPick: () => {
            setQ('')
            select({ kind: 'case', id: c.id })
          },
        }),
      )
    ;[
      ...SHELTERS.map((p) => ({ p, kind: 'shelter' as const })),
      ...CLINICS.map((p) => ({ p, kind: 'clinic' as const })),
    ]
      .filter(({ p }) => `${p.name} ${p.district}`.toLowerCase().includes(t))
      .slice(0, 3)
      .forEach(({ p, kind }) =>
        out.push({
          key: p.id,
          label: p.name,
          sub: `${kind === 'shelter' ? 'Mái ấm' : 'Phòng khám'} · ${p.district}`,
          type: kind,
          onPick: () => {
            setQ('')
            setHiddenKinds((h) => h.filter((x) => x !== kind))
            select({ kind, id: p.id })
            api.current?.focus(p.x, p.y, 1.6)
          },
        }),
      )
    DISTRICTS.filter((d) => d.toLowerCase().includes(t))
      .slice(0, 1)
      .forEach((d) =>
        out.push({
          key: `d-${d}`,
          label: `Quận ${d}`,
          sub: 'Lọc theo khu vực',
          type: 'warning',
          onPick: () => {
            setQ('')
            setF((o) => ({ ...o, district: d }))
          },
        }),
      )
    return out
  }, [q, cases]) // eslint-disable-line react-hooks/exhaustive-deps

  const center = selCase
    ? { x: selCase.x, y: selCase.y + (desktop ? 0 : 40), k: 1.5 }
    : { x: 445, y: 350, k: desktop ? 1 : 0.95 }
  const selLost = selCase && selCase.type === 'lost' && selCase.status !== 'resolved'

  const openFilter = () => {
    setDraft(f)
    setOpen(true)
  }
  const search = (
    <SearchBar
      value={q}
      onChange={setQ}
      hits={hits}
      recent={recent}
      onCommit={commit}
      onClearRecent={() => setRecent([])}
      size={desktop ? 'md' : 'lg'}
    />
  )

  const filterBtn = (
    <Btn
      variant={n ? 'primary' : 'secondary'}
      size={desktop ? 'md' : 'lg'}
      pill
      onClick={openFilter}
      aria-label={`Bộ lọc${n ? ` · ${n}` : ''}`}
      className={cx(
        'relative inline-flex shrink-0 items-center justify-center gap-2 border-2 border-brown font-extrabold',
        desktop ? 'h-11 px-4 text-sm' : '!size-12 !p-0 shadow-soft',
      )}
    >
      <SlidersHorizontal className="size-5" />
      {desktop && <>Bộ lọc{n > 0 && ` · ${n}`}</>}
      {!desktop && n > 0 && (
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-coral text-[11px] font-extrabold text-white">
          {n}
        </span>
      )}
    </Btn>
  )

  const resultList = loading ? (
    <div className="space-y-3">
      <CaseCardSkeleton compact />
      <CaseCardSkeleton compact />
      <CaseCardSkeleton compact />
    </div>
  ) : list.length === 0 ? (
    <Empty
      title="Chưa có case nào trong khu vực này 🐾"
      body="Thử mở rộng bán kính hoặc bỏ bớt bộ lọc nhé."
      cta="Xóa bộ lọc"
      onCta={clearAll}
    />
  ) : (
    <div className="space-y-3">
      {list
        .filter((c) => desktop || sel?.id !== c.id)
        .map((c) => (
          <div key={c.id} onMouseEnter={() => setHoverId(c.id)} onMouseLeave={() => setHoverId(null)}>
            <CaseCard c={c} compact selected={sel?.id === c.id} onSelect={() => select({ kind: 'case', id: c.id })} />
          </div>
        ))}
    </div>
  )

  const summary = (
    <div className="rounded-3xl border-2 border-brown bg-butter/60 p-3.5">
      <p className="font-display text-xl font-extrabold leading-tight">
        {list.filter((c) => c.status !== 'resolved').length} case đang hoạt động gần bạn
      </p>
      {examples.length > 0 && (
        <ul className="mt-1 space-y-0.5 text-sm font-bold">
          {examples.map((c) => (
            <li key={c.id}>
              <Btn
                variant="ghost"
                size="sm"
                className="!p-0 !h-auto !border-0 text-left hover:underline font-bold"
                onClick={() => select({ kind: 'case', id: c.id })}
              >
                {c.district} —{' '}
                {c.type === 'rescue'
                  ? 'cần cứu hộ'
                  : `${c.species.toLowerCase()} ${c.color.toLowerCase()} ${c.type === 'found' ? 'được báo thấy' : 'bị lạc'}`}
                .
              </Btn>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const mapEl = (
    <CityMap
      className="size-full"
      cases={mapCases}
      shelters={shown('shelter') ? SHELTERS : []}
      clinics={shown('clinic') ? CLINICS : []}
      risks={shown('warning') ? RISKS : []}
      selected={sel}
      onSelect={select}
      radius={{ ...ME_POS, km: f.radius }}
      me={ME_POS}
      center={center}
      loading={loading}
      controls={desktop}
      apiRef={api}
      hoverId={hoverId}
      predicted={selLost ? { x: selCase.x, y: selCase.y, r: 0.5 * KM } : null}
      trail={selLost ? selCase.trail?.map((t) => ({ x: t.x, y: t.y, t: t.t })) : undefined}
      controlsClass="bottom-6"
      focusKey={selCase ? selCase.id : undefined}
    />
  )

  return (
    <UserShell fullBleed hideFab>
      <div className="relative h-[calc(100dvh-64px-68px)] overflow-hidden lg:h-[calc(100dvh-64px)] lg:flex lg:flex-row">
        {/* AREA 1: Desktop Left Control Sidebar */}
        {desktop && (
          <aside className="flex w-[320px] xl:w-[350px] shrink-0 min-h-0 flex-col border-r-2 border-brown/15 bg-cream">
            {variant === 'home' && (
              <div className="px-4 pt-4">
                <p className="font-display text-2xl font-extrabold leading-tight">
                  Chào Linh <span className="inline-block animate-bounce-soft">🐾</span>
                </p>
                <p className="text-sm text-brown-soft">Cùng tìm lại những chiếc đuôi nhỏ.</p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {QUICK.map((a) => (
                    <Btn
                      key={a.label}
                      onClick={() => go(a.to)}
                      variant="ghost"
                      className={cx(
                        'flex h-auto flex-col items-center gap-1 rounded-2xl border-2 border-brown/20 px-1 py-2.5 text-center text-[11px] font-extrabold leading-tight transition hover:-translate-y-0.5 hover:border-brown',
                        a.tone,
                      )}
                    >
                      <a.icon className="size-5" />
                      {a.label}
                    </Btn>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3 p-4">
              {search}
              <div className="flex items-center gap-2">
                {filterBtn}
                <Segmented
                  className="min-w-0 flex-1 justify-between [&>button]:px-2.5"
                  value={String(f.radius)}
                  onChange={(v) => setF({ ...f, radius: Number(v) })}
                  options={[1, 3, 5, 10].map((r) => ({ v: String(r), label: `${r} km` }))}
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
              {summary}
              <div className="rounded-3xl border-2 border-line bg-paper/85 p-3.5 space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wide text-brown-soft">Lọc nhanh loài</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Tất cả', 'Chó', 'Mèo', 'Khác'].map((s) => {
                    const isAll = s === 'Tất cả'
                    const active = isAll ? !f.species : f.species === s
                    return (
                      <Chip
                        key={s}
                        active={active}
                        onClick={() => setF({ ...f, species: isAll ? '' : f.species === s ? '' : s })}
                      >
                        {s}
                      </Chip>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* AREA 2: Center Interactive Map */}
        <section className="relative flex-1 min-w-0 h-full overflow-hidden bg-map-sand">
          {desktop && view === 'list' ? (
            <div className="size-full overflow-y-auto bg-cream p-6">
              {list.length ? (
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                  {list.map((c) => (
                    <CaseCard key={c.id} c={c} />
                  ))}
                </div>
              ) : (
                <Empty title="Chưa có case nào trong khu vực này 🐾" cta="Xóa bộ lọc" onCta={clearAll} />
              )}
            </div>
          ) : (
            mapEl
          )}

          {/* floating map chrome */}
          {desktop && (
            <div className="absolute right-4 top-4 z-10 rounded-full bg-paper shadow-soft">
              <Segmented
                value={view}
                onChange={setView}
                options={[
                  {
                    v: 'map',
                    label: (
                      <span className="flex items-center gap-1.5 px-1">
                        <MapIcon className="size-4" />
                        Bản đồ
                      </span>
                    ),
                  },
                  {
                    v: 'list',
                    label: (
                      <span className="flex items-center gap-1.5 px-1">
                        <List className="size-4" />
                        Danh sách
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          )}
          {desktop && view === 'map' && (
            <div className="absolute left-4 top-4 z-10">
              <MapLegend
                defaultOpen={variant === 'map'}
                hidden={hiddenKinds}
                onToggle={(t) => setHiddenKinds((h) => toggle(h, t))}
              />
            </div>
          )}

          {!desktop && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 space-y-2 p-3">
                <div className="pointer-events-auto">{search}</div>
                {variant === 'home' && (
                  <div className="pointer-events-auto no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
                    {QUICK.map((a) => (
                      <Btn
                        key={a.label}
                        onClick={() => go(a.to)}
                        variant="ghost"
                        className={cx(
                          'flex h-10 shrink-0 items-center gap-1.5 rounded-full border-2 border-brown px-3.5 text-[13px] font-extrabold shadow-soft',
                          a.tone,
                        )}
                      >
                        <a.icon className="size-4" />
                        {a.label}
                      </Btn>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={cx(
                  'absolute right-3 z-10 flex flex-col gap-2',
                  variant === 'home' ? 'top-[184px]' : 'top-[76px]',
                )}
              >
                {filterBtn}
                <IconBtn
                  variant="ghost"
                  onClick={() => api.current?.locate()}
                  aria-label="Vị trí hiện tại"
                  className="size-12 rounded-full border-2 border-brown bg-paper shadow-soft"
                >
                  <LocateFixed className="size-5" />
                </IconBtn>
                <IconBtn
                  variant="ghost"
                  onClick={() => api.current?.zoom(1.3)}
                  aria-label="Phóng to"
                  className="size-12 rounded-full border-2 border-brown bg-paper shadow-soft"
                >
                  <Plus className="size-5" />
                </IconBtn>
                <IconBtn
                  variant="ghost"
                  onClick={() => api.current?.zoom(0.77)}
                  aria-label="Thu nhỏ"
                  className="size-12 rounded-full border-2 border-brown bg-paper shadow-soft"
                >
                  <Minus className="size-5" />
                </IconBtn>
              </div>
              {snap === 0 && (
                <div className="absolute bottom-[116px] left-3 z-10">
                  <MapLegend
                    defaultOpen={false}
                    hidden={hiddenKinds}
                    onToggle={(t) => setHiddenKinds((h) => toggle(h, t))}
                  />
                </div>
              )}
              <BottomSheet
                snap={snap}
                onSnap={setSnap}
                peek={sel ? 128 : 88}
                header={
                  sel && selCase ? (
                    <div className="flex items-center gap-2.5 px-4 pb-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-display text-[15px] font-extrabold">
                            {selCase.name.toUpperCase()}
                          </span>
                          <StatusBadge status={selCase.status} critical={selCase.critical} type={selCase.type} />
                        </div>
                        <p className="truncate text-xs font-bold text-brown-soft">
                          {approxLoc(selCase)} · cách bạn {kmFrom(selCase.x, selCase.y)} km
                        </p>
                      </div>
                      <Btn
                        size="sm"
                        variant={selCase.critical || selCase.type === 'rescue' ? 'danger' : 'primary'}
                        pill
                        className="h-10 shrink-0 px-3 text-xs font-extrabold shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
                        onClick={(e) => {
                          e.stopPropagation()
                          go(`/case/${sel.id}?help=1`)
                        }}
                      >
                        {selCase.critical || selCase.type === 'rescue' ? 'CỨU NGAY' : 'Giúp bé'}
                      </Btn>
                      <IconBtn
                        label="Bỏ chọn ghim"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSel(null)
                          setSnap(0)
                        }}
                        className="!size-8 !rounded-full hover:!bg-brown/10"
                      >
                        <X className="size-4" />
                      </IconBtn>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 pb-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-[15px] font-extrabold leading-tight">
                          {list.filter((c) => c.status !== 'resolved').length} case đang hoạt động
                        </p>
                        <p className="truncate text-xs font-bold text-brown-soft">
                          {examples.map((c) => c.district).join(' · ') || 'Kéo lên để xem danh sách'}
                        </p>
                      </div>
                      <Btn
                        size="sm"
                        variant="danger"
                        pill
                        className="h-11 shrink-0 px-3.5"
                        icon={<Plus className="size-4" strokeWidth={3} />}
                        onClick={(e) => {
                          e.stopPropagation()
                          go('/report')
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        Báo case
                      </Btn>
                    </div>
                  )
                }
              >
                <div className="space-y-3 px-4 pb-6">
                  {sel && (
                    <MapPreview
                      sel={sel}
                      onClose={() => {
                        setSel(null)
                        setSnap(0)
                      }}
                    />
                  )}
                  {sel && (
                    <p className="flex items-center gap-1 pt-1 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
                      Các case lân cận khác <ChevronRight className="size-3" />
                    </p>
                  )}
                  {resultList}
                </div>
              </BottomSheet>
            </>
          )}
        </section>

        {/* AREA 3: Desktop Right Contextual Case Panel */}
        {desktop && view === 'map' && (
          <aside className="w-[370px] xl:w-[410px] shrink-0 min-h-0 flex flex-col border-l-2 border-brown/15 bg-paper z-20 shadow-soft animate-[rise_.2s_both]">
            {sel ? (
              <div className="flex h-full flex-col min-h-0">
                <div className="flex items-center justify-between border-b-2 border-line bg-cream/40 px-4 py-3">
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => setSel(null)}
                    icon={<ArrowLeft className="size-4" />}
                    className="!h-auto !px-2.5 !py-1.5 text-xs font-extrabold text-brown"
                  >
                    Quay lại danh sách
                  </Btn>
                  <IconBtn
                    label="Đóng chi tiết ca"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSel(null)}
                    className="!size-8 !rounded-full hover:!bg-brown/10"
                  >
                    <X className="size-4" />
                  </IconBtn>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <MapPreview sel={sel} onClose={() => setSel(null)} />
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col min-h-0">
                <div className="flex items-center justify-between border-b-2 border-line bg-cream/30 px-4 py-3">
                  <div>
                    <h3 className="font-display text-base font-extrabold text-brown">
                      Danh sách lân cận
                    </h3>
                    <p className="text-xs font-bold text-brown-soft">
                      {list.length} ca trong bán kính {f.radius} km
                    </p>
                  </div>
                  {n > 0 && <Badge tone="butter">Đang lọc · {n}</Badge>}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-3.5 space-y-3">
                  {resultList}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Bộ lọc${countFilters(draft) ? ` · ${countFilters(draft)}` : ''}`} wide>
        <div className="space-y-5">
          <FilterSection title="Loại">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <Chip
                  key={t}
                  active={draft.types.includes(t)}
                  icon={<LegendSwatch type={t} />}
                  onClick={() => setDraft({ ...draft, types: toggle(draft.types, t) })}
                >
                  {PIN_META[t].label}
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Loài">
            <div className="flex flex-wrap gap-2">
              {['Chó', 'Mèo', 'Khác'].map((s) => (
                <Chip
                  key={s}
                  active={draft.species === s}
                  onClick={() => setDraft({ ...draft, species: draft.species === s ? '' : s })}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Khu vực">
            <div className="grid gap-3 sm:grid-cols-3">
              <Select
                aria-label="Quận / huyện"
                value={draft.district}
                onChange={(e) => setDraft({ ...draft, district: e.target.value })}
              >
                <option value="">Quận / huyện</option>
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
              <Input
                aria-label="Phường"
                value={draft.ward}
                onChange={(e) => setDraft({ ...draft, ward: e.target.value })}
                placeholder="Phường"
              />
              <Input
                aria-label="Đường"
                value={draft.street}
                onChange={(e) => setDraft({ ...draft, street: e.target.value })}
                placeholder="Đường / phố"
              />
            </div>
          </FilterSection>
          <FilterSection title="Bán kính">
            <div className="flex flex-wrap gap-2">
              {[1, 3, 5, 10].map((r) => (
                <Chip
                  key={r}
                  active={draft.radius === r}
                  onClick={() => setDraft({ ...draft, radius: r })}
                >
                  {r} km
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Thời điểm">
            <div className="flex flex-wrap gap-2">
              {TIME_OPTS.map(([v, l]) => (
                <Chip
                  key={v}
                  active={draft.time === v}
                  onClick={() => setDraft({ ...draft, time: v })}
                >
                  {l}
                </Chip>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Trạng thái">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(([v, l]) => (
                <Chip
                  key={v}
                  active={draft.status.includes(v)}
                  onClick={() => setDraft({ ...draft, status: toggle(draft.status, v) })}
                >
                  {v === 'active' ? '🔴' : v === 'progress' ? '🟡' : '🟢'} {l}
                </Chip>
              ))}
            </div>
            {draft.status.includes('resolved') && (
              <p className="mt-1.5 text-xs font-semibold text-brown-soft">
                Case đã giải quyết chỉ hiện trong danh sách (lịch sử), không hiện trên bản đồ trực tiếp.
              </p>
            )}
          </FilterSection>
          <details className="rounded-2xl border-2 border-line px-3 py-2">
            <summary className="cursor-pointer text-sm font-extrabold">Nâng cao: giống & màu lông</summary>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <Field label="Giống">
                <Input
                  value={draft.breed}
                  onChange={(e) => setDraft({ ...draft, breed: e.target.value })}
                  placeholder="VD: Golden, Poodle…"
                />
              </Field>
              <Field label="Màu lông">
                <Select
                  value={draft.color}
                  onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  {['Vàng', 'Trắng', 'Xám', 'Đen', 'Nâu', 'Kem'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </details>
          <div className="sticky -bottom-6 -mx-6 -mb-6 flex gap-2 border-t-2 border-line bg-paper px-6 py-4">
            <Btn variant="soft" className="flex-1" onClick={() => setDraft(F0)}>
              Xóa bộ lọc
            </Btn>
            <Btn className="flex-[1.4]" onClick={() => { setF(draft); setOpen(false) }}>
              Áp dụng · {draftCount} kết quả
            </Btn>
          </div>
        </div>
      </Modal>
    </UserShell>
  )
}
void kmFrom
