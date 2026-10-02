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
  size = "page",
  className,
}: {
  title: ReactNode
  sub?: ReactNode
  right?: ReactNode
  back?: () => void
  size?: "page" | "section" | "sm"
  className?: string
}) {
  return (
    <div
      className={cx(
        "flex flex-wrap items-end justify-between gap-3",
        size === "page" ? "mb-5" : size === "section" ? "mb-3" : "mb-4",
        className,
      )}
    >
      <div className="min-w-0">
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
        {typeof title === "string" ? (
          size === "page" ? (
            <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl text-brown">
              {title}
            </h1>
          ) : size === "sm" ? (
            <h1 className="font-display text-xl font-black leading-tight text-brown md:text-2xl">
              {title}
            </h1>
          ) : (
            <h2 className="font-display text-2xl font-extrabold leading-tight text-brown">
              {title}
            </h2>
          )
        ) : (
          title
        )}
        {sub && (
          <div className="mt-0.5 text-sm font-semibold text-brown-soft">
            {sub}
          </div>
        )}
      </div>
      {right && (
        <div className="flex flex-wrap items-center gap-2">{right}</div>
      )}
    </div>
  )
}

// Aliases for backward compatibility
export const Title = (props: {
  title: string
  sub?: string
  right?: ReactNode
  back?: () => void
  className?: string
}) => <PageHead {...props} size="sm" />

export const SectionTitle = ({
  children,
  sub,
  right,
  className,
}: {
  children: ReactNode
  sub?: string
  right?: ReactNode
  className?: string
}) => <PageHead title={children} sub={sub} right={right} size="section" className={className} />

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
