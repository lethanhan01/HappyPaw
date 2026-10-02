import type { ReactNode } from "react"
import {
  BadgeCheck,
  Clock,
  Eye,
  HandHeart,
  Lock,
  MapPin,
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
  actions?: ReactNode
  verified?: boolean
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export function PinDetailCard({
  sel,
  onClose,
  display = "popup",
  actions,
  verified,
  className,
  data,
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
            <div className="flex gap-2">
              <Btn
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => go(`/case/${c.id}`)}
                icon={<Eye className="size-4" />}
              >
                Chi tiết
              </Btn>
              {c.status === "active" && (
                <Btn
                  size="sm"
                  variant={urgent ? "danger" : "primary"}
                  className="flex-[1.4] font-extrabold shadow-[0_3px_0_var(--color-brown)] active:translate-y-1 active:shadow-none"
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
                <span className="flex flex-1 items-center justify-center rounded-2xl border border-brown/30 bg-butter/80 px-2 py-1 text-center text-xs font-extrabold">
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
          <Btn
            size="sm"
            full
            onClick={() =>
              go(`/${sel.kind === "shelter" ? "shelters" : "clinics"}/${p.id}`)
            }
          >
            Xem {sel.kind === "shelter" ? "mái ấm" : "phòng khám"}
          </Btn>
        )}
      </div>
    </div>
  )
}
