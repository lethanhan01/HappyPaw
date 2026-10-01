import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle, CheckCircle2, Clock, ShieldCheck, Star, X, Upload as UploadIcon, Check, BadgeCheck, TriangleAlert } from 'lucide-react'
import { useApp, STATUS_META } from './store'
import type { Status, Case } from './data'
import { USERS } from './data'
import logoFull from './assets/logo-full.png'

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

/* ---------- Paw + brand ---------- */
export function Paw({ className = 'size-5', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden>
      <ellipse cx="5.2" cy="10.2" rx="2.2" ry="2.9" transform="rotate(-18 5.2 10.2)" />
      <ellipse cx="9.4" cy="5.6" rx="2.2" ry="3" transform="rotate(-6 9.4 5.6)" />
      <ellipse cx="14.8" cy="5.6" rx="2.2" ry="3" transform="rotate(6 14.8 5.6)" />
      <ellipse cx="18.9" cy="10.2" rx="2.2" ry="2.9" transform="rotate(18 18.9 10.2)" />
      <path d="M12 10.5c-3 0-6 3.6-6 6.3 0 2 1.6 2.9 3 2.9 1.1 0 1.9-.5 3-.5s1.9.5 3 .5c1.4 0 3-.9 3-2.9 0-2.7-3-6.3-6-6.3z" />
    </svg>
  )
}

export function Logo({ onClick, compact }: { onClick?: () => void; compact?: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 group" aria-label="Happy Paw">
      <span className="grid size-9 place-items-center rounded-2xl border-[2.5px] border-brown bg-butter text-brown shadow-[0_3px_0_var(--color-brown)] group-hover:-translate-y-0.5 transition">
        <Paw className="size-5" />
      </span>
      {!compact && (
        <span className="whitespace-nowrap font-display text-[22px] font-extrabold leading-none tracking-tight text-brown">
          HAPPY <span className="rounded-lg bg-butter px-1.5 py-0.5 border-2 border-brown">PAW</span>
        </span>
      )}
    </button>
  )
}

export function BrandImage({ className = 'w-64' }: { className?: string }) {
  return <img src={logoFull} alt="Happy Paws logo" className={className} />
}

/* ---------- Buttons ---------- */
type BtnVariant = 'primary' | 'secondary' | 'soft' | 'danger' | 'ghost' | 'dark'
const btnV: Record<BtnVariant, string> = {
  primary: 'bg-butter text-brown border-brown shadow-[0_4px_0_var(--color-brown)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--color-brown)] active:translate-y-1 active:shadow-none',
  secondary: 'bg-paper text-brown border-brown shadow-[0_4px_0_var(--color-brown)] hover:-translate-y-0.5 hover:bg-white active:translate-y-1 active:shadow-none',
  soft: 'bg-cream-2 text-brown border-transparent hover:bg-peach active:scale-[0.98]',
  danger: 'bg-coral text-white border-brown shadow-[0_4px_0_var(--color-brown)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none',
  dark: 'bg-ink text-white border-ink hover:bg-brown active:scale-[0.98]',
  ghost: 'bg-transparent text-brown border-transparent hover:bg-brown/10 active:scale-[0.98]',
}
export function Btn({ variant = 'primary', size = 'md', pill, full, icon, className, children, ...p }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' | 'lg'; pill?: boolean; full?: boolean; icon?: ReactNode }) {
  return (
    <button
      {...p}
      className={cx(
        'inline-flex items-center justify-center gap-2 border-2 font-bold transition duration-150 disabled:opacity-45 disabled:shadow-none disabled:translate-y-0 disabled:hover:translate-y-0',
        size === 'sm' && 'h-9 px-3.5 text-sm', size === 'md' && 'h-11 px-5 text-[15px]', size === 'lg' && 'h-14 px-7 text-lg',
        pill ? 'rounded-full' : 'rounded-2xl', full && 'w-full', btnV[variant], className,
      )}
    >
      {icon}{children}
    </button>
  )
}
export function IconBtn({ label, className, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button {...p} aria-label={label} title={label}
      className={cx('relative grid size-11 shrink-0 place-items-center rounded-2xl border-2 border-brown/20 bg-paper text-brown transition hover:border-brown hover:bg-white active:scale-95', className)}>
      {children}
    </button>
  )
}

