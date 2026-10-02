import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { IconBtn } from "./Button"
import { Badge } from "./Badge"
import { isVideoUrl } from "@/lib/imageUtils"

export interface LightboxModalProps {
  open: boolean
  onClose: () => void
  items: string[]
  initialIndex?: number
  title?: string
}

export function LightboxModal({
  open,
  onClose,
  items,
  initialIndex = 0,
  title,
}: LightboxModalProps) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    if (open) {
      setIndex(Math.max(0, Math.min(initialIndex, items.length - 1)))
    }
  }, [open, initialIndex, items.length])

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : items.length - 1))
  }, [items.length])

  const next = useCallback(() => {
    setIndex((i) => (i < items.length - 1 ? i + 1 : 0))
  }, [items.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowLeft") prev()
      else if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose, prev, next])

  if (!open || items.length === 0) return null

  const current = items[index] || items[0]
  const isVideo = isVideoUrl(current)

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-brown/90 p-4 backdrop-blur-md animate-[rise_.2s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={title || "Xem ảnh phóng to"}
    >
      {/* Top Header */}
      <div
        className="flex w-full max-w-5xl items-center justify-between text-white py-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {items.length > 1 && (
            <Badge tone="butter" className="text-sm font-extrabold px-3 py-1">
              {index + 1} / {items.length}
            </Badge>
          )}
          {title && (
            <span className="truncate font-display text-lg font-bold text-cream">
              {title}
            </span>
          )}
        </div>
        <IconBtn
          label="Đóng (ESC)"
          variant="ghost"
          size="md"
          onClick={onClose}
          className="!bg-cream !text-brown hover:!bg-butter"
        >
          <X className="size-5" />
        </IconBtn>
      </div>

      {/* Main Content Area */}
      <div
        className="relative flex flex-1 w-full max-w-5xl items-center justify-center py-2"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <IconBtn
            label="Ảnh trước (Mũi tên trái)"
            variant="ghost"
            size="lg"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 !size-12 !rounded-full !bg-cream/90 !text-brown shadow-soft hover:!bg-butter active:scale-95"
          >
            <ChevronLeft className="size-7" />
          </IconBtn>
        )}

        <div className="flex max-h-[78vh] max-w-full items-center justify-center overflow-hidden rounded-3xl border-3 border-brown bg-cream-2/20 p-1 shadow-2xl">
          {isVideo ? (
            <video
              src={current}
              controls
              autoPlay
              className="max-h-[75vh] max-w-full rounded-2xl object-contain"
            />
          ) : (
            <img
              src={current}
              alt=""
              className="max-h-[75vh] max-w-full rounded-2xl object-contain select-none"
            />
          )}
        </div>

        {items.length > 1 && (
          <IconBtn
            label="Ảnh tiếp theo (Mũi tên phải)"
            variant="ghost"
            size="lg"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 !size-12 !rounded-full !bg-cream/90 !text-brown shadow-soft hover:!bg-butter active:scale-95"
          >
            <ChevronRight className="size-7" />
          </IconBtn>
        )}
      </div>

      {/* Bottom Thumbnail Strip (when multiple items) */}
      {items.length > 1 && (
        <div
          className="no-scrollbar flex w-full max-w-md items-center justify-center gap-2 overflow-x-auto py-2"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => (
            <button
              key={item + idx}
              type="button"
              onClick={() => setIndex(idx)}
              className={`relative size-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                index === idx
                  ? "border-butter ring-4 ring-butter/50 scale-105"
                  : "border-cream/40 opacity-60 hover:opacity-100"
              }`}
            >
              {isVideoUrl(item) ? (
                <div className="grid size-full place-items-center bg-brown text-white text-[10px] font-bold">
                  VIDEO
                </div>
              ) : (
                <img
                  src={item}
                  alt=""
                  className="size-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
