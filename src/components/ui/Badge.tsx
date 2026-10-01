import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Clock, ShieldCheck, BadgeCheck, TriangleAlert } from 'lucide-react'
import { cx } from '@/lib/cn'
import { Paw } from './Brand'
import { STATUS_META } from '@/constants/status'
import type { Status, Case } from '@/types/case'

const tones: Record<string, string> = {
  coral: 'bg-coral-soft text-coral-dark border-coral/40',
  orange: 'bg-orange-soft text-orange-dark border-orange/40',
  butter: 'bg-butter text-brown border-butter-2',
  sage: 'bg-sage-soft text-sage-dark border-sage',
  sky: 'bg-sky-soft text-sky-dark border-sky',
  pink: 'bg-pink text-pink-dark border-pink-2/40',
  plum: 'bg-plum-soft text-plum-dark border-plum/40',
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

export const Verified = ({ label = 'Đã xác minh' }: { label?: string }) => (
  <Badge tone="sky" icon={<BadgeCheck className="size-3.5" />}>{label}</Badge>
)

export const MatchBadge = ({ v }: { v: number }) => (
  <Badge tone="plum" icon={<Paw className="size-3" />}>AI MATCH {v}%</Badge>
)

export const WarnBadge = ({ children }: { children: ReactNode }) => (
  <Badge tone="coral" icon={<TriangleAlert className="size-3.5" />}>{children}</Badge>
)
