import { useState } from "react"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  MapPin,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
} from "lucide-react"
import { useApp } from "@/store"
import type { SafetyAlertStory, AlertCategory, AlertSeverity } from "@/types/safety"
import { Avatar, Badge, Btn, Modal, Verified } from "@ui"
import { LightboxModal } from "@/components/ui/LightboxModal"

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

export function SafetyAlertModal({
  alert,
  open,
  onClose,
  onFocusMap,
}: {
  alert: SafetyAlertStory | null
  open: boolean
  onClose: () => void
  onFocusMap?: () => void
}) {
  const { toggleConfirm, toast } = useApp()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  if (!alert) return null

  const handleShare = () => {
    const url = `${window.location.origin}/safety?alert=${alert.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        toast("Đã sao chép liên kết cảnh báo vào bộ nhớ tạm!")
      })
    } else {
      toast("Đã sao chép liên kết cảnh báo!")
    }
  }

  const handleConfirm = () => {
    toggleConfirm(alert.id)
    if (!alert.hasConfirmed) {
      toast("Cảm ơn bạn đã xác nhận cảnh báo có ích cho cộng đồng!")
    } else {
      toast("Đã bỏ xác nhận cảnh báo.")
    }
  }

  return (
    <>
      <Modal open={open} onClose={onClose} wide sheet>
        <div className="space-y-5">
          {/* Header Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={categoryTone(alert.category)}>{alert.category}</Badge>
            <Badge
              tone={severityTone(alert.severity)}
              icon={
                alert.severity === "Khẩn cấp" ? (
                  <AlertTriangle className="size-3.5" />
                ) : alert.severity === "Cảnh giác" ? (
                  <Eye className="size-3.5" />
                ) : (
                  <CheckCircle2 className="size-3.5" />
                )
              }
            >
              {alert.severity}
            </Badge>
            <Badge tone="sand">{alert.district}</Badge>
          </div>

          {/* Title */}
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brown leading-snug">
              {alert.title}
            </h2>
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-bold text-brown-soft">
              <span className="flex items-center gap-1.5">
                <Avatar
                  name={alert.author.isAnonymous ? "?" : alert.author.name}
                  tone={alert.author.avatar || "butter"}
                  size={24}
                />
                <span className="text-brown">
                  {alert.author.isAnonymous ? "Cư dân ẩn danh" : alert.author.name}
                </span>
                {alert.author.isVerified && <Verified />}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-brown-soft" />
                {alert.createdAt}
              </span>
              {alert.expiresAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-brown-soft" />
                  Hiệu lực đến {alert.expiresAt}
                </span>
              )}
            </div>
          </div>

          {/* Location Box */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-line bg-cream/60 p-3 sm:p-3.5">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-brown">
              <MapPin className="size-5 shrink-0 text-coral" />
              <span>
                {alert.address} ({alert.district}, Hà Nội)
              </span>
            </div>
            {onFocusMap && (
              <Btn
                size="sm"
                variant="ghost"
                onClick={() => {
                  onClose()
                  onFocusMap()
                }}
                className="h-8 px-2.5 text-xs font-bold border border-line bg-paper hover:bg-butter"
              >
                <Compass className="size-3.5 mr-1 text-coral" />
                Xem vị trí trên bản đồ
              </Btn>
            )}
          </div>

          {/* Photos Gallery */}
          {alert.photos && alert.photos.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
                Hình ảnh bằng chứng & hiện trường ({alert.photos.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {alert.photos.map((src, i) => (
                  <Btn
                    key={i}
                    variant="ghost"
                    onClick={() => {
                      setLightboxIdx(i)
                      setLightboxOpen(true)
                    }}
                    className="group relative aspect-[4/3] h-auto w-full p-0 overflow-hidden rounded-xl border-2 border-brown bg-cream-2 focus:outline-hidden focus:ring-4 focus:ring-butter"
                  >
                    <img
                      src={src}
                      alt={`${alert.title} ${i + 1}`}
                      loading="lazy"
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-brown/0 transition group-hover:bg-brown/20 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 rounded-full bg-brown/80 text-white px-2 py-0.5 text-[11px] font-bold backdrop-blur-xs transition">
                        Phóng to
                      </span>
                    </div>
                  </Btn>
                ))}
              </div>
            </div>
          )}

          {/* Full Story Narrative */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-brown-soft">
              Diễn biến chi tiết sự việc
            </h4>
            <div className="rounded-2xl border-2 border-brown bg-paper p-4 text-sm sm:text-base font-medium leading-relaxed text-brown whitespace-pre-line shadow-xs">
              {alert.fullStory}
            </div>
          </div>

          {/* Live Timeline Updates */}
          {alert.updates && alert.updates.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-brown-soft">
                <Clock className="size-3.5 text-coral" />
                Dòng thời gian cập nhật sự việc
              </h4>
              <div className="relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-line space-y-3">
                {alert.updates.map((up) => (
                  <div key={up.id} className="relative">
                    <div className="absolute -left-5 top-1 size-2 rounded-full border-2 border-brown bg-butter ring-4 ring-paper" />
                    <div className="rounded-xl border border-line bg-cream/40 p-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-extrabold text-coral-dark">{up.time}</span>
                        <span className="text-[11px] font-bold text-brown-soft">
                          Nguồn: {up.author}
                        </span>
                      </div>
                      <p className="text-brown-2 leading-relaxed">{up.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* First Aid & Safety Advice */}
          {alert.firstAidAdvice && alert.firstAidAdvice.length > 0 && (
            <div className="rounded-2xl border-2 border-coral/50 bg-coral-soft/40 p-4 space-y-2.5">
              <h4 className="flex items-center gap-1.5 font-display text-base font-extrabold text-coral-dark">
                <Stethoscope className="size-5 shrink-0" />
                Hướng dẫn xử lý & Khuyến cáo an toàn từ Happy Paws
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-semibold text-brown">
                {alert.firstAidAdvice.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-coral" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status Note */}
          {alert.statusNote && (
            <p className="text-xs font-bold italic text-brown-soft">
              * Tình trạng hiện tại: {alert.statusNote}
            </p>
          )}

          {/* Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-line">
            <div className="flex items-center gap-2">
              <Btn
                variant={alert.hasConfirmed ? "primary" : "secondary"}
                onClick={handleConfirm}
                icon={<ShieldCheck className="size-4" />}
                className="font-extrabold"
              >
                {alert.hasConfirmed ? "Đã xác nhận (+1)" : "Xác nhận cảnh giác (+1)"} (
                {alert.confirmsCount})
              </Btn>
              <Btn variant="ghost" onClick={handleShare} icon={<Share2 className="size-4" />}>
                Chia sẻ
              </Btn>
            </div>
            <Btn variant="dark" onClick={onClose}>
              Đóng
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Lightbox for zooming photos */}
      <LightboxModal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={alert.photos}
        initialIndex={lightboxIdx}
        title={alert.title}
      />
    </>
  )
}
