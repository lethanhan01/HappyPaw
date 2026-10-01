import {
  useRef,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { AlertCircle, CheckCircle2, Check, Upload as UploadIcon, X } from 'lucide-react'
import { cx } from '@/lib/cn'

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
        helper && <span className="mt-1 block text-sm text-brown-soft">{helper}</span>
      )}
    </label>
  )
}

const baseInputCls =
  'w-full border-2 border-line bg-white font-semibold text-brown placeholder:font-medium placeholder:text-brown/45 transition focus:border-brown focus:outline-none focus:ring-4 focus:ring-butter/70 disabled:opacity-50 disabled:bg-cream-2'

export const Input = ({
  className,
  invalid,
  size = 'md',
  ...p
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
}) => (
  <input
    {...p}
    className={cx(
      baseInputCls,
      size === 'sm' && 'h-9 px-3 text-sm rounded-xl',
      size === 'md' && 'h-12 px-4 text-[15px] rounded-2xl',
      size === 'lg' && 'h-14 px-5 text-lg rounded-2xl',
      invalid && 'border-coral focus:border-coral focus:ring-coral/20',
      className,
    )}
  />
)

export const Select = ({
  className,
  size = 'md',
  children,
  ...p
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
  size?: 'sm' | 'md' | 'lg'
}) => (
  <select
    {...p}
    className={cx(
      baseInputCls,
      'appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b4128%27 stroke-width=%273%27 stroke-linecap=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-no-repeat',
      size === 'sm' && 'h-9 px-3 pr-8 text-sm rounded-xl bg-[length:14px] bg-[right_10px_center]',
      size === 'md' && 'h-12 px-4 pr-10 text-[15px] rounded-2xl bg-[length:16px] bg-[right_16px_center]',
      size === 'lg' && 'h-14 px-5 pr-12 text-lg rounded-2xl bg-[length:18px] bg-[right_20px_center]',
      className,
    )}
  >
    {children}
  </select>
)

export const Textarea = ({
  className,
  size = 'md',
  ...p
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: 'sm' | 'md' | 'lg'
}) => (
  <textarea
    {...p}
    className={cx(
      baseInputCls,
      size === 'sm' && 'px-3 py-2 text-sm rounded-xl min-h-20',
      size === 'md' && 'px-4 py-3 text-[15px] rounded-2xl min-h-28',
      size === 'lg' && 'px-5 py-4 text-lg rounded-2xl min-h-36',
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
    <div className={cx('inline-flex max-w-full rounded-2xl border-2 border-line bg-cream-2 p-1', className)} role="tablist">
      {options.map((o) => (
        <button
          key={o.v}
          role="tab"
          aria-selected={value === o.v}
          onClick={() => onChange(o.v)}
          className={cx(
            'min-h-10 min-w-0 flex-1 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[13px] sm:px-4 sm:text-sm font-extrabold transition',
            value === o.v
              ? 'bg-butter text-brown shadow-[0_2px_0_var(--color-brown)] border border-brown'
              : 'text-brown/70 hover:text-brown',
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
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition active:scale-95',
        active ? 'border-brown bg-butter text-brown' : 'border-line bg-paper text-brown hover:border-brown/60',
      )}
    >
      {active && <Check className="size-3.5" />}
      {icon}
      {children}
    </button>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx('relative h-7 w-12 shrink-0 rounded-full border-2 border-brown transition', on ? 'bg-sage' : 'bg-cream-2')}
    >
      <span
        className={cx(
          'absolute top-0.5 size-5 rounded-full border-2 border-brown bg-white transition-all',
          on ? 'left-[22px]' : 'left-0.5',
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
          'grid size-6 shrink-0 place-items-center rounded-lg border-2 border-brown transition',
          on ? 'bg-butter' : 'bg-white',
        )}
      >
        {on && <Check className="size-4" strokeWidth={3.5} />}
      </span>
      {children}
    </button>
  )
}

/* ---------- Upload (simulated) ---------- */
export function UploadBox({
  label,
  hint,
  max = 5,
  files,
  onChange,
  video,
}: {
  label: string
  hint?: string
  max?: number
  files: string[]
  onChange: (f: string[]) => void
  video?: boolean
}) {
  const [over, setOver] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const add = (list: FileList | null) => {
    if (!list) return
    const urls = Array.from(list)
      .slice(0, max - files.length)
      .map((f) => URL.createObjectURL(f))
    onChange([...files, ...urls])
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          add(e.dataTransfer.files)
        }}
        onClick={() => ref.current?.click()}
        className={cx(
          'flex cursor-pointer flex-col items-center gap-1 rounded-3xl border-[2.5px] border-dashed px-4 py-6 text-center transition',
          over ? 'border-brown bg-butter/50' : 'border-brown/40 bg-cream-2/60 hover:border-brown hover:bg-cream-2',
        )}
      >
        <span className="grid size-12 place-items-center rounded-2xl border-2 border-brown bg-butter">
          <UploadIcon className="size-6" />
        </span>
        <span className="text-[15px] font-extrabold">{label}</span>
        <span className="text-sm text-brown-soft">{hint || 'Kéo thả hoặc bấm để chọn tệp'}</span>
        <input
          ref={ref}
          type="file"
          hidden
          multiple
          accept={video ? 'image/*,video/*' : 'image/*'}
          onChange={(e) => add(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <span key={f} className="relative size-16 overflow-hidden rounded-2xl border-2 border-brown bg-cream-2">
              <img src={f} alt={`Tệp ${i + 1}`} className="size-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(files.filter((x) => x !== f))
                }}
                aria-label="Xóa"
                className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-brown text-white"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
