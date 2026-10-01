import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cn'

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
