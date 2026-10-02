import type { ReactNode } from "react"
import { Clock, MapPin, Siren, Star } from "lucide-react"
import { cx } from "@/lib/cn"
import type { Clinic, Place, Shelter } from "@/types"
import { Badge, Card, Verified } from "@/components/ui"

export const isShelter = (p: Place): p is Shelter => "needs" in p

export const PlaceRating = ({ p }: { p: Place }) => (
  <span className="inline-flex items-center gap-1 text-sm font-extrabold">
    <Star className="size-4 fill-butter-2 text-butter-2" />
    {p.rating}
    <span className="font-semibold text-brown-soft">({p.reviews})</span>
  </span>
)

export const OpenBadge = ({ open }: { open: boolean }) =>
  open ? (
    <Badge tone="sage" icon={<Clock className="size-3.5" />}>
      Đang mở
    </Badge>
  ) : (
    <Badge tone="brown" icon={<Clock className="size-3.5" />}>
      Đã đóng
    </Badge>
  )

export interface PlaceCardProps {
  p: Place
  onOpen?: () => void
  selected?: boolean
  actions?: ReactNode
  extraMeta?: ReactNode
  className?: string
  layout?: "horizontal" | "vertical"
}

export function PlaceCard({
  p,
  onOpen,
  selected,
  actions,
  extraMeta,
  className,
  layout = "horizontal",
}: PlaceCardProps) {
  if (layout === "vertical") {
    return (
      <Card
        hover={!!onOpen}
        onClick={onOpen}
        className={cx(
          "flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-brown bg-paper p-0 shadow-[0_4px_0_var(--color-brown)] transition hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-brown)]",
          selected && "border-brown ring-4 ring-butter",
          className,
        )}
      >
        <div className="relative h-44 w-full overflow-hidden bg-cream-2 border-b-2 border-brown">
          <img
            src={p.photo}
            alt={p.name}
            loading="lazy"
            className="size-full object-cover"
          />
          {p.verified && (
            <div className="absolute left-2.5 top-2.5">
              <Verified label="Đã thẩm định" />
            </div>
          )}
          {isShelter(p) && p.urgent && (
            <span className="absolute right-2.5 top-2.5 rounded-full border-2 border-brown bg-coral px-2.5 py-0.5 text-xs font-black text-white shadow-sm">
              Cần tiếp tế gấp
            </span>
          )}
          {!isShelter(p) && "emergency" in p && (p as Clinic).emergency && (
            <span className="absolute right-2.5 top-2.5 rounded-full border-2 border-brown bg-coral px-2.5 py-0.5 text-xs font-black text-white shadow-sm">
              Cấp cứu 24/7
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-1.5">
              <h3 className="font-display text-lg font-extrabold leading-tight text-brown line-clamp-1">
                {p.name}
              </h3>
              <PlaceRating p={p} />
            </div>

            <p className="flex items-center gap-1.5 text-sm font-bold text-brown-soft">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{p.address || p.district}</span>
            </p>

            {"phone" in p && p.phone && (
              <p className="text-xs font-extrabold text-brown">
                Hotline: <span>{p.phone}</span>
              </p>
            )}

            {isShelter(p) && p.needs && p.needs.length > 0 && (
              <p className="text-xs font-semibold text-brown-soft line-clamp-1">
                Cần: {p.needs.join(", ")}
              </p>
            )}
          </div>

          {(actions || extraMeta) && (
            <div className="pt-2 border-t border-line/60 space-y-2">
              {extraMeta}
              {actions}
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card
      hover={!!onOpen}
      onClick={onOpen}
      className={cx(
        "flex gap-3 p-4 transition-all duration-150",
        selected && "border-brown ring-4 ring-butter",
        className,
      )}
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-brown bg-cream-2">
        <img
          src={p.photo}
          alt={p.name}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <h3 className="font-display text-lg font-extrabold leading-tight truncate">
              {p.name}
            </h3>
            {p.verified && <Verified />}
          </div>
          {actions && (
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              {actions}
            </div>
          )}
        </div>

        <p className="flex flex-wrap items-center gap-x-3 text-sm font-bold text-brown-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {p.district}
          </span>
          {p.distance !== undefined && <span>{p.distance} km</span>}
          <PlaceRating p={p} />
        </p>

        {isShelter(p) ? (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {p.urgent && (
              <Badge tone="coral" icon={<Siren className="size-3.5" />}>
                Đang cần hỗ trợ
              </Badge>
            )}
            {p.pets !== undefined && <Badge tone="sage">{p.pets} bé</Badge>}
            {p.needs && p.needs.length > 0 && (
              <span className="line-clamp-1 w-full text-xs font-semibold text-brown-soft">
                Cần: {p.needs.join(", ")}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {"open" in p && <OpenBadge open={(p as Clinic).open} />}
            {"emergency" in p && (p as Clinic).emergency && (
              <Badge tone="coral" icon={<Siren className="size-3.5" />}>
                Cấp cứu 24/7
              </Badge>
            )}
          </div>
        )}

        {extraMeta && (
          <div className="mt-1 border-t border-line/60 pt-1 text-xs">
            {extraMeta}
          </div>
        )}
      </div>
    </Card>
  )
}
