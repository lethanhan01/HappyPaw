import type { ReactNode } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cx } from "@/lib/cn"
import { Card } from "./Card"

export interface StatCardProps {
  icon: ReactNode
  label: string
  value: ReactNode
  delta?: number
  goodWhenUp?: boolean
  hint?: string
  onClick?: () => void
  tone?: string
  className?: string
}

export function StatCard({
  icon,
  label,
  value,
  delta,
  goodWhenUp = true,
  hint,
  onClick,
  tone = "bg-cream-2 text-brown",
  className,
}: StatCardProps) {
  const good =
    delta === undefined || delta === 0 ? null : delta > 0 === goodWhenUp

  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={cx(
        "min-w-0 !p-3.5 sm:!p-4 text-left transition duration-150",
        onClick && "cursor-pointer active:translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cx(
            "grid size-8 shrink-0 place-items-center rounded-xl border border-brown/20 [&_svg]:size-4",
            tone,
          )}
        >
          {icon}
        </span>
        <span className="truncate text-xs font-extrabold uppercase tracking-wide text-brown-soft">
          {label}
        </span>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="font-display text-[26px] font-black text-brown leading-none">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={cx(
              "inline-flex items-center gap-0.5 text-[11px] font-extrabold px-1.5 py-0.5 rounded-full",
              good === null
                ? "text-brown-soft bg-cream-2"
                : good
                  ? "text-sage-dark bg-sage-soft"
                  : "text-coral-dark bg-coral-soft",
            )}
          >
            {delta >= 0 ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 line-clamp-1 text-xs text-brown-soft font-semibold">
          {hint}
        </p>
      )}
    </Card>
  )
}

export function StatRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx("mb-4 grid grid-cols-2 gap-2.5 md:grid-cols-4", className)}
    >
      {children}
    </div>
  )
}

// Aliases for backward compatibility with KpiCard & KpiRow
export const KpiCard = StatCard
export const KpiRow = StatRow
