import type { ReactNode } from "react"
import { cx } from "@/lib/cn"

export interface TimelineItem {
  at: string
  text: ReactNode
  sub?: ReactNode
  icon?: ReactNode
  tone?: "brown" | "butter" | "sage" | "coral" | "sky"
}

export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[]
  className?: string
}) {
  const toneBg = {
    brown: "bg-brown",
    butter: "bg-butter border-2 border-brown",
    sage: "bg-sage border-2 border-brown",
    coral: "bg-coral border-2 border-brown",
    sky: "bg-sky border-2 border-brown",
  }

  return (
    <ol className={cx("space-y-2.5 border-l-2 border-line pl-4", className)}>
      {items.map((t, i) => (
        <li key={i} className="relative text-sm">
          <span
            className={cx(
              "absolute -left-[22px] top-1.5 size-2.5 rounded-full",
              toneBg[t.tone || "brown"],
            )}
          />
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-xs font-extrabold text-brown-soft shrink-0">
              {t.at}
            </span>
            <span className="font-bold text-brown">{t.text}</span>
          </div>
          {t.sub && (
            <p className="mt-0.5 text-xs font-semibold text-brown-soft">
              {t.sub}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}
