import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cx } from '@/lib/cn'
import { Btn } from './Button'
import { CatIllo, PetIllo } from './Media'

export function Empty({
  title,
  body,
  cta,
  onCta,
  species = 'Chó',
}: {
  title: string
  body?: string
  cta?: string
  onCta?: () => void
  species?: string
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-[28px] border-2 border-dashed border-brown/30 bg-paper/60 px-6 py-10 text-center">
      <div className="animate-bounce-soft">
        <PetIllo species={species} className="size-28" />
      </div>
      <h3 className="font-display text-xl font-extrabold">{title}</h3>
      {body && <p className="text-sm text-brown-soft">{body}</p>}
      {cta && <Btn variant="secondary" onClick={onCta}>{cta}</Btn>}
    </div>
  )
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cx('animate-pulse rounded-2xl bg-cream-2', className)} />
)

export function ErrorState({
  onRetry,
  title = 'Ôi, có chút trục trặc rồi',
}: {
  onRetry: () => void
  title?: string
}) {
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
        <span
          key={i}
          className="absolute top-0 block h-3 w-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % 5],
            animation: `confetti ${1.8 + (i % 5) * 0.3}s ease-in ${(i % 7) * 0.12}s both`,
            border: '1px solid #6b4128',
          }}
        />
      ))}
    </div>
  )
}

export function SuccessScreen({
  title,
  children,
  species = 'Chó',
  calm,
}: {
  title: string
  children?: ReactNode
  species?: string
  calm?: boolean
}) {
  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-10 text-center">
      {!calm && <Confetti />}
      <div className="relative">
        <PetIllo species={species} className="size-36" />
        <span className="absolute -right-1 -top-1 grid size-10 place-items-center rounded-full border-2 border-brown bg-sage">
          <Check className="size-6" strokeWidth={3.5} />
        </span>
      </div>
      <h2 className="font-display text-3xl font-extrabold">{title}</h2>
      {children}
    </div>
  )
}
