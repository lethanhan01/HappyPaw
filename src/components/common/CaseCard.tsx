import {
  Bookmark,
  Clock,
  MapPin,
  HandHeart,
  ChevronRight,
  Siren,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react"
import { timeAgo } from "@/constants/time"
import type { Case } from "@/types/case"
import { useApp } from "@/store"
import {
  Btn,
  IconBtn,
  MatchBadge,
  StatusBadge,
  UserAvatar,
  PetPhoto,
  Skeleton,
  cx,
  Badge,
} from "@/components/ui"

export function SaveBtn({ id, className }: { id: string className?: string }) {
  const { saved, toggleSave, toast } = useApp()
  const on = saved.includes(id)
  return (
    <IconBtn
      label={on ? "Bỏ lưu" : "Lưu case"}
      aria-pressed={on}
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        toggleSave(id)
        toast(on ? "Đã bỏ lưu ca" : "Đã lưu ca thành công")
      }}
      className={cx(
        "!rounded-full !border-brown !bg-paper hover:!bg-butter shadow-sm",
        on && "!bg-butter",
        className,
      )}
    >
      <Bookmark
        key={String(on)}
        className={cx("size-4", on && "fill-brown animate-[heart_.4s_ease]")}
      />
    </IconBtn>
  )
}

const TYPE_LABEL = (c: Case) =>
  c.critical || c.type === "rescue"
    ? "Cần cứu hộ"
    : c.type === "found"
      ? "Được báo thấy"
      : "Thú cưng lạc"