/* ---------- Cards ---------- */
export function Card({ className, children, onClick, hover, ...p }: { className?: string; children: ReactNode; onClick?: () => void; hover?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...p} onClick={onClick}
      className={cx('rounded-[24px] border-2 border-line bg-paper p-5 shadow-soft', (hover || onClick) && 'cursor-pointer transition hover:-translate-y-1 hover:border-brown', className)}>
      {children}
    </div>
  )
}

/* ---------- Badges ---------- */
const tones: Record<string, string> = {
  coral: 'bg-coral-soft text-[#8f2a1c] border-coral/40',
  orange: 'bg-orange-soft text-[#8a4a0c] border-orange/40',
  butter: 'bg-butter text-brown border-butter-2',
  sage: 'bg-sage-soft text-[#2f5a22] border-sage',
  sky: 'bg-sky-soft text-[#1f5873] border-sky',
  pink: 'bg-pink text-[#7d2c3f] border-pink-2/40',
  plum: 'bg-plum-soft text-[#573578] border-plum/40',
  ink: 'bg-ink text-white border-ink',
  brown: 'bg-cream-2 text-brown border-line',
}
export function Badge({ tone = 'brown', icon, children, className }: { tone?: keyof typeof tones | string; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-extrabold', tones[tone], className)}>
      {icon}{children}
    </span>
  )
}
export function StatusBadge({ status, critical, type }: { status: Status; critical?: boolean; type?: Case['type'] }) {
  const m = STATUS_META[status]
  if (status === 'active') {
    const hot = critical || type === 'rescue'
    return <Badge tone={hot ? 'coral' : 'orange'} icon={<AlertCircle className="size-3.5" />}>{m.label}</Badge>
  }
  if (status === 'progress') return <Badge tone="butter" icon={<Clock className="size-3.5" />}>{m.label}</Badge>
  if (status === 'pending') return <Badge tone="butter" icon={<ShieldCheck className="size-3.5" />}>{m.label}</Badge>
  return <Badge tone="sage" icon={<CheckCircle2 className="size-3.5" />}>{m.label}</Badge>
}

export function PetPhoto({ src, species, alt, className }: { src?: string; species: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(!src)
  return (
    <div className={cx('relative overflow-hidden bg-cream-2', className)}>
      {bad ? (
        <div role="img" aria-label={alt} className="grid size-full place-items-center bg-peach/50"><PetIllo species={species} className="size-[55%] max-h-28 max-w-28" /></div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className="size-full object-cover" />
      )}
    </div>
  )
}
export const Verified = ({ label = 'Đã xác minh' }: { label?: string }) => <Badge tone="sky" icon={<BadgeCheck className="size-3.5" />}>{label}</Badge>
export const MatchBadge = ({ v }: { v: number }) => <Badge tone="plum" icon={<Paw className="size-3" />}>AI MATCH {v}%</Badge>
export const WarnBadge = ({ children }: { children: ReactNode }) => <Badge tone="coral" icon={<TriangleAlert className="size-3.5" />}>{children}</Badge>

/* ---------- Avatar ---------- */
const avBg: Record<string, string> = { pink: 'bg-pink', butter: 'bg-butter', sage: 'bg-sage', peach: 'bg-peach', sky: 'bg-sky' }
export function Avatar({ name, tone = 'pink', size = 36 }: { name: string; tone?: string; size?: number }) {
  const initials = name.split(' ').slice(-2).map((w) => w[0]).join('')
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cx('inline-grid shrink-0 place-items-center rounded-full border-2 border-brown font-display font-extrabold text-brown', avBg[tone] || 'bg-pink')}>
      {initials}
    </span>
  )
}
export const UserAvatar = ({ id, size }: { id?: string; size?: number }) => {
  const u = USERS.find((x) => x.id === id)
  return <Avatar name={u?.name || '?'} tone={u?.avatar} size={size} />
}

