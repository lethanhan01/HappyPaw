import { useEffect, useRef, useState, type ReactNode } from "react"
import { MoreVertical } from "lucide-react"
import { cx } from "@/lib/cn"
import { Btn, IconBtn } from "./Button"

export interface MenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}

export interface ActionMenuProps {
  items: MenuItem[]
  label?: string
  className?: string
}

export function ActionMenu({
  items,
  label = "Hành động",
  className,
}: ActionMenuProps) {
  const [pos, setPos] = useState<{ x: number; y: number; up: boolean } | null>(
    null,
  )
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!pos) return
    const close = () => setPos(null)
    window.addEventListener("scroll", close, true)
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("resize", close)
    }
  }, [pos])

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    const r = btn.current!.getBoundingClientRect()
    const up = r.bottom + items.length * 46 + 12 > window.innerHeight
    setPos({
      x: Math.max(8, Math.min(window.innerWidth - 184, r.right - 176)),
      y: up ? r.top - 4 : r.bottom + 4,
      up,
    })
  }

  return (
    <>
      <IconBtn
        variant="default"
        size="sm"
        ref={btn}
        onClick={openMenu}
        label={label}
        aria-haspopup="menu"
        className={cx("size-11 sm:size-9", className)}
      >
        <MoreVertical className="size-4" />
      </IconBtn>
      {pos && (
        <div
          className="fixed inset-0 z-[90]"
          onClick={(e) => {
            e.stopPropagation()
            setPos(null)
          }}
        >
          <div
            role="menu"
            style={{
              left: pos.x,
              top: pos.y,
              transform: pos.up ? "translateY(-100%)" : undefined,
            }}
            className="absolute w-48 rounded-2xl border-2 border-brown bg-paper p-1.5 shadow-xl animate-[pop_.15s_ease-out]"
          >
            {items.map((it) => (
              <Btn
                key={it.label}
                variant="ghost"
                size="sm"
                role="menuitem"
                disabled={it.disabled}
                onClick={(e) => {
                  e.stopPropagation()
                  setPos(null)
                  it.onClick()
                }}
                className={cx(
                  "flex min-h-11 w-full items-center justify-start gap-2.5 rounded-xl px-3 text-left text-sm font-bold hover:bg-butter/40 disabled:opacity-40 disabled:hover:bg-transparent md:min-h-9 [&_svg]:size-4",
                  it.danger && "text-coral hover:bg-coral-soft",
                )}
              >
                {it.icon}
                {it.label}
              </Btn>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
