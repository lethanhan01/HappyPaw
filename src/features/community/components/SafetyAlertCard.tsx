import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Eye,
  MapPin,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Camera,
} from "lucide-react"
import { useApp } from "@/store"
import type { SafetyAlertStory, AlertCategory, AlertSeverity } from "@/types/safety"
import { Avatar, Badge, Btn, IconBtn, Verified } from "@ui"
import { cx } from "@/lib"

const categoryTone = (cat: AlertCategory) => {
  switch (cat) {
    case "Bả độc / Đồ ăn lạ":
      return "coral"
    case "Nghi trộm thú cưng":
      return "orange"
    case "Lừa đảo tiền cọc / chuộc":
      return "plum"
    case "Điểm đen tai nạn":
      return "butter"
    case "Tài khoản khả nghi":
      return "ink"
    case "Khu vực nguy hiểm":
      return "coral"
    default:
      return "sand"
  }
}

const severityTone = (sev: AlertSeverity) => {
  switch (sev) {
    case "Khẩn cấp":
      return "coral"
    case "Cảnh giác":
      return "orange"
    case "Đã khắc phục":
      return "sage"
  }
}

export function SafetyAlertCard({
  alert,
  selected,
  onFocusMap,
  onOpenDetail,
}: {
  alert: SafetyAlertStory
  selected?: boolean
  onFocusMap?: () => void
  onOpenDetail?: () => void
}) {
  const { toggleConfirm, toast } = useApp()

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/safety?alert=${alert.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast("Đã sao chép liên kết cảnh báo vào bộ nhớ tạm!")
      })
    } else {
      toast("Đã sao chép liên kết cảnh báo!")
    }
  }

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleConfirm(alert.id)
    if (!alert.hasConfirmed) {
      toast("Cảm ơn bạn đã xác nhận cảnh báo có ích cho cộng đồng!")
    } else {
      toast("Đã bỏ xác nhận cảnh báo.")
    }
  }

  return (
    <article
      onClick={onOpenDetail}
      className={cx(
        "group relative flex flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[28px] border-2 bg-paper p-4 sm:p-5 shadow-[0_4px_0_var(--color-brown)] transition cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_0_var(--color-brown)]",
        selected
          ? "border-coral ring-4 ring-coral/25 bg-coral-soft/10"
          : "border-brown",
      )}
    >
      <div>
        {/* Author & Status Header */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              name={alert.author.isAnonymous ? "?" : alert.author.name}
              tone={alert.author.avatar || (alert.author.isAnonymous ? "ink" : "butter")}
              size={36}
            />
            <div className="min-w-0 leading-tight">
              <p className="flex items-center gap-1 font-extrabold text-sm text-brown truncate">
                {alert.author.isAnonymous ? "Cư dân ẩn danh" : alert.author.name}
                {alert.author.isVerified && <Verified />}
              </p>
              <p className="text-[11px] font-bold text-brown-soft truncate">
                {alert.createdAt} · {alert.author.role || "Cộng đồng"}
              </p>
            </div>
          </div>

          <Badge
            tone={severityTone(alert.severity)}
            icon={
              alert.severity === "Khẩn cấp" ? (
                <AlertTriangle className="size-3.5 animate-pulse" />
              ) : alert.severity === "Cảnh giác" ? (
                <Eye className="size-3.5" />
              ) : (
                <CheckCircle2 className="size-3.5" />
              )
            }
          >
            {alert.severity}
          </Badge>
        </div>

        {/* Hero Photo & Category Badge */}
        {alert.photos.length > 0 && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-brown bg-cream-2 mb-3.5">
            <img
              src={alert.photos[0]}
              alt={alert.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute left-2.5 top-2.5">
              <Badge tone={categoryTone(alert.category)} className="shadow-sm">
                {alert.category}
              </Badge>
            </div>

            {alert.photos.length > 1 && (
              <span className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-full border border-brown/40 bg-brown/80 px-2 py-0.5 text-[11px] font-extrabold text-white backdrop-blur-xs">
                <Camera className="size-3" />
                {alert.photos.length} ảnh
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-lg sm:text-xl font-extrabold text-brown leading-snug line-clamp-2 group-hover:text-coral transition-colors">
          {alert.title}
        </h3>

        {/* Location */}
        <p className="mt-2 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brown-soft">
          <MapPin className="size-4 shrink-0 text-coral" />
          <span className="truncate">
            {alert.district} · {alert.address}
          </span>
        </p>

        {/* Excerpt quote */}
        <div className="mt-3 rounded-xl border border-line bg-cream/50 p-2.5">
          <p className="text-xs sm:text-sm font-semibold italic text-brown-2 line-clamp-2 leading-relaxed">
            "{alert.excerpt}"
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t-2 border-line flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Confirm Button */}
          <Btn
            size="sm"
            variant={alert.hasConfirmed ? "primary" : "ghost"}
            onClick={handleConfirm}
            className={cx(
              "h-8 px-2.5 text-xs font-extrabold rounded-xl border transition",
              alert.hasConfirmed
                ? "border-brown bg-butter text-brown shadow-xs"
                : "border-line text-brown-2 hover:border-brown",
            )}
            title="Xác nhận cảnh báo có ích"
          >
            <ShieldCheck className={cx("size-3.5", alert.hasConfirmed && "text-brown")} />
            <span>Xác nhận ({alert.confirmsCount})</span>
          </Btn>

          {/* Share Button */}
          <IconBtn
            label="Chia sẻ cảnh báo"
            size="sm"
            onClick={handleShare}
            className="size-8 rounded-xl border border-line hover:border-brown"
          >
            <Share2 className="size-3.5" />
          </IconBtn>

          {/* Focus on map */}
          {onFocusMap && (
            <IconBtn
              label="Xem vị trí trên bản đồ"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onFocusMap()
              }}
              className="size-8 rounded-xl border border-line hover:border-brown hover:bg-butter"
            >
              <Compass className="size-3.5" />
            </IconBtn>
          )}
        </div>

        <Btn
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            onOpenDetail?.()
          }}
          className="h-8 px-3 text-xs font-black rounded-xl"
        >
          Chi tiết
          <ChevronRight className="size-3.5 ml-0.5" />
        </Btn>
      </div>
    </article>
  )
}
