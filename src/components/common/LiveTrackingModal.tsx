import { useState } from "react"
import {
  Copy,
  Check,
  ExternalLink,
  Radio,
  QrCode,
} from "lucide-react"
import { Btn, Modal, Input } from "@/components/ui"
import { useApp } from "@/store"

export interface LiveTrackingModalProps {
  open: boolean
  onClose: () => void
  caseId: string
  caseName?: string
  rescuerName?: string
  isLive?: boolean
}

export function LiveTrackingModal({
  open,
  onClose,
  caseId,
  caseName = "Bé thú cưng",
  rescuerName = "Đội cứu trợ HappyPaw",
  isLive = true,
}: LiveTrackingModalProps) {
  const { toast } = useApp()
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const origin = window.location.origin
  const shareUrl = `${origin}/track/${caseId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast("Đã sao chép liên kết theo dõi trực tiếp!", "ok")
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast("Không thể tự động sao chép, vui lòng copy liên kết bên dưới", "warn")
    }
  }

  const handleOpenNewTab = () => {
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Chia sẻ vị trí cứu hộ trực tiếp"
    >
      <div className="space-y-4 pt-1">
        {/* Live Status Header */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Radio className="size-4 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-800">
                {isLive ? "Tín hiệu GPS trực tiếp" : "Sẵn sàng chia sẻ"}
              </p>
              <p className="text-[11px] font-bold text-emerald-600">
                Đang phát tới ca: {caseName} ({caseId})
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
            LIVE
          </span>
        </div>

        {/* Description */}
        <p className="text-xs font-bold text-brown leading-relaxed">
          Gửi liên kết này cho người báo tin hoặc chủ pet để họ theo dõi trực tiếp lộ trình cứu hộ viên <strong>{rescuerName}</strong> đang tiếp cận hiện trường.
        </p>

        {/* QR Code Demo Section */}
        <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-cream/70 border border-brown/15 text-center">
          <div className="size-28 sm:size-34 p-2 rounded-xl bg-white border-2 border-brown shadow-sm flex items-center justify-center mb-2">
            {/* SVG Visual QR Mock with Paw centerpiece */}
            <svg viewBox="0 0 100 100" className="size-full text-brown">
              {/* Corner position markers */}
              <rect x="5" y="5" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="11" width="12" height="12" fill="currentColor" />

              <rect x="71" y="5" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="77" y="11" width="12" height="12" fill="currentColor" />

              <rect x="5" y="71" width="24" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="77" width="12" height="12" fill="currentColor" />

              {/* Data blocks */}
              <rect x="35" y="10" width="8" height="6" fill="currentColor" />
              <rect x="48" y="10" width="12" height="6" fill="currentColor" />
              <rect x="10" y="35" width="14" height="6" fill="currentColor" />
              <rect x="10" y="48" width="8" height="12" fill="currentColor" />

              <rect x="75" y="35" width="15" height="6" fill="currentColor" />
              <rect x="80" y="48" width="10" height="8" fill="currentColor" />
              <rect x="35" y="75" width="14" height="6" fill="currentColor" />
              <rect x="40" y="85" width="8" height="8" fill="currentColor" />
              <rect x="75" y="75" width="18" height="18" rx="2" fill="currentColor" />

              {/* Paw Center Badge */}
              <circle cx="50" cy="50" r="14" fill="#fdfcf8" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="52" r="5" fill="#e8892c" />
              <circle cx="44" cy="45" r="2.5" fill="#e8892c" />
              <circle cx="50" cy="42" r="2.5" fill="#e8892c" />
              <circle cx="56" cy="45" r="2.5" fill="#e8892c" />
            </svg>
          </div>
          <p className="text-[11px] font-extrabold text-brown-soft flex items-center gap-1">
            <QrCode className="size-3.5" />
            Quét mã QR bằng Camera điện thoại để xem trực tiếp
          </p>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-brown uppercase tracking-wider">
            Liên kết theo dõi trực tiếp:
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              readOnly
              value={shareUrl}
              size="sm"
              className="flex-1 text-xs font-bold text-brown select-all"
            />
            <Btn
              size="sm"
              variant={copied ? "primary" : "secondary"}
              onClick={handleCopy}
              icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              className="font-extrabold text-xs shrink-0"
            >
              {copied ? "Đã chép" : "Sao chép"}
            </Btn>
          </div>
        </div>

        {/* Multi-Tab Test Button */}
        <div className="pt-2 border-t border-brown/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-[11px] font-bold text-brown-soft">
            Mở trên tab khác để kiểm tra đồng bộ:
          </p>
          <Btn
            size="sm"
            variant="ghost"
            onClick={handleOpenNewTab}
            icon={<ExternalLink className="size-4" />}
            className="text-xs font-black text-sky-700 hover:text-sky-800 !p-1 self-start sm:self-auto"
          >
            Mở Tab mới
          </Btn>
        </div>
      </div>
    </Modal>
  )
}
