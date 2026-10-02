import { useMemo, useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"
import { DISTRICTS } from "@/constants"
import type { AlertCategory, AlertSeverity, SafetyAlertStory, SafetyFilterState } from "@/types/safety"
import { Btn, Chip, Modal, Select } from "@ui"

const CATEGORIES: (AlertCategory | "Tất cả")[] = [
  "Tất cả",
  "Bả độc / Đồ ăn lạ",
  "Nghi trộm thú cưng",
  "Lừa đảo tiền cọc / chuộc",
  "Điểm đen tai nạn",
  "Tài khoản khả nghi",
  "Khu vực nguy hiểm",
]

const SEVERITIES: (AlertSeverity | "Tất cả")[] = [
  "Tất cả",
  "Khẩn cấp",
  "Cảnh giác",
  "Đã khắc phục",
]

export function SafetyFilterModal({
  open,
  onClose,
  filter,
  onApply,
  onReset,
  alerts,
}: {
  open: boolean
  onClose: () => void
  filter: SafetyFilterState
  onApply: (draft: SafetyFilterState) => void
  onReset: () => void
  alerts: SafetyAlertStory[]
}) {
  const [draft, setDraft] = useState<SafetyFilterState>(filter)

  // Sync draft whenever modal opens
  useEffect(() => {
    if (open) {
      setDraft(filter)
    }
  }, [open, filter])

  // Count preview matches based on draft
  const previewCount = useMemo(() => {
    return alerts.filter((a) => {
      if (draft.category !== "Tất cả" && a.category !== draft.category) return false
      if (draft.district !== "Tất cả" && a.district !== draft.district) return false
      if (draft.severity !== "Tất cả" && a.severity !== draft.severity) return false
      if (draft.search.trim()) {
        const q = draft.search.trim().toLowerCase()
        const text = `${a.title} ${a.excerpt} ${a.district} ${a.address} ${a.fullStory}`.toLowerCase()
        if (!text.includes(q)) return false
      }
      return true
    }).length
  }, [alerts, draft])

  const handleApply = () => {
    onApply(draft)
    onClose()
  }

  const handleReset = () => {
    const defaultState: SafetyFilterState = {
      search: draft.search,
      category: "Tất cả",
      district: "Tất cả",
      severity: "Tất cả",
    }
    setDraft(defaultState)
    onReset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bộ lọc cảnh báo an toàn"
      sheet
    >
      <div className="space-y-5 pt-2">
        {/* Section 1: Danh mục nguy cơ */}
        <div className="space-y-2.5">
          <label className="block text-xs font-extrabold uppercase tracking-wide text-brown-soft">
            Danh mục rủi ro
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat}
                active={draft.category === cat}
                onClick={() => setDraft({ ...draft, category: cat })}
              >
                {cat}
              </Chip>
            ))}
          </div>
        </div>

        {/* Section 2: Khu vực Quận/Huyện */}
        <div className="space-y-2.5">
          <label className="block text-xs font-extrabold uppercase tracking-wide text-brown-soft">
            Khu vực (Quận / Huyện Hà Nội)
          </label>
          <div className="relative">
            <Select
              value={draft.district}
              onChange={(e) => setDraft({ ...draft, district: e.target.value })}
              className="w-full h-11 sm:h-12 rounded-2xl border-2 border-line bg-paper px-4 font-bold text-sm text-brown shadow-xs focus:border-brown focus:ring-4 focus:ring-butter/70"
            >
              <option value="Tất cả">Tất cả các quận huyện</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Section 3: Mức độ khẩn cấp */}
        <div className="space-y-2.5">
          <label className="block text-xs font-extrabold uppercase tracking-wide text-brown-soft">
            Mức độ khẩn cấp
          </label>
          <div className="flex flex-wrap gap-2">
            {SEVERITIES.map((s) => (
              <Chip
                key={s}
                active={draft.severity === s}
                onClick={() => setDraft({ ...draft, severity: s })}
              >
                {s}
              </Chip>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-line mt-6">
          <Btn
            variant="ghost"
            onClick={handleReset}
            icon={<RotateCcw className="size-3.5" />}
            className="text-coral hover:bg-coral-soft/50 font-extrabold"
          >
            Đặt lại
          </Btn>

          <Btn
            variant="primary"
            onClick={handleApply}
            className="px-6 font-extrabold shadow-[0_4px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            Áp dụng ({previewCount} kết quả)
          </Btn>
        </div>
      </div>
    </Modal>
  )
}
