import { Bookmark, Clock, MapPin, HandHeart, ChevronRight, Siren, CheckCircle2 } from 'lucide-react'
import { timeAgo } from '@/constants/time'
import type { Case } from '@/types/case'
import { useApp } from '@/store'
import { Btn, MatchBadge, StatusBadge, UserAvatar, PetPhoto, Skeleton, cx, Badge } from '@/components/ui'

export function SaveBtn({ id, className }: { id: string; className?: string }) {
  const { saved, toggleSave, toast } = useApp()
  const on = saved.includes(id)
  return (
    <button
      aria-label={on ? 'Bỏ lưu' : 'Lưu case'}
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation()
        toggleSave(id)
        toast(on ? 'Đã bỏ lưu case' : 'Đã lưu case 🐾')
      }}
      className={cx(
        'grid size-9 place-items-center rounded-full border-2 border-brown bg-paper transition hover:bg-butter',
        on && 'bg-butter',
        className,
      )}
    >
      <Bookmark key={String(on)} className={cx('size-4', on && 'fill-brown animate-[heart_.4s_ease]')} />
    </button>
  )
}

const TYPE_LABEL = (c: Case) =>
  c.critical || c.type === 'rescue' ? 'Cần cứu hộ' : c.type === 'found' ? 'Được báo thấy' : 'Thú cưng lạc'

export function CaseCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cx('overflow-hidden rounded-[22px] border-2 border-line bg-paper', compact && 'flex')}
      aria-busy
    >
      <Skeleton className={cx('rounded-none', compact ? 'h-28 w-28 shrink-0' : 'h-40 w-full')} />
      <div className="flex-1 space-y-2 p-3.5">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

/** SCAN → UNDERSTAND → ACT: photo, name, status, place/time, blurb, AI match, CTA. */
export function CaseCard({
  c,
  compact,
  selected,
  disabled,
  onSelect,
}: {
  c: Case
  compact?: boolean
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
}) {
  const { go, saved } = useApp()
  const urgent = c.status === 'active' && (c.critical || c.type === 'rescue')
  const resolved = c.status === 'resolved'
  const taken = c.status === 'progress' || c.status === 'pending'
  const open = () => (onSelect ? onSelect() : go(`/case/${c.id}`))
  const alt = `${c.species} ${c.color} tên ${c.name}`

  const cta = disabled ? null : resolved ? (
    <Btn
      size="sm"
      full
      variant="soft"
      icon={<CheckCircle2 className="size-4" />}
      onClick={(e) => {
        e.stopPropagation()
        go(`/case/${c.id}`)
      }}
    >
      Xem kết quả
    </Btn>
  ) : taken ? (
    <Btn
      size="sm"
      full
      variant="soft"
      onClick={(e) => {
        e.stopPropagation()
        go(`/case/${c.id}`)
      }}
    >
      Theo dõi case
      <ChevronRight className="size-4" />
    </Btn>
  ) : urgent ? (
    <Btn
      size="sm"
      full
      variant="danger"
      icon={<Siren className="size-4" />}
      onClick={(e) => {
        e.stopPropagation()
        go(`/case/${c.id}?help=1`)
      }}
    >
      CẦN CỨU HỘ NGAY
    </Btn>
  ) : (
    <Btn
      size="sm"
      full
      icon={<HandHeart className="size-4" />}
      onClick={(e) => {
        e.stopPropagation()
        go(`/case/${c.id}`)
      }}
    >
      {c.type === 'lost' ? 'Tôi đã thấy bé' : 'Tôi muốn giúp'}
    </Btn>
  )

  return (
    <article
      role="link"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-current={selected || undefined}
      onClick={disabled ? undefined : open}
      onKeyDown={(e) => {
        if (!disabled && e.key === 'Enter') open()
      }}
      className={cx(
        'group relative overflow-hidden rounded-[22px] border-2 bg-paper shadow-soft transition',
        compact ? 'flex' : 'flex flex-col',
        disabled ? 'cursor-not-allowed opacity-55 grayscale' : 'cursor-pointer hover:-translate-y-0.5 hover:border-brown',
        selected ? 'border-brown ring-4 ring-butter' : urgent ? 'border-coral/60' : 'border-line',
        resolved && 'bg-cream/60',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-butter',
      )}
    >
      {urgent && !selected && <span className="absolute inset-y-0 left-0 z-10 w-1.5 bg-coral" aria-hidden />}
      <div
        className={cx(
          'relative shrink-0',
          compact ? 'w-28 self-stretch sm:w-32' : 'aspect-[16/9] w-full sm:aspect-auto sm:h-40',
        )}
      >
        <PetPhoto src={c.photo} species={c.species} alt={alt} className={cx('size-full', resolved && 'opacity-80')} />
        {!compact && (
          <div className="absolute left-2.5 top-2.5">
            <StatusBadge status={c.status} critical={c.critical} type={c.type} />
          </div>
        )}
        {!compact && <SaveBtn id={c.id} className="absolute right-2.5 top-2.5" />}
        {!compact && taken && c.assignee && (
          <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full border-2 border-brown bg-paper py-0.5 pl-0.5 pr-2.5 text-xs font-extrabold">
            <UserAvatar id={c.assignee} size={22} />
            Đang phụ trách
          </span>
        )}
      </div>
      <div className={cx('min-w-0 flex-1 space-y-1.5', compact ? 'p-3' : 'p-3.5')}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex min-w-0 items-baseline gap-1.5 font-display text-lg font-extrabold leading-tight">
            <span className="truncate">{c.name.toUpperCase()}</span>
            <span className="shrink-0 font-sans text-xs font-bold text-brown-soft">· {TYPE_LABEL(c)}</span>
          </h3>
          {compact && saved.includes(c.id) && (
            <Bookmark className="size-4 shrink-0 fill-brown" aria-label="Đã lưu" />
          )}
        </div>
        {compact && <StatusBadge status={c.status} critical={c.critical} type={c.type} />}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] font-bold">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{c.district}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-brown-soft">
            <Clock className="size-3.5" />
            {timeAgo(c.minutesAgo)}
          </span>
        </p>
        {!compact && <p className="line-clamp-2 text-sm text-brown-soft">{c.desc}</p>}
        {(c.match || (c.reward && !compact)) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {c.match && !resolved && <MatchBadge v={c.match} />}
            {c.reward && !compact && !resolved && <Badge tone="pink">Có hậu tạ</Badge>}
          </div>
        )}
        {!compact && cta && <div className="pt-1">{cta}</div>}
      </div>
    </article>
  )
}
