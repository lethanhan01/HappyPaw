import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react"
import {
  Plus,
  Minus,
  LocateFixed,
  ChevronDown,
  ChevronUp,
  PawPrint,
} from "lucide-react"
import type { Case, Clinic, Risk, Shelter } from "@/types"
import { DISTRICT_XY } from "@/constants/districts"
import { Btn, IconBtn, cx } from "@ui"

export const ME_POS = { x: 345, y: 285 }
export const KM = 62 // map units per km

export type PinKind = "case" | "shelter" | "clinic" | "risk"
export interface Sel {
  kind: PinKind
  id: string
}

/** The five pin types of the public map. Icon + shape + colour so meaning never relies on colour alone. */
export type PinType = "rescue" | "lost" | "shelter" | "clinic" | "warning"
export const PIN_META: Record<PinType, {
  color: string
  label: string
  shape: "drop" | "square" | "tri"
}> = {
  rescue: { color: "#d8503f", label: "Cần cứu hộ", shape: "drop" },
  lost: { color: "#e8892c", label: "Pet thất lạc", shape: "drop" },
  shelter: { color: "#6fae5c", label: "Mái ấm", shape: "square" },
  clinic: { color: "#4f93b5", label: "Phòng khám", shape: "square" },
  warning: { color: "#8a63ab", label: "Cảnh báo", shape: "tri" },
}
export const caseType = (c: Case): PinType =>
  c.type === "rescue" ? "rescue" : "lost"

function PawG({ s = 1, fill = "#fff" }: { s?: number; fill?: string }) {
  return (
    <g transform={`scale(${s})`} fill={fill}>
      <ellipse
        cx="-8"
        cy="-3"
        rx="2.6"
        ry="3.4"
        transform="rotate(-20 -8 -3)"
      />
      <ellipse
        cx="-3.2"
        cy="-8"
        rx="2.6"
        ry="3.5"
        transform="rotate(-6 -3.2 -8)"
      />
      <ellipse
        cx="3.2"
        cy="-8"
        rx="2.6"
        ry="3.5"
        transform="rotate(6 3.2 -8)"
      />
      <ellipse cx="8" cy="-3" rx="2.6" ry="3.4" transform="rotate(20 8 -3)" />
      <path d="M0 -1.5c-4 0-8 4.5-8 7.6 0 2.4 2 3.4 3.6 3.4 1.5 0 2.6-.7 4.4-.7s2.9.7 4.4.7c1.6 0 3.6-1 3.6-3.4 0-3.1-4-7.6-8-7.6z" />
    </g>
  )
}

const SHAPE = {
  drop: {
    d: "M0 0C-6 -8 -18 -16 -18 -30A18 18 0 1 1 18 -30C18 -16 6 -8 0 0Z",
    gy: -30,
  },
  square: {
    d: "M0 0L-6 -9H-12A6 6 0 0 1 -18 -15V-43A6 6 0 0 1 -12 -49H12A6 6 0 0 1 18 -43V-15A6 6 0 0 1 12 -9H6Z",
    gy: -29,
  },
  tri: { d: "M0 0L-6 -7L-21 -7L0 -47L21 -7L6 -7Z", gy: -22 },
}
const TEAR = SHAPE.drop.d

function Glyph({ type, color }: { type: PinType; color: string }) {
  switch (type) {
    case "rescue":
      return <PawG s={1} />
    case "lost":
      return (
        <g>
          <circle
            cx={-2}
            cy={-2}
            r={7}
            fill="none"
            stroke="#fff"
            strokeWidth={3}
          />
          <path
            d="M3 3 L9 9"
            stroke="#fff"
            strokeWidth={3.4}
            strokeLinecap="round"
          />
          <g transform="translate(-2 -1.5)">
            <PawG s={0.4} />
          </g>
        </g>
      )
    case "shelter":
      return (
        <g>
          <path
            d="M-10 4V-3L0 -11L10 -3V4Z"
            fill="#fff"
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <g transform="translate(0 0.5)">
            <PawG s={0.42} fill={color} />
          </g>
        </g>
      )
    case "clinic":
      return (
        <path
          d="M-3.5 -10h7v6.5h6.5v7h-6.5v6.5h-7v-6.5h-6.5v-7h6.5z"
          fill="#fff"
          stroke="#fff"
          strokeWidth={1}
          strokeLinejoin="round"
        />
      )
    default:
      return (
        <g>
          <rect x={-2} y={-11} width={4} height={10} rx={2} fill="#fff" />
          <circle cy={5} r={2.3} fill="#fff" />
        </g>
      )
  }
}

