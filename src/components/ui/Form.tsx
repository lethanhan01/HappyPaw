import {
  useRef,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react"
import {
  AlertCircle,
  CheckCircle2,
  Check,
  Upload as UploadIcon,
  X,
  Star,
  Maximize2,
  Plus,
  Play,
  Loader2,
} from "lucide-react"
import { cx } from "@/lib/cn"
import { useUI } from "@/store/uiStore"
import { validateMediaFile, compressImageToBase64, isVideoUrl } from "@/lib/imageUtils"
import { LightboxModal } from "./LightboxModal"

/* ---------- Forms ---------- */
export function Field({
  label,
  helper,
  error,
  success,
  children,
  required,
}: {
  label: string
  helper?: string
  error?: string
  success?: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-extrabold text-brown">
        {label}
        {required && <span className="text-coral"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-coral">
          <AlertCircle className="size-4" />
          {error}
        </span>
      ) : success ? (
        <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-sage-2">
          <CheckCircle2 className="size-4" />
          {success}
        </span>
      ) : (
        helper && (
          <span className="mt-1 block text-sm text-brown-soft">{helper}</span>
        )
      )}
    </label>
  )
}

const baseInputCls =
  "w-full border-2 border-line bg-white font-semibold text-brown placeholder:font-medium placeholder:text-brown/45 transition focus:border-brown focus:outline-none focus:ring-4 focus:ring-butter/70 disabled:opacity-50 disabled:bg-cream-2"

export const Input = ({
  className,
  invalid,
  size = "md",
  ...p
}: Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  invalid?: boolean
  size?: "sm" | "md" | "lg"
}) => (
  <input
    {...p}
    className={cx(
      baseInputCls,
      size === "sm" && "h-9 px-3 text-sm rounded-xl",
      size === "md" && "h-12 px-4 text-[15px] rounded-2xl",
      size === "lg" && "h-14 px-5 text-lg rounded-2xl",
      invalid && "border-coral focus:border-coral focus:ring-coral/20",
      className,
    )}
  />
)

export const Select = ({
  className,
  size = "md",
  children,
  ...p
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  size?: "sm" | "md" | "lg"
}) => (
  <select
    {...p}
    className={cx(
      baseInputCls,
      'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b4128%27 stroke-width=%273%27 stroke-linecap=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-no-repeat',
      size === "sm" &&
        "h-9 px-3 pr-8 text-sm rounded-xl bg-[length:14px] bg-[right_10px_center]",
      size === "md" &&
        "h-12 px-4 pr-10 text-[15px] rounded-2xl bg-[length:16px] bg-[right_16px_center]",
      size === "lg" &&
        "h-14 px-5 pr-12 text-lg rounded-2xl bg-[length:18px] bg-[right_20px_center]",
      className,
    )}
  >
    {children}
  </select>
)

