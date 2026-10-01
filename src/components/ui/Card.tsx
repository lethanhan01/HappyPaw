import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cn'

export function Card({ className, children, onClick, hover, ...p }: { className?: string; children: ReactNode; onClick?: () => void; hover?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...p} onClick={onClick}
      className={cx('rounded-[24px] border-2 border-line bg-paper p-5 shadow-soft', (hover || onClick) && 'cursor-pointer transition hover:-translate-y-1 hover:border-brown', className)}>
      {children}
    </div>
  )
}
