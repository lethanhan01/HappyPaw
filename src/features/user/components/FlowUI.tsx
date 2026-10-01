import type { ReactNode } from 'react'
import { Check, TriangleAlert, Star } from 'lucide-react'
import { CLINICS, SHELTERS } from '@/constants/mock/places'
import type { Place } from '@/types/place'
import { Badge, Btn, Verified, cx } from '@/components/ui'

/* ---------- Flow state kept inside store.proof (extra keys, cast) ---------- */
export interface FlowState {
  progress?: number
  handoff?: string
  shelterConfirmed?: boolean
  mismatch?: boolean
}
export const flowOf = (proof: Record<string, unknown>, id: string): FlowState =>
  (proof[id] as FlowState | undefined) ?? {}
export const flowPatch = (p: FlowState) => p as never

export type PlaceKind = 'shelter' | 'clinic'
export const kindLabel = (k: PlaceKind) => (k === 'shelter' ? 'Mái ấm' : 'Phòng khám')
export function findPlace(id?: string): { place: Place; kind: PlaceKind } | null {
  if (!id) return null
  const s = SHELTERS.find((x) => x.id === id)
  if (s) return { place: s, kind: 'shelter' }
  const c = CLINICS.find((x) => x.id === id)
  return c ? { place: c, kind: 'clinic' } : null
}
export const placesOf = (k: PlaceKind): Place[] =>
  [...(k === 'shelter' ? SHELTERS : CLINICS)].sort((a, b) => a.distance - b.distance).slice(0, 5)

/* ---------- 5-step compact stepper ---------- */
export const RESCUE_STEPS = ['Nhận case', 'Đang đến', 'Đã tiếp cận', 'Đã đưa đi', 'Xác minh']
/** checklist progress (0-4 done items) -> current step index (0-4) */
export const stepFromProgress = (p: number) => [1, 2, 3, 3, 4][Math.max(0, Math.min(4, p))]

export function ProgressStepper({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-5" aria-label="Tiến trình cứu hộ">
      {RESCUE_STEPS.map((s, i) => (
        <li
          key={s}
          className="relative flex flex-col items-center gap-1 text-center"
          aria-current={i === current ? 'step' : undefined}
        >
          {i < RESCUE_STEPS.length - 1 && (
            <span
              className={cx(
                'absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-[14px] h-1 rounded-full',
                i < current ? 'bg-sage' : 'bg-line',
              )}
            />
          )}
          <span
            className={cx(
              'relative z-10 grid size-8 place-items-center rounded-full border-2 font-display text-sm font-extrabold',
              i < current
                ? 'border-brown bg-sage'
                : i === current
                  ? 'border-brown bg-butter shadow-[0_0_0_3px_rgba(255,242,122,.55)]'
                  : 'border-brown/30 bg-paper text-brown/50',
            )}
          >
            {i < current ? <Check className="size-4" strokeWidth={3.5} /> : i + 1}
          </span>
          <span
            className={cx(
              'px-0.5 text-[11px] font-extrabold leading-tight sm:text-sm',
              i === current ? 'text-brown' : i < current ? 'text-brown-soft' : 'text-brown/50',
            )}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  )
}

/* ---------- Verification stepper (rescuer -> place -> admin) ---------- */
export function VerifyStepper({
  kind,
  shelter,
  admin,
}: {
  kind: PlaceKind
  shelter: 'done' | 'wait' | 'warn'
  admin: 'done' | 'wait'
}) {
  const nodes: { name: string; state: 'done' | 'wait' | 'warn'; text: string }[] = [
    { name: 'Người cứu hộ', state: 'done', text: '✓ Rescue submitted' },
    {
      name: kindLabel(kind),
      state: shelter,
      text: shelter === 'done' ? '✓ Shelter confirmation' : shelter === 'warn' ? '⚠ Cần kiểm tra' : '○ Shelter confirmation',
    },
    { name: 'Admin', state: admin, text: admin === 'done' ? '✓ Admin verification' : '○ Admin verification' },
  ]
  return (
    <ol className="grid grid-cols-3" aria-label="Tiến trình xác minh">
      {nodes.map((n, i) => (
        <li key={n.name} className="relative flex flex-col items-center gap-1 text-center">
          {i < nodes.length - 1 && (
            <span
              className={cx(
                'absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-[14px] h-1 rounded-full',
                n.state === 'done' && nodes[i + 1].state !== 'wait' ? 'bg-sage' : 'bg-line',
              )}
            />
          )}
          <span
            className={cx(
              'relative z-10 grid size-8 place-items-center rounded-full border-2 border-brown font-display text-sm font-extrabold',
              n.state === 'done' ? 'bg-sage' : n.state === 'warn' ? 'bg-coral-soft' : 'bg-paper text-brown/50',
            )}
          >
            {n.state === 'done' ? (
              <Check className="size-4" strokeWidth={3.5} />
            ) : n.state === 'warn' ? (
              <TriangleAlert className="size-4" />
            ) : (
              i + 1
            )}
          </span>
          <span className="text-xs font-extrabold leading-tight sm:text-sm">{n.name}</span>
          <span className={cx('text-[11px] font-bold leading-tight sm:text-xs', n.state === 'wait' ? 'text-brown/50' : 'text-brown-soft')}>
            {n.text}
          </span>
        </li>
      ))}
    </ol>
  )
}

/* ---------- Mismatch (calm) ---------- */
export function MismatchCard({ onView }: { onView: () => void }) {
  return (
    <div className="space-y-3 rounded-2xl border-2 border-butter-2 bg-butter/60 p-4" role="status">
      <p className="font-display text-lg font-extrabold">⚠️ Cần kiểm tra</p>
      <p className="text-sm font-semibold">Thông tin cứu hộ chưa khớp. Đội ngũ Happy Paw đang kiểm tra case này.</p>
      <Btn variant="secondary" onClick={onView}>
        Xem trạng thái
      </Btn>
    </div>
  )
}

/* ---------- Place summary row ---------- */
export function PlaceRow({
  place,
  selected,
  onClick,
  trailing,
}: {
  place: Place
  selected?: boolean
  onClick?: () => void
  trailing?: ReactNode
}) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <b className="font-display text-base font-extrabold leading-tight">{place.name}</b>
          {place.verified ? <Verified /> : <Badge tone="brown">Chưa xác minh</Badge>}
        </span>
        <span className="mt-0.5 block text-sm font-semibold text-brown-soft">{place.address}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 text-xs font-extrabold">
          <span>{place.distance} km</span>
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-butter-2 text-brown" />
            {place.rating} ({place.reviews})
          </span>
        </span>
      </span>
      {trailing}
      {selected !== undefined && (
        <span
          className={cx(
            'grid size-7 shrink-0 place-items-center rounded-full border-2 border-brown',
            selected ? 'bg-butter' : 'bg-white',
          )}
        >
          {selected && <Check className="size-4" strokeWidth={3.5} />}
        </span>
      )}
    </>
  )
  const cls = 'flex min-h-[72px] w-full items-center gap-3 rounded-2xl border-2 p-3 text-left'
  return onClick ? (
    <Btn
      type="button"
      variant="ghost"
      size="md"
      full
      onClick={onClick}
      aria-pressed={selected}
      className={cx(cls, selected ? 'border-brown !bg-butter/60' : 'border-line !bg-white')}
    >
      {body}
    </Btn>
  ) : (
    <div className={cx(cls, 'border-line bg-white')}>{body}</div>
  )
}