export const Textarea = ({
  className,
  size = "md",
  ...p
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: "sm" | "md" | "lg"
}) => (
  <textarea
    {...p}
    className={cx(
      baseInputCls,
      size === "sm" && "px-3 py-2 text-sm rounded-xl min-h-20",
      size === "md" && "px-4 py-3 text-[15px] rounded-2xl min-h-28",
      size === "lg" && "px-5 py-4 text-lg rounded-2xl min-h-36",
      className,
    )}
  />
)

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: { v: T; label: ReactNode }[]
  className?: string
}) {
  return (
    <div
      className={cx(
        "inline-flex max-w-full overflow-x-auto no-scrollbar rounded-2xl border-2 border-line bg-cream-2 p-1",
        className,
      )}
      role="tablist"
    >
      {options.map((o) => (
        <button
          key={o.v}
          role="tab"
          aria-selected={value === o.v}
          onClick={() => onChange(o.v)}
          className={cx(
            "min-h-10 shrink-0 whitespace-nowrap rounded-xl px-3 py-1.5 text-[13px] sm:px-4 sm:text-sm sm:flex-1 font-extrabold transition",
            value === o.v
              ? "bg-butter text-brown shadow-[0_2px_0_var(--color-brown)] border border-brown"
              : "text-brown/70 hover:text-brown",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Chip({
  active,
  onClick,
  children,
  icon,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  icon?: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition active:scale-95",
        active
          ? "border-brown bg-butter text-brown"
          : "border-line bg-paper text-brown hover:border-brown/60",
      )}
    >
      {active && <Check className="size-3.5" />}
      {icon}
      {children}
    </button>
  )
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx(
        "relative h-7 w-12 shrink-0 rounded-full border-2 border-brown transition",
        on ? "bg-sage" : "bg-cream-2",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 size-5 rounded-full border-2 border-brown bg-white transition-all",
          on ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  )
}

export function Check2({
  on,
  onChange,
  children,
}: {
  on: boolean
  onChange: (v: boolean) => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex items-center gap-3 text-left text-[15px] font-bold"
    >
      <span
        className={cx(
          "grid size-6 shrink-0 place-items-center rounded-lg border-2 border-brown transition",
          on ? "bg-butter" : "bg-white",
        )}
      >
        {on && <Check className="size-4" strokeWidth={3.5} />}
      </span>
      {children}
    </button>
  )
}

/* ---------- Upload (Enhanced with Base64, Grid, Primary Selector, Lightbox, Clipboard Paste) ---------- */
export interface UploadBoxProps {
  label: string
  hint?: string
  max?: number
  files: string[]
  onChange: (f: string[]) => void
  video?: boolean
  primaryIndex?: number
  onPrimaryChange?: (index: number) => void
  disabled?: boolean
}

export function UploadBox({
  label,
  hint,
  max = 5,
  files,
  onChange,
  video,
  primaryIndex,
  onPrimaryChange,
  disabled,
}: UploadBoxProps) {
  const [over, setOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const ref = useRef<HTMLInputElement>(null)
  const { toast } = useUI()

  const add = async (list: FileList | File[] | null) => {
    if (!list || list.length === 0 || disabled) return
    const fileArray = Array.from(list)

    const availableSlots = max - files.length
    if (availableSlots <= 0) {
      toast(`Đã đạt số lượng tối đa (${max} tệp).`, "warn")
      return
    }

    if (fileArray.length > availableSlots) {
      toast(`Chỉ nhận thêm tối đa ${availableSlots} tệp.`, "warn")
    }

    const filesToProcess = fileArray.slice(0, availableSlots)
    const validFiles: File[] = []

    for (const f of filesToProcess) {
      const check = validateMediaFile(f, video)
      if (!check.valid) {
        toast(check.error || "Tệp không hợp lệ.", "err")
      } else {
        validFiles.push(f)
      }
    }

    if (validFiles.length === 0) {
      if (ref.current) ref.current.value = ""
      return
    }

    setProcessing(true)
    try {
      const processedUrls: string[] = []
      for (const f of validFiles) {
        if (f.type.startsWith("video/") || f.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
          processedUrls.push(URL.createObjectURL(f))
        } else {
          const base64 = await compressImageToBase64(f, 1280, 0.82)
          processedUrls.push(base64)
        }
      }
      onChange([...files, ...processedUrls])
      toast(`Đã tải lên ${processedUrls.length} tệp thành công!`, "ok")
    } catch (err) {
      console.error("Lỗi xử lý tệp:", err)
      toast("Không thể xử lý một số tệp tải lên.", "err")
    } finally {
      setProcessing(false)
      // Reset input value so re-uploading the same file always works!
      if (ref.current) ref.current.value = ""
    }
  }

  const removeFile = (idx: number) => {
    const nextFiles = files.filter((_, i) => i !== idx)
    onChange(nextFiles)
    if (onPrimaryChange && primaryIndex !== undefined) {
      if (primaryIndex === idx) {
        onPrimaryChange(0)
      } else if (primaryIndex > idx) {
        onPrimaryChange(primaryIndex - 1)
      }
    }
  }

  // Handle Clipboard Paste (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    if (!e.clipboardData || disabled) return
    const items = Array.from(e.clipboardData.items)
    const pastedFiles = items
      .filter((it) => it.type.startsWith("image/") || (video && it.type.startsWith("video/")))
      .map((it) => it.getAsFile())
      .filter(Boolean) as File[]

    if (pastedFiles.length > 0) {
      e.preventDefault()
      e.stopPropagation()
      add(pastedFiles)
    }
  }

  return (
    <div className="w-full space-y-3" onPaste={handlePaste} tabIndex={0}>
      <input
        ref={ref}
        type="file"
        hidden
        multiple={max > 1}
        accept={video ? "image/*,video/*" : "image/*"}
        onChange={(e) => add(e.target.files)}
        disabled={disabled}
      />

      {/* When 0 files: Large inviting Retro-Warm Dropzone */}
      {files.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            if (!disabled) add(e.dataTransfer.files)
          }}
          onClick={() => !disabled && ref.current?.click()}
          className={cx(
            "flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-[2.5px] border-dashed px-5 py-8 text-center transition-all duration-200 select-none",
            over
              ? "border-brown bg-butter/50 ring-4 ring-butter/40 scale-[1.01]"
              : "border-brown/40 bg-cream-2/60 hover:border-brown hover:bg-cream-2/90 shadow-sm",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <span className="grid size-14 place-items-center rounded-2xl border-2 border-brown bg-butter shadow-soft animate-[pop_.2s_ease-out]">
            {processing ? (
              <Loader2 className="size-7 animate-spin text-brown" />
            ) : (
              <UploadIcon className="size-7 text-brown" />
            )}
          </span>
          <div className="space-y-0.5">
            <span className="block text-[15px] font-extrabold text-brown">
              {processing ? "Đang xử lý & tối ưu tệp..." : label}
            </span>
            <span className="block text-xs font-semibold text-brown-soft">
              {hint || "Kéo thả, bấm để chọn tệp hoặc ấn phím Ctrl + V để dán"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-brown-soft">
            <span className="rounded-full bg-cream-2 px-2.5 py-0.5 border border-line">
              Tối đa {max} {video ? "ảnh/video" : "ảnh"}
            </span>
            <span className="rounded-full bg-cream-2 px-2.5 py-0.5 border border-line">
              {video ? "Ảnh ≤ 10MB · Video ≤ 50MB" : "≤ 10MB / ảnh"}
            </span>
          </div>
        </div>
      ) : (
        /* When >= 1 files: Dynamic Responsive Grid */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-brown-soft px-1">
            <span>
              Đã tải lên <b className="text-brown">{files.length}</b>/{max} tệp
            </span>
            <span>Bấm vào ảnh để xem phóng to</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((f, i) => {
              const isVid = isVideoUrl(f)
              const isPrimary = onPrimaryChange && (primaryIndex === i || (primaryIndex === undefined && i === 0))

              return (
                <div
                  key={f + i}
                  onClick={() => setPreviewIndex(i)}
                  className={cx(
                    "group relative aspect-square overflow-hidden rounded-2xl border-2 bg-cream-2 cursor-pointer transition-all duration-200 shadow-soft hover:shadow-md",
                    isPrimary
                      ? "border-brown ring-4 ring-butter"
                      : "border-brown hover:border-brown",
                  )}
                >
                  {isVid ? (
                    <div className="relative size-full bg-brown/10 flex items-center justify-center">
                      <video
                        src={f}
                        className="size-full object-cover"
                        preload="metadata"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-brown/30">
                        <span className="grid size-10 place-items-center rounded-full bg-butter border-2 border-brown text-brown shadow">
                          <Play className="size-5 fill-brown ml-0.5" />
                        </span>
                      </span>
                    </div>
                  ) : (
                    <img
                      src={f}
                      alt={`Tệp ${i + 1}`}
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Primary Badge or Select Button */}
                  {onPrimaryChange && (
                    <div className="absolute left-1.5 top-1.5 z-10">
                      {isPrimary ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-brown bg-butter px-2 py-0.5 text-[11px] font-extrabold text-brown shadow-sm">
                          <Star className="size-3 fill-brown" />
                          Ảnh chính
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onPrimaryChange(i)
                          }}
                          title="Đặt làm ảnh đại diện"
                          className="opacity-0 group-hover:opacity-100 transition-opacity grid size-6 place-items-center rounded-full border border-brown bg-cream text-brown shadow-sm hover:bg-butter"
                        >
                          <Star className="size-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Top-right Actions: Zoom & Delete */}
                  <div className="absolute right-1.5 top-1.5 z-10 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewIndex(i)
                      }}
                      title="Xem phóng to"
                      className="opacity-0 group-hover:opacity-100 transition-opacity grid size-6 place-items-center rounded-full border border-brown bg-cream text-brown shadow-sm hover:bg-butter"
                    >
                      <Maximize2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(i)
                      }}
                      title="Xóa tệp này"
                      className="grid size-6 place-items-center rounded-full border border-brown bg-coral text-white shadow-sm hover:bg-coral-dark active:scale-90 transition-transform"
                    >
                      <X className="size-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* "+ Add More" card if files.length < max */}
            {files.length < max && (
              <div
                onClick={() => !disabled && !processing && ref.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (!disabled) setOver(true)
                }}
                onDragLeave={() => setOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setOver(false)
                  if (!disabled) add(e.dataTransfer.files)
                }}
                className={cx(
                  "aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 select-none",
                  over
                    ? "border-brown bg-butter/50 ring-4 ring-butter/30"
                    : "border-brown/40 bg-cream-2/50 hover:border-brown hover:bg-butter/40",
                  processing && "opacity-75 cursor-wait",
                )}
              >
                {processing ? (
                  <Loader2 className="size-7 animate-spin text-brown" />
                ) : (
                  <span className="grid size-10 place-items-center rounded-xl border border-brown bg-butter text-brown shadow-sm">
                    <Plus className="size-5 stroke-[2.5]" />
                  </span>
                )}
                <span className="text-xs font-extrabold text-brown">
                  {processing ? "Đang xử lý..." : "Thêm ảnh"}
                </span>
                <span className="text-[10px] font-bold text-brown-soft">
                  (hoặc Ctrl + V)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        open={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
        items={files}
        initialIndex={previewIndex ?? 0}
        title={label}
      />
    </div>
  )
}

