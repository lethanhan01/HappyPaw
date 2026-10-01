import { useEffect, useState } from 'react'
import { Sparkles, Search, Siren, PawPrint, ScanSearch, Check, X, ArrowLeft, Loader2 } from 'lucide-react'
import UserShell from '@/layouts/UserShell'
import { useApp } from '@/store'
import { CaseCard } from '@/components/common'
import {
  Btn,
  Card,
  Chip,
  Empty,
  ErrorState,
  Skeleton,
  UploadBox,
  Note,
  PageHead,
  MatchBadge,
  Badge,
  SuccessScreen,
  Modal,
} from '@/components/ui'
import { kmFrom } from '@/features/map'
import { REASONS_MATCH } from './Reasons'

export function FindHub() {
  const { cases, go } = useApp()
  const [tab, setTab] = useState<'all' | 'lost' | 'found' | 'rescue'>('all')
  const list = cases
    .filter((c) => c.status !== 'resolved' && (tab === 'all' || c.type === tab))
    .sort((a, b) => kmFrom(a.x, a.y) - kmFrom(b.x, b.y))

  return (
    <UserShell>
      <PageHead title="Tìm & Cứu Pet" sub="Tìm thú cưng thất lạc, báo thấy hoặc nhận ca cứu hộ gần bạn." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card
          hover
          onClick={() => go('/ai-match')}
          className="group relative overflow-hidden rounded-[28px] border-2 border-brown !bg-plum-soft p-5 text-left shadow-soft transition hover:-translate-y-1 md:col-span-2 cursor-pointer"
        >
          <Sparkles className="absolute -right-3 -top-3 size-28 text-plum/20" />
          <Badge tone="plum" icon={<Sparkles className="size-3.5" />}>
            AI Matching
          </Badge>
          <h2 className="mt-2 font-display text-2xl font-extrabold">Tải ảnh lên, để Happy Paw tìm bé giúp bạn</h2>
          <p className="mt-1 max-w-lg text-sm font-semibold text-brown-soft">
            So sánh ảnh với hàng trăm báo cáo trong khu vực dựa trên màu lông, kích thước, vòng cổ và vị trí.
          </p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-brown bg-butter px-4 py-1.5 font-extrabold">
            <ScanSearch className="size-4" />
            Thử AI Matching
          </span>
        </Card>
        <div className="grid gap-3">
          <Btn size="lg" full onClick={() => go('/report/lost')} icon={<Search className="size-5" />}>
            Tìm pet của tôi
          </Btn>
          <Btn size="lg" full variant="secondary" onClick={() => go('/report/found')} icon={<PawPrint className="size-5" />}>
            Báo thấy pet
          </Btn>
          <Btn size="lg" full variant="danger" onClick={() => go('/report/rescue')} icon={<Siren className="size-5" />}>
            Cần cứu hộ
          </Btn>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ['all', 'Tất cả'],
            ['lost', 'Thú cưng lạc'],
            ['found', 'Được báo thấy'],
            ['rescue', 'Cần cứu hộ'],
          ] as const
        ).map(([v, l]) => (
          <Chip key={v} active={tab === v} onClick={() => setTab(v)}>
            {l}
          </Chip>
        ))}
      </div>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <Empty
          title="Chưa có case nào"
          body="Hãy là người đầu tiên báo một case."
          cta="Báo một case"
          onCta={() => go('/report')}
        />
      )}
    </UserShell>
  )
}

const LINES = [
  'Đang phân tích hình ảnh…',
  'Nhận diện màu lông và kích thước…',
  'So sánh với báo cáo quanh khu vực…',
  'Tổng hợp kết quả khớp…',
]

