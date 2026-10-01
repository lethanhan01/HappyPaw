import type { ReactNode } from "react"
import { Check } from "lucide-react"
import { cx } from "@/lib/cn"
import { Btn } from "./Button"

/* ---------- Stepper ---------- */
export function Stepper({
  steps,
  current,
}: {
  steps: string[]
  current: number
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-extrabold text-brown-soft md:hidden">
        Bước {current + 1}/{steps.length} · {steps[current]}
      </p>
      <ol className="flex items-center gap-1.5">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={cx(
                "grid size-8 shrink-0 place-items-center rounded-full border-2 border-brown font-display text-sm font-extrabold transition-all",
                i < current
                  ? "bg-sage"
                  : i === current
                    ? "scale-110 bg-butter"
                    : "bg-paper text-brown/50 border-brown/30",
              )}
            >
              {i < current ? (
                <Check className="size-4" strokeWidth={3.5} />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={cx(
                "hidden text-sm font-extrabold md:block",
                i === current ? "text-brown" : "text-brown/50",
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <span
                className={cx(
                  "h-1 min-w-3 flex-1 rounded-full",
                  i < current ? "bg-sage" : "bg-line",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ---------- PageHead ---------- */
export function PageHead({
  title,
  sub,
  right,
  back,
}: {
  title: string
  sub?: string
  right?: ReactNode
  back?: () => void
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {back && (
          <Btn
            variant="ghost"
            size="sm"
            onClick={back}
            className="mb-1 !h-auto !px-0 !py-0 text-sm font-extrabold text-brown-soft hover:text-brown"
          >
            ← Quay lại
          </Btn>
        )}
        <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
          {title}
        </h1>
        {sub && <p className="mt-0.5 text-brown-soft">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

/* ---------- Note ---------- */
export const Note = ({
  tone = "butter",
  icon,
  children,
}: {
  tone?: "butter" | "coral" | "sky" | "sage" | "ink"
  icon?: ReactNode
  children: ReactNode
}) => {
  const m = {
    butter: "bg-butter/60 border-butter-2",
    coral: "bg-coral-soft border-coral/40",
    sky: "bg-sky-soft border-sky",
    sage: "bg-sage-soft border-sage",
    ink: "bg-ink text-white border-ink",
  }[tone]
  return (
    <div
      className={cx(
        "flex gap-3 rounded-2xl border-2 p-3.5 text-sm font-semibold",
        m,
      )}
    >
      {icon}
      <div>{children}</div>
    </div>
  )
}
