import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cx } from "@/lib/cn"

export type BtnVariant = "primary" | "secondary" | "soft" | "danger" | "ghost" | "dark" | "outline" | "success"
export type BtnSize = "sm" | "md" | "lg"

const btnV: Record<BtnVariant, string> = {
  primary:
    "bg-butter text-brown border-brown shadow-[0_4px_0_var(--color-brown)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--color-brown)] active:translate-y-1 active:shadow-none",
  secondary:
    "bg-paper text-brown border-brown shadow-[0_4px_0_var(--color-brown)] hover:-translate-y-0.5 hover:bg-white active:translate-y-1 active:shadow-none",
  outline:
    "bg-paper text-brown border-line hover:border-brown active:translate-y-0.5",
  soft: "bg-cream-2 text-brown border-transparent hover:bg-peach active:scale-[0.98]",
  danger:
    "bg-coral text-white border-brown shadow-[0_4px_0_var(--color-brown)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none",
  success:
    "bg-sage-2 text-white border-brown shadow-[0_4px_0_var(--color-brown)] hover:-translate-y-0.5 hover:bg-sage-hover active:translate-y-1 active:shadow-none",
  dark: "bg-ink text-white border-ink hover:bg-brown active:scale-[0.98]",
  ghost:
    "bg-transparent text-brown border-transparent hover:bg-brown/10 active:scale-[0.98]",
}

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  pill?: boolean
  full?: boolean
  icon?: ReactNode
}

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(function Btn(
  {
    variant = "primary",
    size = "md",
    pill,
    full,
    icon,
    className,
    children,
    ...p
  },
  ref,
) {
  return (
    <button
      ref={ref}
      {...p}
      className={cx(
        "inline-flex items-center justify-center gap-2 border-2 font-bold whitespace-nowrap transition duration-150 disabled:opacity-45 disabled:shadow-none disabled:translate-y-0 disabled:hover:translate-y-0",
        size === "sm" && "h-9 px-3.5 text-sm",
        size === "md" && "h-11 px-5 text-[15px]",
        size === "lg" && "h-14 px-7 text-lg",
        pill ? "rounded-full" : "rounded-2xl",
        full && "w-full",
        btnV[variant],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
})

export type IconBtnVariant = "default" | "ghost" | "soft" | "primary" | "danger"

const iconV: Record<IconBtnVariant, string> = {
  default:
    "border-2 border-brown/20 bg-paper text-brown hover:border-brown hover:bg-white",
  ghost: "border-transparent bg-transparent text-brown hover:bg-brown/10",
  soft: "border-transparent bg-cream-2 text-brown hover:bg-peach",
  primary:
    "border-2 border-brown bg-butter text-brown shadow-[0_3px_0_var(--color-brown)] hover:-translate-y-0.5",
  danger:
    "border-2 border-brown bg-coral text-white shadow-[0_3px_0_var(--color-brown)] hover:-translate-y-0.5",
}

export interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  size?: "sm" | "md" | "lg"
  variant?: IconBtnVariant
}

export const IconBtn = forwardRef<HTMLButtonElement, IconBtnProps>(
  function IconBtn(
    { label, size = "md", variant = "default", className, children, ...p },
    ref,
  ) {
    const accessibleLabel = label || p["aria-label"] as string || undefined
    const isCustomPos =
      className?.includes("absolute") ||
      className?.includes("fixed") ||
      className?.includes("static")

    return (
      <button
        ref={ref}
        {...p}
        aria-label={accessibleLabel}
        title={accessibleLabel}
        className={cx(
          "grid shrink-0 place-items-center transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none",
          !isCustomPos && "relative",
          size === "sm" && "size-8 sm:size-9 rounded-xl",
          size === "md" && "size-11 rounded-2xl",
          size === "lg" && "size-14 rounded-2xl",
          iconV[variant],
          className,
        )}
      >
        {children}
      </button>
    )
  },
)

export interface NavBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export const NavBtn = forwardRef<HTMLButtonElement, NavBtnProps>(
  function NavBtn({ className, type = "button", ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={className}
        {...props}
      />
    )
  },
)