export function AiMatch() {
  const { go, cases, toast, updateCase } = useApp()
  const [files, setFiles] = useState<string[]>([])
  const [phase, setPhase] = useState<'upload' | 'run' | 'result'>('upload')
  const [pct, setPct] = useState(0)
  const [hidden, setHidden] = useState<string[]>([])
  const [mine, setMine] = useState<string | null>(null)
  const [why, setWhy] = useState<string | null>(null)

  useEffect(() => {
    if (phase !== 'run') return
    const t = setInterval(
      () =>
        setPct((p) => {
          if (p >= 100) {
            clearInterval(t)
            setPhase('result')
            return 100
          }
          return p + 4
        }),
      110,
    )
    return () => clearInterval(t)
  }, [phase])

  const results = [
    ['HP-1042', 87],
    ['HP-1045', 81],
    ['HP-1047', 74],
  ]
    .map(([id, m]) => ({ c: cases.find((x) => x.id === id)!, m: m as number }))
    .filter((r) => r.c && !hidden.includes(r.c.id))

  if (mine) {
    const c = cases.find((x) => x.id === mine)!
    return (
      <UserShell>
        <SuccessScreen title="Tuyệt vời! Hãy liên hệ để xác nhận" species={c.species}>
          <p className="font-semibold text-brown-soft">
            Chúng mình đã gửi yêu cầu xác nhận tới người đăng case {c.id}. Hãy chuẩn bị ảnh và đặc điểm để đối chiếu.
          </p>
          <Btn
            size="lg"
            onClick={() => {
              updateCase(c.id, { match: undefined })
              go(`/case/${c.id}`)
            }}
          >
            Xem case {c.id}
          </Btn>
        </SuccessScreen>
      </UserShell>
    )
  }

  return (
    <UserShell>
      <div className="mx-auto max-w-4xl">
        <Btn
          variant="ghost"
          size="sm"
          onClick={() => (phase === 'upload' ? go('/find') : (setPhase('upload'), setPct(0)))}
          icon={<ArrowLeft className="size-4" />}
          className="!p-0 !h-auto !border-0 mb-2 inline-flex items-center gap-1 text-sm font-extrabold text-brown-soft"
        >
          Quay lại
        </Btn>
        <h1 className="bubble mb-1 font-display text-4xl font-extrabold">So khớp bằng AI</h1>
        <p className="mb-5 font-semibold text-brown-soft">
          Kết quả chỉ mang tính gợi ý. Hãy luôn xác nhận trực tiếp với người đăng.
        </p>

        {phase === 'upload' && (
          <Card className="space-y-5 p-6">
            <UploadBox label="Tải ảnh thú cưng bạn đang tìm hoặc vừa thấy" max={3} files={files} onChange={setFiles} />
            <Btn
              size="lg"
              full
              pill
              disabled={!files.length}
              onClick={() => {
                setPhase('run')
                setPct(0)
              }}
              icon={<Sparkles className="size-5" />}
            >
              Bắt đầu phân tích
            </Btn>
            {!files.length && (
              <Btn
                variant="ghost"
                size="sm"
                full
                className="!p-0 !h-auto !border-0 w-full text-center text-sm font-extrabold underline underline-offset-4"
                onClick={() => {
                  setFiles([
                    'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=500&h=500&fit=crop&auto=format&q=75',
                  ])
                }}
              >
                Dùng ảnh mẫu (Golden Retriever)
              </Btn>
            )}
          </Card>
        )}
        {phase === 'run' && (
          <Card className="mx-auto max-w-lg space-y-5 p-8 text-center">
            <div className="relative mx-auto size-48 overflow-hidden rounded-3xl border-2 border-brown">
              <img src={files[0]} alt="Ảnh đang phân tích" className="size-full object-cover" />
              <div className="absolute inset-x-0 h-1.5 animate-[scan_1.6s_linear_infinite] bg-butter shadow-[0_0_14px_6px_rgba(255,242,122,.9)]" />
            </div>
            <div>
              <p className="font-display text-xl font-extrabold" aria-live="polite">
                {LINES[Math.min(3, Math.floor(pct / 26))]}
              </p>
              <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-brown bg-cream-2">
                <div className="h-full bg-butter-2 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-sm font-bold text-brown-soft">{Math.min(100, pct)}%</p>
            </div>
          </Card>
        )}
        {phase === 'result' && (
          <div className="space-y-4">
            <Note tone="sage" icon={<Check className="size-5 shrink-0" />}>
              Tìm thấy {results.length} kết quả có khả năng khớp.
            </Note>
            {results.length === 0 && (
              <Empty
                title="Không còn kết quả nào"
                body="Thử tải ảnh khác hoặc đăng tin tìm bé."
                cta="Đăng tin tìm bé"
                onCta={() => go('/report/lost')}
              />
            )}
            {results.map(({ c, m }) => (
              <Card key={c.id} className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="aspect-square w-full rounded-2xl border-2 border-brown object-cover sm:size-40"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-2xl font-extrabold">{c.name.toUpperCase()}</h3>
                      <MatchBadge v={m} />
                    </div>
                    <p className="text-sm font-bold">
                      {c.breed} · {c.color} · {c.district} · {kmFrom(c.x, c.y)} km
                    </p>
                    <div className="h-2.5 overflow-hidden rounded-full bg-cream-2">
                      <div className="h-full rounded-full bg-plum" style={{ width: `${m}%` }} />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Btn size="sm" onClick={() => setMine(c.id)}>
                        Đây là bé của tôi
                      </Btn>
                      <Btn
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setHidden([...hidden, c.id])
                          toast('Đã loại kết quả này')
                        }}
                      >
                        Không phải bé này
                      </Btn>
                      <Btn size="sm" variant="ghost" onClick={() => setWhy(c.id)}>
                        Vì sao khớp?
                      </Btn>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Modal open={!!why} onClose={() => setWhy(null)} title="Vì sao Happy Paw gợi ý bé này?">
        <ul className="space-y-2">
          {REASONS_MATCH.map((r) => (
            <li key={r} className="flex items-center gap-2 rounded-2xl bg-sage-soft p-3 text-sm font-bold">
              <Check className="size-4 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-semibold text-brown-soft">
          Điểm số chỉ là gợi ý; hãy xác nhận trực tiếp với người đăng.
        </p>
      </Modal>
      <span className="hidden">
        <Loader2 />
        <X />
      </span>
    </UserShell>
  )
}

export function StatesDemo() {
  const [s, setS] = useState<'loading' | 'empty' | 'error'>('empty')
  return (
    <UserShell>
      <PageHead title="Các trạng thái giao diện" sub="Empty · Error · Loading dùng xuyên suốt prototype." />
      <div className="mb-4 flex gap-2">
        {(['empty', 'error', 'loading'] as const).map((v) => (
          <Chip key={v} active={s === v} onClick={() => setS(v)}>
            {v}
          </Chip>
        ))}
      </div>
      {s === 'empty' && (
        <Empty title="Chưa có case nào quanh đây" body="Hãy mở rộng bán kính tìm kiếm." cta="Mở rộng bán kính" />
      )}
      {s === 'error' && <ErrorState onRetry={() => setS('loading')} />}
      {s === 'loading' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
        </div>
      )}
    </UserShell>
  )
}