export function Stars({ value, size = 16, onChange }: { value: number; size?: number; onChange?: (n: number) => void }) {
  return (
    <span className="inline-flex gap-0.5" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} className={cx(onChange && 'transition hover:scale-125 active:scale-95')} aria-label={`${n} sao`}>
          <Star style={{ width: size, height: size }} className={n <= Math.round(value) ? 'fill-butter-2 text-brown' : 'text-brown/30'} strokeWidth={2} />
        </button>
      ))}
    </span>
  )
}

/* ---------- Forms ---------- */
export function Field({ label, helper, error, success, children, required }: { label: string; helper?: string; error?: string; success?: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-extrabold text-brown">{label}{required && <span className="text-coral"> *</span>}</span>
      {children}
      {error ? <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-coral"><AlertCircle className="size-4" />{error}</span>
        : success ? <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-sage-2"><CheckCircle2 className="size-4" />{success}</span>
        : helper && <span className="mt-1 block text-sm text-brown-soft">{helper}</span>}
    </label>
  )
}
const inputCls = 'w-full rounded-2xl border-2 border-line bg-white px-4 text-[15px] font-semibold text-brown placeholder:font-medium placeholder:text-brown/45 transition focus:border-brown focus:outline-none focus:ring-4 focus:ring-butter/70'
export const Input = ({ className, invalid, ...p }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) =>
  <input {...p} className={cx(inputCls, 'h-12', invalid && 'border-coral', className)} />
export const Select = ({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) =>
  <select {...p} className={cx(inputCls, 'h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b4128%27 stroke-width=%273%27 stroke-linecap=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10', className)}>{children}</select>
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) =>
  <textarea {...p} className={cx(inputCls, 'min-h-28 py-3', className)} />