export function CaseCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-[24px] border-2 border-line bg-paper p-1 shadow-soft",
        compact ? "flex items-center gap-3" : "flex flex-col h-full",
      )}
      aria-busy
    >
      <Skeleton
        className={cx(
          "rounded-2xl",
          compact ? "size-28 shrink-0" : "aspect-[16/9] w-full sm:h-44",
        )}
      />
      <div
        className={cx(
          "min-w-0 flex-1",
          compact ? "space-y-2.5 p-3" : "flex flex-col p-4",
        )}
      >
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-1.5 h-4 w-1/2" />
        {!compact && <Skeleton className="mt-2 h-10 w-full" />}
        {!compact && <Skeleton className="mt-2.5 h-[26px] w-24 rounded-full" />}
        {!compact && (
          <div className="mt-auto pt-3">
            <Skeleton className="h-9 w-full rounded-2xl" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * SCAN → UNDERSTAND → ACT:
 * 1. Pet image
 * 2. Pet name
 * 3. Status
 * 4. Location
 * 5. Time
 * 6. Short description
 * 7. AI match nếu có
 * 8. CTA
 */
export function CaseCard({
  c,
  compact,
  selected,
  disabled,
  showCtaInCompact,
  onSelect,
}: {
  c: Case
  compact?: boolean
  selected?: boolean
  disabled?: boolean
  showCtaInCompact?: boolean
  onSelect?: () => void
}) {
  const { go, saved, me } = useApp()
  const isRescueEmergency =
    c.status === "active" && (c.critical || c.type === "rescue")
  const isResolved = c.status === "resolved"
  const isInProgress = c.status === "progress" || c.status === "pending"
  const isMine = c.assignee === me
  const isProtected = c.critical && c.status === "active"
  const open = () => (onSelect ? onSelect() : go(`/case/${c.id}`))
  const alt = `${c.species} ${c.color} tên ${c.name}`

  const cta = disabled ? null : isResolved ? (
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
  ) : isMine && c.status === "progress" ? (
    <Btn
      size="sm"
      full
      variant="primary"
      onClick={(e) => {
        e.stopPropagation()
        go(`/case/${c.id}/rescue`)
      }}
    >
      Tiếp tục ca cứu hộ
      <ChevronRight className="size-4" />
    </Btn>
  ) : isInProgress ? (
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
  ) : isRescueEmergency ? (
    <Btn
      size="sm"
      full
      variant="danger"
      icon={<Siren className="size-4" />}
      onClick={(e) => {
        e.stopPropagation()
        go(`/case/${c.id}?help=1`)
      }}
      className="font-extrabold shadow-[0_4px_0_var(--color-brown)] active:translate-y-1 active:shadow-none"
    >
      CẦN CỨU HỘ NGAY
    </Btn>
  ) : (
    <Btn
      size="sm"
      full
      variant="primary"
      icon={<HandHeart className="size-4" />}
      onClick={(e) => {
        e.stopPropagation()
        go(`/case/${c.id}`)
      }}
    >
      {c.type === "lost" ? "Tôi đã thấy bé" : "Tôi muốn cứu bé"}
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
        if (!disabled && e.key === "Enter") open()
      }}
      className={cx(
        "group relative overflow-hidden rounded-[24px] border-2 bg-paper shadow-soft transition-all duration-200",
        compact ? "flex items-center gap-3 p-2.5" : "flex flex-col h-full",
        disabled
          ? "cursor-not-allowed opacity-55 grayscale"
          : "cursor-pointer hover:-translate-y-1 hover:border-brown hover:shadow-[0_8px_20px_-8px_rgba(107,65,40,0.35)]",
        selected
          ? "border-brown ring-4 ring-butter bg-butter/10"
          : isRescueEmergency
            ? "border-coral/70"
            : "border-line",
        isResolved && "bg-cream/40 opacity-90",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-butter",
      )}
    >
      {/* Urgent ribbon */}
      {isRescueEmergency && !selected && (
        <span
          className="absolute inset-y-0 left-0 z-10 w-2 bg-coral"
          aria-hidden
        />
      )}

      {/* 1. Pet image */}
      <div
        className={cx(
          "relative shrink-0 overflow-hidden rounded-2xl",
          compact ? "size-28 sm:size-32" : "aspect-[16/9] w-full sm:h-44",
        )}
      >
        <PetPhoto
          src={c.photo}
          species={c.species}
          alt={alt}
          className={cx(
            "size-full object-cover transition-transform duration-300 group-hover:scale-105",
            isResolved && "opacity-85",
          )}
        />
        {!compact && (
          <div className="absolute left-2.5 top-2.5">
            <StatusBadge
              status={c.status}
              critical={c.critical}
              type={c.type}
            />
          </div>
        )}
        {!compact && (
          <SaveBtn id={c.id} className="absolute right-2.5 top-2.5 z-10" />
        )}
        {!compact && isInProgress && c.assignee && (
          <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full border-2 border-brown bg-paper py-0.5 pl-0.5 pr-2.5 text-xs font-extrabold shadow-sm">
            <UserAvatar id={c.assignee} size={22} />
            Đang phụ trách
          </span>
        )}
      </div>

      {/* Body content */}
      <div
        className={cx(
          "min-w-0 flex-1",
          compact ? "py-1 pr-1 space-y-1.5" : "flex flex-col p-4",
        )}
      >
        {/* 2. Pet name & type */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex min-w-0 items-baseline gap-1.5 font-display text-lg font-extrabold leading-tight">
            <span className="truncate">{c.name.toUpperCase()}</span>
            <span className="shrink-0 font-sans text-xs font-bold text-brown-soft">
              · {TYPE_LABEL(c)}
            </span>
          </h3>
          {compact && saved.includes(c.id) && (
            <Bookmark
              className="size-4 shrink-0 fill-brown"
              aria-label="Đã lưu"
            />
          )}
        </div>

        {/* 3. Status badge (shown here in compact mode) */}
        {compact && (
          <div className="flex flex-wrap items-center gap-1">
            <StatusBadge
              status={c.status}
              critical={c.critical}
              type={c.type}
            />
          </div>
        )}

        {/* 4 & 5. Location & Time */}
        <div
          className={cx(
            "flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-bold",
            !compact && "mt-1",
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-1 text-brown">
            {isProtected ? (
              <ShieldAlert className="size-3.5 shrink-0 text-coral" />
            ) : (
              <MapPin className="size-3.5 shrink-0 text-brown" />
            )}
            <span className="truncate">
              {isProtected
                ? `Khu vực ${c.district} (Bảo mật)`
                : `${c.street ? `${c.street}, ` : ""}${c.district}`}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-brown-soft">
            <Clock className="size-3.5 shrink-0" />
            {timeAgo(c.minutesAgo)}
          </span>
        </div>

        {/* 6. Short description */}
        {!compact && (
          <p className="mt-2 line-clamp-2 h-10 text-sm font-semibold leading-5 text-brown-soft">
            {c.desc}
          </p>
        )}

        {/* 7. AI Match & Reward */}
        {!compact ? (
          <div className="mt-2.5 flex min-h-[26px] flex-wrap items-center gap-1.5">
            {c.match && !isResolved && <MatchBadge v={c.match} />}
            {c.reward && !isResolved && <Badge tone="pink">Có hậu tạ</Badge>}
          </div>
        ) : (
          c.match &&
          !isResolved && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <MatchBadge v={c.match} />
            </div>
          )
        )}

        {/* 8. CTA */}
        {(!compact || showCtaInCompact) && cta && (
          <div className={cx("w-full", !compact ? "mt-auto pt-3" : "pt-2")}>
            {cta}
          </div>
        )}
      </div>
    </article>
  )
}
