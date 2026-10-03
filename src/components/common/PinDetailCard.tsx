import type { ReactNode } from "react"
import {
  BadgeCheck,
  Clock,
  Eye,
  HandHeart,
  Lock,
  MapPin,
  Navigation,
  Siren,
  Star,
  X,
} from "lucide-react"
import { cx } from "@/lib/cn"
import { useApp } from "@/store"
import { CLINICS, SHELTERS } from "@/constants/mock/places"
import { RISKS } from "@/constants/mock/risks"
import { timeAgo } from "@/constants/time"
import type { Sel } from "@/features/map"
import { kmFrom, approxLoc } from "@/features/map"
import {
  Badge,
  Btn,
  IconBtn,
  MatchBadge,
  PetPhoto,
  StatusBadge,
  Verified,
  WarnBadge,
} from "@/components/ui"

export interface PinDetailCardProps {
  sel: Sel | null
  onClose?: () => void
  display?: "popup" | "panel"
  compact?: boolean
  actions?: ReactNode
  verified?: boolean
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  onDirections?: (target: {
    x: number
    y: number
    name: string
    address?: string
    caseId?: string
  }) => void
}

export function PinDetailCard({
  sel,
  onClose,
  display = "popup",
  compact,
  actions,
  verified,
  className,
  data,
  onDirections,
}: PinDetailCardProps) {
  const { go, getCase } = useApp()

  if (!sel) {
    if (display === "panel") {
      return (
        <p className="py-6 text-center text-sm text-brown-soft font-semibold">
          Bấm vào một điểm trên bản đồ để xem và quản lý.
        </p>
      )
    }
    return null
  }

  const isPopup = display === "popup"
  const shell = isPopup
    ? "animate-[rise_.22s_both] overflow-hidden rounded-[24px] border-2 border-brown bg-paper shadow-soft"
    : "space-y-3"

  const CloseBtn = onClose ? (
    <IconBtn
      label="Đóng"
      variant="ghost"
      size="sm"
      onClick={onClose}
      className="!size-8 !rounded-full hover:!bg-brown/10"
    >
      <X className="size-4" />
    </IconBtn>
  ) : null

  // 1. CASE
  if (sel.kind === "case") {
    const c = data || getCase(sel.id)
    if (!c) return null
    const hide = c.critical && c.status === "active"
    const urgent = c.status === "active" && (c.critical || c.type === "rescue")
    const taken = c.status === "progress" || c.status === "pending"

    if (compact) {
      return (
        <div
          className={cx(
            "absolute left-2 top-2 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2.5 rounded-2xl border-2 border-brown bg-paper p-2 text-xs shadow-soft animate-[rise_.15s_both]",
            className,
          )}
        >
          <PetPhoto
            src={c.photo}
            species={c.species}
            alt={c.name}
            className="size-11 shrink-0 rounded-xl border border-brown object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-extrabold text-brown">
                {c.id} · {c.name}
              </p>
              <StatusBadge status={c.status} critical={c.critical} type={c.type} />
            </div>
            <p className="truncate text-brown-soft font-semibold">{c.district}</p>
          </div>
          {actions || (
            <Btn size="sm" variant="dark" onClick={() => go(`/case/${c.id}`)}>
              Chi tiết
            </Btn>
          )}
          {CloseBtn}
        </div>
      )
    }

    return (
      <div className={cx(shell, className)}>
        <div className={cx("flex gap-3", isPopup && "p-3.5")}>
          <PetPhoto
            src={c.photo}
            species={c.species}
            alt={`${c.species} ${c.color} tên ${c.name}`}
            className="size-24 shrink-0 rounded-2xl border-2 border-brown object-cover shadow-sm"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                {!isPopup && (
                  <Badge tone="coral" className="mb-1">
                    Case #{c.id}
                  </Badge>
                )}
                <h3 className="truncate font-display text-xl font-extrabold leading-tight text-brown">
                  {c.name.toUpperCase()}
                </h3>
              </div>
              {CloseBtn}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge
                status={c.status}
                critical={c.critical}
                type={c.type}
              />
              {c.match && <MatchBadge v={c.match} />}
              {verified && (
                <Badge tone="sky" icon={<BadgeCheck className="size-3.5" />}>
                  Đã xác minh
                </Badge>
              )}
            </div>
            <p className="flex items-center gap-1 text-[13px] font-bold text-brown">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{c.street ? `${c.street}, ${c.district}` : approxLoc(c)}</span>
            </p>
            <p className="flex items-center gap-1 text-[13px] text-brown-soft">
              <Clock className="size-3.5" />
              {c.minutesAgo != null ? `${timeAgo(c.minutesAgo)} · ` : ""}cách bạn {kmFrom(c.x, c.y)} km
            </p>
          </div>
        </div>

        {hide && (
          <p className={cx("flex items-start gap-1.5 rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-sm", isPopup ? "mx-3.5 mb-2.5" : "mb-2")}>
            <Lock className="mt-0.5 size-3.5 shrink-0 text-butter" />
            Vị trí chính xác được bảo vệ để đảm bảo an toàn cho bé.
          </p>
        )}

        <div className={cx(isPopup ? "p-3.5 pt-0" : "pt-1")}>
          {actions ? (
            actions
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Btn
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={() => go(`/case/${c.id}`)}
                  icon={<Eye className="size-4" />}
                >
                  Chi tiết
                </Btn>
                {onDirections && (
                  <Btn
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs font-black text-sky-800 border-sky-300 bg-sky-50/80 hover:bg-sky-100"
                    onClick={() =>
                      onDirections({
                        x: c.x,
                        y: c.y,
                        name: `${c.name} (${c.species})`,
                        address: `${c.street}, Q. ${c.district}`,
                        caseId: c.id,
                      })
                    }
                    icon={<Navigation className="size-4 text-sky-600" />}
                  >
                    Chỉ đường
                  </Btn>
                )}
              </div>
              {c.status === "active" && (
                <Btn
                  size="sm"
                  variant={urgent ? "danger" : "primary"}
                  className="w-full font-extrabold shadow-[0_3px_0_var(--color-brown)] active:translate-y-1 active:shadow-none"
                  onClick={() => go(`/case/${c.id}?help=1`)}
                  icon={
                    urgent ? (
                      <Siren className="size-4" />
                    ) : (
                      <HandHeart className="size-4" />
                    )
                  }
                >
                  {urgent
                    ? "CẦN CỨU HỘ NGAY"
                    : c.type === "lost"
                      ? "Tôi đã thấy bé"
                      : "Tôi muốn cứu bé"}
                </Btn>
              )}
              {taken && c.assignee && (
                <span className="flex items-center justify-center rounded-2xl border border-brown/30 bg-butter/80 px-2 py-1 text-center text-xs font-extrabold">
                  Đang có người phụ trách
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 2. RISK ZONE
  if (sel.kind === "risk") {
    const r = data || RISKS.find((x) => x.id === sel.id)
    if (!r) return null

    if (compact) {
      return (
        <div
          className={cx(
            "absolute left-2 top-2 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2.5 rounded-2xl border-2 border-brown bg-paper p-2 text-xs shadow-soft animate-[rise_.15s_both]",
            className,
          )}
        >
          <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-plum bg-plum-soft">
            <Siren className="size-5 text-plum" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-extrabold text-brown">{r.title}</p>
            <p className="text-xs text-brown-soft font-semibold">Mức độ: {r.severity}</p>
          </div>
          {actions || (
            <Btn size="sm" variant="secondary" onClick={() => go("/safety")}>
              Chi tiết
            </Btn>
          )}
          {CloseBtn}
        </div>
      )
    }

    return (
      <div
        className={cx(
          shell,
          isPopup && "border-plum bg-plum-soft p-4",
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <WarnBadge>Khu vực cảnh báo · {r.severity}</WarnBadge>
          {CloseBtn}
        </div>
        <h3 className="mt-2 font-display text-xl font-extrabold text-brown">
          {r.title}
        </h3>
        <p className="text-sm font-semibold text-brown">
          Hãy cẩn thận — cộng đồng đã đánh dấu khu vực này có rủi ro.
        </p>
        <p className="mt-1 text-sm text-brown-soft">{r.note}</p>
        {r.expires && (
          <p className="text-xs text-brown-soft">Hết hạn: {r.expires}</p>
        )}

        <div className={cx(isPopup ? "mt-3" : "pt-2")}>
          {actions ? (
            actions
          ) : (
            <Btn
              size="sm"
              variant="secondary"
              onClick={() => go("/safety")}
            >
              Xem cảnh báo an toàn
            </Btn>
          )}
        </div>
      </div>
    )
  }

  // 3. SHELTER OR CLINIC
  const p = data || (
    sel.kind === "shelter"
      ? SHELTERS.find((x) => x.id === sel.id)
      : CLINICS.find((x) => x.id === sel.id)
  )
  if (!p) return null

  if (compact) {
    return (
      <div
        className={cx(
          "absolute left-2 top-2 z-10 flex max-w-[calc(100%-2rem)] items-center gap-2.5 rounded-2xl border-2 border-brown bg-paper p-2 text-xs shadow-soft animate-[rise_.15s_both]",
          className,
        )}
      >
        <PetPhoto
          src={p.photo}
          species="Chó"
          alt={p.name}
          className="size-11 shrink-0 rounded-xl border border-brown object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-extrabold text-brown">{p.name}</p>
            {p.verified && <Verified />}
          </div>
          <p className="truncate text-brown-soft font-semibold">{p.district}</p>
        </div>
        {actions || (
          <Btn
            size="sm"
            variant="secondary"
            onClick={() =>
              go(`/${sel.kind === "shelter" ? "shelters" : "clinics"}/${p.id}`)
            }
          >
            Chi tiết
          </Btn>
        )}
        {CloseBtn}
      </div>
    )
  }

  return (
    <div className={cx(shell, className)}>
      <div className={cx("flex gap-3", isPopup && "p-3")}>
        <PetPhoto
          src={p.photo}
          species="Chó"
          alt={p.name}
          className="size-20 shrink-0 rounded-2xl border-2 border-brown object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-1">
            <div className="min-w-0">
              {!isPopup && (
                <Badge tone={sel.kind === "shelter" ? "sage" : "sky"} className="mb-1">
                  {sel.kind === "shelter" ? "Mái ấm" : "Phòng khám"}
                </Badge>
              )}
              <h3 className="font-display text-lg font-extrabold leading-tight text-brown">
                {p.name}
              </h3>
            </div>
            {CloseBtn}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {p.verified && <Verified />}
            {verified && !p.verified && (
              <Badge tone="sky" icon={<BadgeCheck className="size-3.5" />}>
                Đã xác minh
              </Badge>
            )}
            {p.rating != null && (
              <span className="inline-flex items-center gap-0.5 text-sm font-extrabold">
                <Star className="size-3.5 fill-butter-2 text-butter-2" />
                {p.rating}
              </span>
            )}
          </div>
          <p className="text-sm text-brown-soft font-semibold">
            {p.address || p.district} {p.x != null && p.y != null ? `· ${kmFrom(p.x, p.y)} km` : ""}
          </p>
          {"phone" in p && (
            <p className="text-xs font-bold text-brown">{p.phone}</p>
          )}
        </div>
      </div>

      <div className={cx(isPopup ? "p-3 pt-0" : "pt-2")}>
        {actions ? (
          actions
        ) : (
          <div className="flex gap-2">
            <Btn
              size="sm"
              variant="secondary"
              className="flex-1 text-xs"
              onClick={() =>
                go(`/${sel.kind === "shelter" ? "shelters" : "clinics"}/${p.id}`)
              }
            >
              Xem {sel.kind === "shelter" ? "mái ấm" : "phòng khám"}
            </Btn>
            {onDirections && p.x != null && p.y != null && (
              <Btn
                size="sm"
                variant="outline"
                className="flex-1 text-xs font-black text-sky-800 border-sky-300 bg-sky-50/80 hover:bg-sky-100"
                onClick={() =>
                  onDirections({
                    x: p.x,
                    y: p.y,
                    name: p.name,
                    address: p.address || p.district,
                  })
                }
                icon={<Navigation className="size-4 text-sky-600" />}
              >
                Chỉ đường
              </Btn>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
