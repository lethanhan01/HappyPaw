import { useRef, useState, type ReactNode } from "react"
import { cx } from "@/lib/cn"

/** Draggable sheet with three snap points (peek / half / full) inside a relatively positioned parent. */
export function BottomSheet({
  snap,
  onSnap,
  peek = 150,
  header,
  children,
  className,
}: {
  snap: 0 | 1 | 2
  onSnap: (s: 0 | 1 | 2) => void
  peek?: number
  header: ReactNode
  children?: ReactNode
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const start = useRef<{ y: number h: number moved: boolean } | null>(null)
  const [drag, setDrag] = useState<number | null>(null)

  const heights = () => {
    const H = box.current?.parentElement?.clientHeight ?? 640
    return [peek, Math.round(H * 0.56), H - 6]
  }

  const h = drag ?? heights()[snap]

  return (
    <div
      ref={box}
      style={{ height: h }}
      className={cx(
        "absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[28px] border-2 border-b-0 border-brown bg-cream shadow-[0_-8px_30px_-12px_rgba(107,65,40,.45)]",
        drag === null && "transition-[height] duration-300",
        className,
      )}
    >
      <div
        className="touch-none select-none"
        onPointerDown={(e) => {
          ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
          start.current = { y: e.clientY, h: heights()[snap], moved: false }
        }}
        onPointerMove={(e) => {
          const s = start.current
          if (!s) return
          const dy = s.y - e.clientY
          if (Math.abs(dy) > 5) s.moved = true
          if (s.moved) {
            const hs = heights()
            setDrag(Math.min(hs[2], Math.max(hs[0], s.h + dy)))
          }
        }}
        onPointerUp={() => {
          const s = start.current
          start.current = null
          if (!s) return
          if (!s.moved) {
            onSnap(snap === 0 ? 1 : 0)
            return
          }
          const hs = heights()
          const cur = drag ?? hs[snap]
          const dirUp = cur > s.h
          let next = hs
            .map((v, i) => [Math.abs(v - cur), i] as const)
            .sort((a, b) => a[0] - b[0])[0][1] as 0 | 1 | 2
          if (Math.abs(cur - s.h) > 40 && next === snap) {
            next = (Math.max(
              0,
              Math.min(2, snap + (dirUp ? 1 : -1)),
            ) as 0 | 1 | 2)
          }
          setDrag(null)
          onSnap(next)
        }}
        onPointerCancel={() => {
          start.current = null
          setDrag(null)
        }}
      >
        <div
          role="button"
          aria-label="Kéo để mở rộng hoặc thu gọn"
          className="flex justify-center pb-1 pt-2.5"
        >
          <span className="h-1.5 w-11 rounded-full bg-brown/30" />
        </div>
        {header}
      </div>
      <div
        className={cx(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain",
          snap === 0 && drag === null && "overflow-hidden",
        )}
      >
        {children}
      </div>
    </div>
  )
}