export function Segmented<T extends string>({ value, onChange, options, className }: { value: T; onChange: (v: T) => void; options: { v: T; label: ReactNode }[]; className?: string }) {
  return (
    <div className={cx('inline-flex max-w-full rounded-2xl border-2 border-line bg-cream-2 p-1', className)} role="tablist">
      {options.map((o) => (
        <button key={o.v} role="tab" aria-selected={value === o.v} onClick={() => onChange(o.v)}
          className={cx('min-h-10 min-w-0 flex-1 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[13px] sm:px-4 sm:text-sm font-extrabold transition', value === o.v ? 'bg-butter text-brown shadow-[0_2px_0_var(--color-brown)] border border-brown' : 'text-brown/70 hover:text-brown')}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
export function Chip({ active, onClick, children, icon }: { active?: boolean; onClick?: () => void; children: ReactNode; icon?: ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={cx('inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition active:scale-95',
        active ? 'border-brown bg-butter text-brown' : 'border-line bg-paper text-brown hover:border-brown/60')}>
      {active && <Check className="size-3.5" />}{icon}{children}
    </button>
  )
}
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={cx('relative h-7 w-12 shrink-0 rounded-full border-2 border-brown transition', on ? 'bg-sage' : 'bg-cream-2')}>
      <span className={cx('absolute top-0.5 size-5 rounded-full border-2 border-brown bg-white transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  )
}
export function Check2({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={() => onChange(!on)} className="flex items-center gap-3 text-left text-[15px] font-bold">
      <span className={cx('grid size-6 shrink-0 place-items-center rounded-lg border-2 border-brown transition', on ? 'bg-butter' : 'bg-white')}>{on && <Check className="size-4" strokeWidth={3.5} />}</span>
      {children}
    </button>
  )
}

/* ---------- Upload (simulated) ---------- */
export function UploadBox({ label, hint, max = 5, files, onChange, video }: { label: string; hint?: string; max?: number; files: string[]; onChange: (f: string[]) => void; video?: boolean }) {
  const [over, setOver] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const add = (list: FileList | null) => {
    if (!list) return
    const urls = Array.from(list).slice(0, max - files.length).map((f) => URL.createObjectURL(f))
    onChange([...files, ...urls])
  }
  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files) }}
        onClick={() => ref.current?.click()}
        className={cx('flex cursor-pointer flex-col items-center gap-1 rounded-3xl border-[2.5px] border-dashed px-4 py-6 text-center transition', over ? 'border-brown bg-butter/50' : 'border-brown/40 bg-cream-2/60 hover:border-brown hover:bg-cream-2')}>
        <span className="grid size-12 place-items-center rounded-2xl border-2 border-brown bg-butter"><UploadIcon className="size-6" /></span>
        <span className="text-[15px] font-extrabold">{label}</span>
        <span className="text-sm text-brown-soft">{hint || 'Kéo thả hoặc bấm để chọn tệp'}</span>
        <input ref={ref} type="file" hidden multiple accept={video ? 'image/*,video/*' : 'image/*'} onChange={(e) => add(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <span key={f} className="relative size-16 overflow-hidden rounded-2xl border-2 border-brown bg-cream-2">
              <img src={f} alt={`Tệp ${i + 1}`} className="size-full object-cover" />
              <button onClick={(e) => { e.stopPropagation(); onChange(files.filter((x) => x !== f)) }} aria-label="Xóa" className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-brown text-white"><X className="size-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Modal + sheet ---------- */
export function Modal({ open, onClose, title, children, wide, sheet = true }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; wide?: boolean; sheet?: boolean }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-brown/45 p-0 sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal aria-label={title}>
      <div onClick={(e) => e.stopPropagation()}
        className={cx('max-h-[92vh] w-full animate-[rise_.25s_ease-out] overflow-y-auto border-2 border-brown bg-paper p-6 shadow-[0_8px_0_rgba(107,65,40,.35)]',
          sheet ? 'rounded-t-[28px] sm:rounded-[28px]' : 'rounded-[28px]', wide ? 'sm:max-w-2xl' : 'sm:max-w-md')}>
        {sheet && <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-brown/25 sm:hidden" />}
        <div className="mb-3 flex items-start justify-between gap-3">
          {title && <h3 className="font-display text-2xl font-extrabold leading-tight">{title}</h3>}
          <button onClick={onClose} aria-label="Đóng" className="ml-auto grid size-9 place-items-center rounded-xl hover:bg-brown/10"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ---------- Toasts ---------- */
export function ToastHost() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-8">
      {toasts.map((t) => (
        <div key={t.id} role="status" className="pointer-events-auto flex animate-[pop_.3s_both] items-center gap-2 rounded-2xl border-2 border-brown bg-brown px-4 py-2.5 text-sm font-bold text-cream shadow-lg">
          {t.tone === 'ok' ? <CheckCircle2 className="size-5 text-sage" /> : <AlertCircle className="size-5 text-butter" />}{t.msg}
        </div>
      ))}
    </div>
  )
}

/* ---------- Stepper ---------- */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div>
      <p className="mb-2 text-sm font-extrabold text-brown-soft md:hidden">Bước {current + 1}/{steps.length} · {steps[current]}</p>
      <ol className="flex items-center gap-1.5">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span className={cx('grid size-8 shrink-0 place-items-center rounded-full border-2 border-brown font-display text-sm font-extrabold transition-all',
              i < current ? 'bg-sage' : i === current ? 'scale-110 bg-butter' : 'bg-paper text-brown/50 border-brown/30')}>
              {i < current ? <Check className="size-4" strokeWidth={3.5} /> : i + 1}
            </span>
            <span className={cx('hidden text-sm font-extrabold md:block', i === current ? 'text-brown' : 'text-brown/50')}>{s}</span>
            {i < steps.length - 1 && <span className={cx('h-1 min-w-3 flex-1 rounded-full', i < current ? 'bg-sage' : 'bg-line')} />}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ---------- Illustrations ---------- */
export function DogIllo({ className = 'size-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M26 44c-10 2-16 16-12 30 3 8 12 8 15 0l4-22z" fill="#d9a066" stroke="#6b4128" strokeWidth="4" />
      <path d="M94 44c10 2 16 16 12 30-3 8-12 8-15 0l-4-22z" fill="#d9a066" stroke="#6b4128" strokeWidth="4" />
      <ellipse cx="60" cy="66" rx="36" ry="34" fill="#fff6e0" stroke="#6b4128" strokeWidth="4" />
      <ellipse cx="60" cy="80" rx="17" ry="13" fill="#f6d4a6" stroke="#6b4128" strokeWidth="3" />
      <ellipse cx="60" cy="74" rx="6" ry="4.5" fill="#6b4128" />
      <path d="M60 78v5M52 86c4 4 12 4 16 0" stroke="#6b4128" strokeWidth="3" />
      <circle cx="45" cy="60" r="4.5" fill="#6b4128" /><circle cx="75" cy="60" r="4.5" fill="#6b4128" />
      <circle cx="46.5" cy="58.5" r="1.4" fill="#fff" /><circle cx="76.5" cy="58.5" r="1.4" fill="#fff" />
      <ellipse cx="36" cy="74" rx="6" ry="4" fill="#f5cfd6" opacity=".9" /><ellipse cx="84" cy="74" rx="6" ry="4" fill="#f5cfd6" opacity=".9" />
    </svg>
  )
}
export function CatIllo({ className = 'size-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 54 20 20l28 16z" fill="#c9c4bd" stroke="#6b4128" strokeWidth="4" />
      <path d="M98 54l2-34-28 16z" fill="#c9c4bd" stroke="#6b4128" strokeWidth="4" />
      <ellipse cx="60" cy="68" rx="40" ry="34" fill="#eeeae4" stroke="#6b4128" strokeWidth="4" />
      <path d="M44 38c2 6 0 9-3 12M76 38c-2 6 0 9 3 12M60 36v10" stroke="#a8a29a" strokeWidth="3.5" />
      <circle cx="44" cy="66" r="4.5" fill="#6b4128" /><circle cx="76" cy="66" r="4.5" fill="#6b4128" />
      <circle cx="45.5" cy="64.5" r="1.4" fill="#fff" /><circle cx="77.5" cy="64.5" r="1.4" fill="#fff" />
      <path d="M56 76h8l-4 5z" fill="#e89aa9" stroke="#6b4128" strokeWidth="2.5" />
      <path d="M60 81v3M54 86c3 3 9 3 12 0" stroke="#6b4128" strokeWidth="3" />
      <path d="M26 74h-12M26 80l-11 4M94 74h12M94 80l11 4" stroke="#6b4128" strokeWidth="2.5" />
      <ellipse cx="34" cy="78" rx="6" ry="4" fill="#f5cfd6" /><ellipse cx="86" cy="78" rx="6" ry="4" fill="#f5cfd6" />
    </svg>
  )
}
export const PetIllo = ({ species, className }: { species: string; className?: string }) => (species === 'Mèo' ? <CatIllo className={className} /> : <DogIllo className={className} />)

export function Empty({ title, body, cta, onCta, species = 'Chó' }: { title: string; body?: string; cta?: string; onCta?: () => void; species?: string }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-[28px] border-2 border-dashed border-brown/30 bg-paper/60 px-6 py-10 text-center">
      <div className="animate-bounce-soft"><PetIllo species={species} className="size-28" /></div>
      <h3 className="font-display text-xl font-extrabold">{title}</h3>
      {body && <p className="text-sm text-brown-soft">{body}</p>}
      {cta && <Btn variant="secondary" onClick={onCta}>{cta}</Btn>}
    </div>
  )
}
export const Skeleton = ({ className }: { className?: string }) => <div className={cx('animate-pulse rounded-2xl bg-cream-2', className)} />

export function ErrorState({ onRetry, title = 'Ôi, có chút trục trặc rồi' }: { onRetry: () => void; title?: string }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 px-6 py-10 text-center">
      <CatIllo className="size-24 opacity-90" />
      <h3 className="font-display text-xl font-extrabold">{title}</h3>
      <p className="text-sm text-brown-soft">Không tải được dữ liệu. Bạn kiểm tra kết nối rồi thử lại nhé.</p>
      <Btn onClick={onRetry} variant="secondary">Thử lại</Btn>
    </div>
  )
}

export function Confetti() {
  const colors = ['#fff27a', '#f5cfd6', '#a9cc94', '#f6d4a6', '#b9dcec']
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden" aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="absolute top-0 block h-3 w-2 rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, background: colors[i % 5], animation: `confetti ${1.8 + (i % 5) * 0.3}s ease-in ${(i % 7) * 0.12}s both`, border: '1px solid #6b4128' }} />
      ))}
    </div>
  )
}