export function Pin({
  x,
  y,
  k,
  type = "rescue",
  selected,
  hovered,
  onClick,
  onHover,
  label,
  sub,
  pulse,
  progress,
}: {
  x: number
  y: number
  k: number
  type?: PinType
  selected?: boolean
  hovered?: boolean
  onClick?: () => void
  onHover?: (h: boolean) => void
  label?: string
  sub?: string
  pulse?: boolean
  progress?: boolean
}) {
  const m = PIN_META[type]
  const sh = SHAPE[m.shape]
  const s = selected ? 1.22 : hovered ? 0.95 : 0.74
  const tw = Math.max((label?.length ?? 0) * 6.6, (sub?.length ?? 0) * 5.8) + 22
  return (
    <g
      transform={`translate(${x} ${y}) scale(${1 / k})`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerEnter={() => onHover?.(true)}
      onPointerLeave={() => onHover?.(false)}
      style={{ cursor: onClick ? "pointer" : "default" }}
      role={onClick ? "button" : undefined}
      aria-label={label}
    >
      {pulse && (
        <circle
          cy={sh.gy * s}
          r={16}
          fill={m.color}
          opacity={0.35}
          pointerEvents="none"
        >
          <animate
            attributeName="r"
            values="14;30"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.35;0"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <g transform={`scale(${s})`} style={{ transition: "transform .15s" }}>
        <ellipse cy={1} rx={8} ry={2.6} fill="#6b4128" opacity={0.22} />
        {selected && <circle cy={sh.gy} r={27} fill="#fff27a" opacity={0.65} />}
        <path
          d={sh.d}
          fill={m.color}
          stroke="#6b4128"
          strokeWidth={3.2}
          strokeLinejoin="round"
        />
        <g transform={`translate(0 ${sh.gy})`}>
          <Glyph type={type} color={m.color} />
        </g>
        {progress && (
          <g transform="translate(15 -46)">
            <circle r={9} fill="#f6e04d" stroke="#6b4128" strokeWidth={2.4} />
            <path
              d="M0 -4.5V0.5L3.5 2.5"
              fill="none"
              stroke="#6b4128"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>
      {hovered && !selected && label && (
        <g transform={`translate(0 ${-(50 * s) - 12})`} pointerEvents="none">
          <rect
            x={-tw / 2}
            y={sub ? -36 : -24}
            width={tw}
            height={sub ? 38 : 26}
            rx={11}
            fill="#fffaf0"
            stroke="#6b4128"
            strokeWidth={2}
          />
          <text
            y={sub ? -19 : -6}
            textAnchor="middle"
            fontSize={12.5}
            fontWeight={800}
            fill="#6b4128"
            fontFamily="Nunito, sans-serif"
          >
            {label}
          </text>
          {sub && (
            <text
              y={-5}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill="#8f6a55"
              fontFamily="Nunito, sans-serif"
            >
              {sub}
            </text>
          )}
        </g>
      )}
    </g>
  )
}

function hashOff(id: string) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 997
  return [(h % 24) - 12, ((h >> 3) % 24) - 12]
}
const ago = (m: number) =>
  m < 60
    ? `${m} phút trước`
    : m < 1440
      ? `${Math.round(m / 60)} giờ trước`
      : `${Math.round(m / 1440)} ngày trước`

export interface MapApi {
  zoom: (f: number) => void
  locate: () => void
  focus: (x: number, y: number, k?: number) => void
}

export interface CityMapProps {
  className?: string
  cases?: Case[]
  shelters?: Shelter[]
  clinics?: Clinic[]
  risks?: Risk[]
  selected?: Sel | null
  onSelect?: (s: Sel | null) => void
  radius?: { x: number; y: number; km: number } | null
  route?: { x: number; y: number }[]
  trail?: { x: number; y: number; t: string }[]
  predicted?: { x: number; y: number; r: number } | null
  me?: { x: number; y: number } | null
  dest?: { x: number; y: number; label?: string } | null
  revealIds?: string[]
  center?: { x: number; y: number; k?: number }
  onMapClick?: (x: number, y: number) => void
  dropPin?: { x: number; y: number } | null
  extras?: ReactNode
  controlsClass?: string
  loading?: boolean
  showLabels?: boolean
  hoverId?: string | null
  onHover?: (id: string | null) => void
  controls?: boolean
  apiRef?: MutableRefObject<MapApi | null>
  focusKey?: string
}

export default function CityMap(p: CityMapProps) {
  const { center = { x: 450, y: 340, k: 1 } } = p
  const k0 = center.k ?? 1
  const [hov, setHov] = useState<string | null>(null)
  const [v, setV] = useState({
    k: k0,
    tx: 500 - center.x * k0,
    ty: 360 - center.y * k0,
  })
  const svg = useRef<SVGSVGElement>(null)
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null)

  const recenter = useCallback((c: { x: number; y: number; k?: number }) => {
    const k = c.k ?? 1.4
    setV({ k, tx: 500 - c.x * k, ty: 360 - c.y * k })
  }, [])
  useEffect(() => {
    recenter(center) /* eslint-disable-next-line */
  }, [p.focusKey])

  const pt = (e: { clientX: number; clientY: number }) => {
    const s = svg.current!
    const m = s.getScreenCTM()!.inverse()
    const q = s.createSVGPoint()
    q.x = e.clientX
    q.y = e.clientY
    const r = q.matrixTransform(m)
    return { x: r.x, y: r.y }
  }
  const zoomAt = (f: number) =>
    setV((o) => {
      const k = Math.min(3.2, Math.max(0.75, o.k * f))
      const r = k / o.k
      return { k, tx: 500 - (500 - o.tx) * r, ty: 360 - (360 - o.ty) * r }
    })

  useEffect(() => {
    if (p.apiRef)
      p.apiRef.current = {
        zoom: zoomAt,
        locate: () => recenter({ ...(p.me || ME_POS), k: 1.5 }),
        focus: (x, y, kk) => recenter({ x, y, k: kk }),
      }
  })
  const k = v.k
  const sel = p.selected
  const hoverNow = p.hoverId ?? hov
  const setHover = (id: string, h: boolean) => {
    setHov(h ? id : null)
    p.onHover?.(h ? id : null)
  }
  const caseMap = p.cases || []

  return (
    <div className={cx("relative overflow-hidden bg-map-sand", p.className)}>
      <svg
        ref={svg}
        viewBox="0 0 1000 720"
        preserveAspectRatio="xMidYMid slice"
        className="map-grab size-full select-none"
        onPointerDown={(e) => {
          drag.current = { ...pt(e), moved: false }
          ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          const q = pt(e)
          const dx = q.x - drag.current.x
          const dy = q.y - drag.current.y
          if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true
          if (drag.current.moved) {
            drag.current.x = q.x
            drag.current.y = q.y
            setV((o) => ({ ...o, tx: o.tx + dx, ty: o.ty + dy }))
          }
        }}
        onPointerUp={(e) => {
          const d = drag.current
          drag.current = null
          if (d && !d.moved) {
            const q = pt(e)
            if (p.onMapClick)
              p.onMapClick((q.x - v.tx) / v.k, (q.y - v.ty) / v.k)
            else p.onSelect?.(null)
          }
        }}
        onWheel={(e) => zoomAt(e.deltaY < 0 ? 1.12 : 0.89)}
      >
        <defs>
          <pattern
            id="blocks"
            width="38"
            height="38"
            patternUnits="userSpaceOnUse"
          >
            <rect width="38" height="38" fill="#efe5c4" />
            <rect x="3" y="3" width="32" height="32" rx="9" fill="#f8f1da" />
          </pattern>
          <pattern
            id="stripe"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="4" height="8" fill="#d8503f" opacity=".16" />
          </pattern>
        </defs>
        <g transform={`translate(${v.tx} ${v.ty}) scale(${k})`}>
          <rect
            x="-600"
            y="-500"
            width="2200"
            height="1800"
            fill="url(#blocks)"
          />
          {/* water */}
          <path
            d="M760 -200 C 820 100, 735 300, 800 430 S 850 700, 810 950"
            fill="none"
            stroke="#d3e7ee"
            strokeWidth="78"
            strokeLinecap="round"
          />
          <path
            d="M760 -200 C 820 100, 735 300, 800 430 S 850 700, 810 950"
            fill="none"
            stroke="#c4dfe9"
            strokeWidth="6"
            strokeDasharray="2 14"
            strokeLinecap="round"
          />
          <ellipse
            cx="540"
            cy="92"
            rx="92"
            ry="46"
            fill="#d3e7ee"
            stroke="#c0dce7"
            strokeWidth="4"
          />
          <ellipse cx="618" cy="352" rx="13" ry="22" fill="#d3e7ee" />
          <ellipse cx="590" cy="440" rx="22" ry="14" fill="#d3e7ee" />
          <ellipse cx="615" cy="650" rx="40" ry="22" fill="#d3e7ee" />
          <ellipse cx="445" cy="340" rx="20" ry="11" fill="#d3e7ee" />
          {/* parks */}
          {[
            [400, 305, 30, 18],
            [520, 212, 34, 20],
            [300, 315, 26, 16],
            [280, 175, 40, 24],
            [705, 690, 46, 24],
            [690, 520, 28, 18],
            [160, 420, 34, 22],
            [440, 560, 28, 18],
          ].map(([x, y, rx, ry], i) => (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              fill="#d6e6c3"
              stroke="#c4daad"
              strokeWidth="3"
            />
          ))}
          {/* roads */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {[
              "M250 570 C 200 400, 260 250, 400 200 S 690 210, 730 380 S 630 650, 470 650 S 280 650, 250 570",
              "M120 580 C 60 380, 120 170, 330 70 S 690 30, 740 120",
              "M150 640 C 330 720, 560 740, 760 660",
              "M60 330 C 220 340, 420 360, 740 340",
              "M580 -20 C 570 150, 600 300, 610 420 S 590 600, 620 760",
              "M180 740 C 260 620, 340 520, 470 400 S 600 300, 650 250",
              "M300 -20 C 300 120, 320 220, 380 330 S 450 480, 470 740",
              "M440 100 C 470 180, 480 260, 560 330",
            ].map((d, i) => (
              <g key={i}>
                <path d={d} stroke="#ead9ae" strokeWidth={i < 3 ? 17 : 14} />
                <path d={d} stroke="#fffdf4" strokeWidth={i < 3 ? 11 : 8} />
              </g>
            ))}
            {[
              [690, 66, 860, 78],
              [740, 330, 860, 330],
              [740, 470, 860, 480],
            ].map(([a, b, c, d], i) => (
              <path
                key={i}
                d={`M${a} ${b} L${c} ${d}`}
                stroke="#ead9ae"
                strokeWidth="11"
              />
            ))}
            {[
              [690, 66, 860, 78],
              [740, 330, 860, 330],
              [740, 470, 860, 480],
            ].map(([a, b, c, d], i) => (
              <path
                key={i}
                d={`M${a} ${b} L${c} ${d}`}
                stroke="#fffdf4"
                strokeWidth="6"
              />
            ))}
          </g>
          {p.showLabels !== false && (
            <g
              fontFamily="Nunito, sans-serif"
              fontWeight="800"
              textAnchor="middle"
              fill="#8f6a55"
              pointerEvents="none"
            >
              {Object.entries(DISTRICT_XY).map(([n, [x, y]]) => (
                <text
                  key={n}
                  x={n === "Tây Hồ" ? 690 : x}
                  y={
                    n === "Tây Hồ"
                      ? 170
                      : y +
                        (n === "Hoàn Kiếm"
                          ? 50
                          : n === "Cầu Giấy"
                            ? -45
                            : n === "Ba Đình"
                              ? -38
                              : -50)
                  }
                  fontSize={13 / Math.min(k, 1.3)}
                  opacity={0.75}
                  letterSpacing=".04em"
                >
                  {n.toUpperCase()}
                </text>
              ))}
              <text
                x="540"
                y="96"
                fontSize="11"
                fill="#4f93b5"
                fontStyle="italic"
              >
                Hồ Tây
              </text>
              <text
                x="628"
                y="392"
                fontSize="9"
                fill="#4f93b5"
                fontStyle="italic"
              >
                Hồ Gươm
              </text>
              <text
                x="790"
                y="250"
                fontSize="11"
                fill="#4f93b5"
                fontStyle="italic"
                transform="rotate(88 790 250)"
              >
                Sông Hồng
              </text>
            </g>
          )}

          {p.extras}

          {/* risk zones */}
          {(p.risks || []).map((r) => (
            <g
              key={r.id}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                p.onSelect?.({ kind: "risk", id: r.id })
              }}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={r.x}
                cy={r.y}
                r={r.r}
                fill={r.severity === "Cao" ? "#d8503f" : "#8a63ab"}
                opacity={sel?.id === r.id ? 0.3 : 0.17}
              />
              <circle cx={r.x} cy={r.y} r={r.r} fill="url(#stripe)" />
              <circle
                cx={r.x}
                cy={r.y}
                r={r.r}
                fill="none"
                stroke={r.severity === "Cao" ? "#d8503f" : "#8a63ab"}
                strokeWidth={2.5}
                strokeDasharray="7 6"
              />
            </g>
          ))}

          {/* radius circle */}
          {p.radius && (
            <g pointerEvents="none">
              <circle
                cx={p.radius.x}
                cy={p.radius.y}
                r={p.radius.km * KM}
                fill="#f6e04d"
                opacity=".18"
              />
              <circle
                cx={p.radius.x}
                cy={p.radius.y}
                r={p.radius.km * KM}
                fill="none"
                stroke="#6b4128"
                strokeWidth={2.2}
                strokeDasharray="6 6"
              />
            </g>
          )}

          {/* predicted area */}
          {p.predicted && (
            <g pointerEvents="none">
              <circle
                cx={p.predicted.x}
                cy={p.predicted.y}
                r={p.predicted.r}
                fill="#fff27a"
                opacity=".35"
              />
              <circle
                cx={p.predicted.x}
                cy={p.predicted.y}
                r={p.predicted.r}
                fill="none"
                stroke="#e8892c"
                strokeWidth={2.5}
                strokeDasharray="5 5"
              />
            </g>
          )}

          {/* trail */}
          {p.trail && p.trail.length > 1 && (
            <g pointerEvents="none">
              <path
                d={p.trail
                  .map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x} ${pt.y}`)
                  .join(" ")}
                fill="none"
                stroke="#6b4128"
                strokeWidth={3}
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              {p.trail.map((pt, i) => (
                <g
                  key={i}
                  transform={`translate(${pt.x} ${pt.y}) scale(${1 / k})`}
                >
                  <circle
                    r={6}
                    fill="#fff27a"
                    stroke="#6b4128"
                    strokeWidth={2.4}
                  />
                  <text
                    y={-10}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={800}
                    fill="#6b4128"
                    fontFamily="Nunito, sans-serif"
                  >
                    {pt.t}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* route */}
          {p.route && p.route.length > 1 && (
            <path
              d={p.route
                .map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x} ${pt.y}`)
                .join(" ")}
              fill="none"
              stroke="#3f82a5"
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="8 8"
              pointerEvents="none"
            />
          )}

          {/* pins sorted so selected/hovered is on top */}
          {(() => {
            const items: { id: string; node: (h: boolean) => ReactNode }[] = []
            for (const s of p.shelters || []) {
              items.push({
                id: s.id,
                node: (h) => (
                  <Pin
                    key={s.id}
                    x={s.x}
                    y={s.y}
                    k={k}
                    type="shelter"
                    selected={sel?.id === s.id}
                    hovered={h}
                    label={s.name}
                    sub={`Mái ấm · ${s.district}`}
                    onClick={() => p.onSelect?.({ kind: "shelter", id: s.id })}
                    onHover={(x) => setHover(s.id, x)}
                  />
                ),
              })
            }
            for (const s2 of p.clinics || []) {
              items.push({
                id: s2.id,
                node: (h) => (
                  <Pin
                    key={s2.id}
                    x={s2.x}
                    y={s2.y}
                    k={k}
                    type="clinic"
                    selected={sel?.id === s2.id}
                    hovered={h}
                    label={s2.name}
                    sub={`Phòng khám · ${s2.district}`}
                    onClick={() => p.onSelect?.({ kind: "clinic", id: s2.id })}
                    onHover={(x) => setHover(s2.id, x)}
                  />
                ),
              })
            }
            for (const c of caseMap) {
              if (
                c.critical &&
                c.status === "active" &&
                !(p.revealIds || []).includes(c.id)
              ) {
                const [ox, oy] = hashOff(c.id)
                items.push({
                  id: c.id,
                  node: (h) => (
                    <g key={c.id}>
                      <circle
                        cx={c.x + ox}
                        cy={c.y + oy}
                        r={40}
                        fill="#d8503f"
                        opacity={sel?.id === c.id || h ? 0.3 : 0.16}
                        pointerEvents="none"
                      />
                      <circle
                        cx={c.x + ox}
                        cy={c.y + oy}
                        r={40}
                        fill="none"
                        stroke="#d8503f"
                        strokeWidth={2}
                        strokeDasharray="3 7"
                        strokeLinecap="round"
                        pointerEvents="none"
                      />
                      <Pin
                        x={c.x + ox}
                        y={c.y + oy}
                        k={k}
                        type="rescue"
                        pulse
                        selected={sel?.id === c.id}
                        hovered={h}
                        label={`${c.name} · khu vực xấp xỉ`}
                        sub={`Cần cứu hộ · ${ago(c.minutesAgo)}`}
                        onClick={() => p.onSelect?.({ kind: "case", id: c.id })}
                        onHover={(x) => setHover(c.id, x)}
                      />
                    </g>
                  ),
                })
              } else {
                const prog = c.status === "progress" || c.status === "pending"
                items.push({
                  id: c.id,
                  node: (h) => (
                    <Pin
                      key={c.id}
                      x={c.x}
                      y={c.y}
                      k={k}
                      type={caseType(c)}
                      progress={prog}
                      selected={sel?.id === c.id}
                      hovered={h || p.hoverId === c.id}
                      label={`${c.name} · ${c.district}`}
                      sub={`${
                        prog ? "Đang xử lý" : PIN_META[caseType(c)].label
                      } · ${ago(c.minutesAgo)}`}
                      onClick={() => p.onSelect?.({ kind: "case", id: c.id })}
                      onHover={(x) => setHover(c.id, x)}
                    />
                  ),
                })
              }
            }
            const top = (id: string) =>
              sel?.id === id ? 2 : hoverNow === id ? 1 : 0
            return items
              .sort((a2, b2) => top(a2.id) - top(b2.id))
              .map((it) => it.node(hoverNow === it.id))
          })()}

          {p.dest && (
            <g transform={`translate(${p.dest.x} ${p.dest.y}) scale(${1 / k})`}>
              <path
                d={TEAR}
                fill="#a9cc94"
                stroke="#6b4128"
                strokeWidth="3.5"
              />
              <g transform="translate(0 -30)">
                <path
                  d="M-9 1 V-4 L0 -11 L9 -4 V1Z"
                  fill="#fff"
                  stroke="#6b4128"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          )}
          {p.dropPin && (
            <Pin x={p.dropPin.x} y={p.dropPin.y} k={k} type="lost" selected />
          )}
          {p.me && (
            <g
              transform={`translate(${p.me.x} ${p.me.y}) scale(${1 / k})`}
              pointerEvents="none"
            >
              <circle r={22} fill="#4f93b5" opacity=".2">
                <animate
                  attributeName="r"
                  values="10;28"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r={9} fill="#3f82a5" stroke="#fff" strokeWidth={3.5} />
            </g>
          )}
        </g>
      </svg>

      {p.controls !== false && (
        <div
          className={cx(
            "absolute bottom-4 right-4 z-10 flex flex-col gap-2",
            p.controlsClass,
          )}
        >
          <IconBtn
            label="Phóng to"
            variant="default"
            size="md"
            onClick={() => zoomAt(1.3)}
            className="shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            <Plus className="size-5" />
          </IconBtn>
          <IconBtn
            label="Thu nhỏ"
            variant="default"
            size="md"
            onClick={() => zoomAt(0.77)}
            className="shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            <Minus className="size-5" />
          </IconBtn>
          <IconBtn
            label="Vị trí hiện tại"
            variant="primary"
            size="md"
            onClick={() => recenter({ ...(p.me || ME_POS), k: 1.5 })}
            className="shadow-[0_3px_0_var(--color-brown)] active:translate-y-0.5 active:shadow-none"
          >
            <LocateFixed className="size-5" />
          </IconBtn>
        </div>
      )}

      {p.loading && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-cream/85">
          <div className="flex flex-col items-center gap-2 font-extrabold text-brown">
            <PawPrint className="size-10 text-terracotta animate-bounce-soft" />
            Đang tải bản đồ…
          </div>
        </div>
      )}
    </div>
  )
}

