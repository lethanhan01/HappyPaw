import { useState, type ReactNode } from 'react'
import { Modal, Btn, Stars, Textarea } from '../../ui'
import { useApp } from '../../store'
import { ME_POS } from '../../map'

export function RatingModal({ open, onClose, name }: { open: boolean; onClose: () => void; name?: string }) {
  const { toast } = useApp()
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  const submit = () => {
    toast('Cảm ơn bạn đã gửi đánh giá!')
    setText('')
    onClose()
  }
  return (
    <Modal open={open} onClose={onClose} title="Bạn đánh giá nơi này thế nào?">
      <div className="space-y-4">
        {name && <p className="font-bold text-brown-soft">{name}</p>}
        <Stars value={stars} size={34} onChange={setStars} />
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn…" aria-label="Nội dung đánh giá" />
        <Btn full onClick={submit}>Gửi đánh giá</Btn>
      </div>
    </Modal>
  )
}

export function SectionTitle({ children, sub, right }: { children: ReactNode; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-display text-2xl font-extrabold leading-tight">{children}</h2>
        {sub && <p className="text-sm text-brown-soft">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

/** Simple elbow route from the user's position to a target point on the map. */
export const routeTo = (x: number, y: number) => [ME_POS, { x: ME_POS.x, y }, { x, y }]

/** Deterministic pseudo QR drawn with SVG cells. */
export function PseudoQR({ seed, size = 168 }: { seed: string; size?: number }) {
  const N = 25
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0
  const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296 }
  const inFinder = (x: number, y: number) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)
  const cells: ReactNode[] = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (inFinder(x, y)) continue
    if (rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)
  }
  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`} transform={`translate(${ox} ${oy})`}>
      <rect width={7} height={7} fill="#2d2622" /><rect x={1} y={1} width={5} height={5} fill="#fff" /><rect x={2} y={2} width={3} height={3} fill="#2d2622" />
    </g>
  )
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} width={size} height={size} role="img" aria-label="Mã QR minh họa" shapeRendering="crispEdges" className="rounded-2xl border-2 border-brown bg-white">
      <rect x={-1} y={-1} width={N + 2} height={N + 2} fill="#fff" />
      <g fill="#2d2622">{cells}</g>
      {finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
    </svg>
  )
}