export function SuccessScreen({ title, children, species = 'Chó', calm }: { title: string; children?: ReactNode; species?: string; calm?: boolean }) {
  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-10 text-center">
      {!calm && <Confetti />}
      <div className="relative">
        <PetIllo species={species} className="size-36" />
        <span className="absolute -right-1 -top-1 grid size-10 place-items-center rounded-full border-2 border-brown bg-sage"><Check className="size-6" strokeWidth={3.5} /></span>
      </div>
      <h2 className="font-display text-3xl font-extrabold">{title}</h2>
      {children}
    </div>
  )
}

export function PageHead({ title, sub, right, back }: { title: string; sub?: string; right?: ReactNode; back?: () => void }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {back && <button onClick={back} className="mb-1 text-sm font-extrabold text-brown-soft hover:text-brown">← Quay lại</button>}
        <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{title}</h1>
        {sub && <p className="mt-0.5 text-brown-soft">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export const Note = ({ tone = 'butter', icon, children }: { tone?: 'butter' | 'coral' | 'sky' | 'sage' | 'ink'; icon?: ReactNode; children: ReactNode }) => {
  const m = { butter: 'bg-butter/60 border-butter-2', coral: 'bg-coral-soft border-coral/40', sky: 'bg-sky-soft border-sky', sage: 'bg-sage-soft border-sage', ink: 'bg-ink text-white border-ink' }[tone]
  return <div className={cx('flex gap-3 rounded-2xl border-2 p-3.5 text-sm font-semibold', m)}>{icon}<div>{children}</div></div>
}

/* ---------- Media query + draggable bottom sheet ---------- */
export function useMedia(q: string) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setM(mq.matches)
    f(); mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return m
}

/** Draggable sheet with three snap points (peek / half / full) inside a relatively positioned parent. */
export function BottomSheet({ snap, onSnap, peek = 150, header, children, className }: { snap: 0 | 1 | 2; onSnap: (s: 0 | 1 | 2) => void; peek?: number; header: ReactNode; children?: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const start = useRef<{ y: number; h: number; moved: boolean } | null>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const heights = () => {
    const H = box.current?.parentElement?.clientHeight ?? 640
    return [peek, Math.round(H * 0.56), H - 6]
  }
  const h = drag ?? heights()[snap]
  return (
    <div ref={box} style={{ height: h }}
      className={cx('absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[28px] border-2 border-b-0 border-brown bg-cream shadow-[0_-8px_30px_-12px_rgba(107,65,40,.45)]', drag === null && 'transition-[height] duration-300', className)}>
      <div className="touch-none select-none"
        onPointerDown={(e) => { (e.currentTarget as Element).setPointerCapture(e.pointerId); start.current = { y: e.clientY, h: heights()[snap], moved: false } }}
        onPointerMove={(e) => {
          const s = start.current; if (!s) return
          const dy = s.y - e.clientY
          if (Math.abs(dy) > 5) s.moved = true
          if (s.moved) { const hs = heights(); setDrag(Math.min(hs[2], Math.max(hs[0], s.h + dy))) }
        }}
        onPointerUp={() => {
          const s = start.current; start.current = null
          if (!s) return
          if (!s.moved) { onSnap(snap === 0 ? 1 : 0); return }
          const hs = heights(); const cur = drag ?? hs[snap]
          const dirUp = cur > s.h
          let next = hs.map((v, i) => [Math.abs(v - cur), i] as const).sort((a, b) => a[0] - b[0])[0][1] as 0 | 1 | 2
          if (Math.abs(cur - s.h) > 40 && next === snap) next = Math.max(0, Math.min(2, snap + (dirUp ? 1 : -1))) as 0 | 1 | 2
          setDrag(null); onSnap(next)
        }}
        onPointerCancel={() => { start.current = null; setDrag(null) }}>
        <div role="button" aria-label="Kéo để mở rộng hoặc thu gọn" className="flex justify-center pb-1 pt-2.5"><span className="h-1.5 w-11 rounded-full bg-brown/30" /></div>
        {header}
      </div>
      <div className={cx('min-h-0 flex-1 overflow-y-auto overscroll-contain', snap === 0 && drag === null && 'overflow-hidden')}>{children}</div>
    </div>
  )
}