const LEGEND: PinType[] = ["rescue", "lost", "shelter", "clinic", "warning"]
export function LegendSwatch({ type }: { type: PinType }) {
  const m = PIN_META[type]
  return (
    <span
      aria-hidden
      className={cx(
        "inline-block size-3.5 border-2 border-brown",
        m.shape === "drop" && "rounded-full",
        m.shape === "square" && "rounded-[4px]",
        m.shape === "tri" &&
          "rounded-[3px] [clip-path:polygon(50%_0,100%_100%,0_100%)]",
      )}
      style={{ background: m.color }}
    />
  )
}
/** Collapsible legend with exactly the five pin types. Optional `hidden` + `onToggle` turn rows into layer toggles. */
export function MapLegend({
  className,
  defaultOpen = true,
  hidden = [],
  onToggle,
}: {
  className?: string
  defaultOpen?: boolean
  hidden?: PinType[]
  onToggle?: (t: PinType) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className={cx(
        "rounded-2xl border-2 border-line bg-paper/95 text-xs font-bold shadow-soft",
        className,
      )}
    >
      <Btn
        variant="ghost"
        size="sm"
        full
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="!justify-between !min-h-9 !px-3 !py-1.5 font-extrabold !border-0 hover:!bg-butter/30"
      >
        Chú giải
        {open ? (
          <ChevronUp className="size-3.5" />
        ) : (
          <ChevronDown className="size-3.5" />
        )}
      </Btn>
      {open && (
        <ul className="space-y-0.5 px-1.5 pb-1.5">
          {LEGEND.map((t) => {
            const off = hidden.includes(t)
            const row = (
              <>
                <LegendSwatch type={t} />
                <span className={cx(off && "line-through opacity-50")}>
                  {PIN_META[t].label}
                </span>
              </>
            )
            return (
              <li key={t}>
                {onToggle ? (
                  <Btn
                    variant="ghost"
                    size="sm"
                    full
                    onClick={() => onToggle(t)}
                    aria-pressed={!off}
                    className="!justify-start !min-h-8 !border-0 !px-1.5 rounded-xl hover:!bg-butter/50 font-normal"
                  >
                    {row}
                  </Btn>
                ) : (
                  <span className="flex min-h-7 items-center gap-2 px-1.5">
                    {row}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export const kmFrom = (x: number, y: number, from = ME_POS) =>
  Math.round((Math.hypot(x - from.x, y - from.y) / KM) * 10) / 10
