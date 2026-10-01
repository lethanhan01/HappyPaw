import { Star } from 'lucide-react'
import { cx } from '@/lib/cn'

export function Stars({
  value,
  size = 16,
  onChange,
}: {
  value: number
  size?: number
  onChange?: (n: number) => void
}) {
  return (
    <span className="inline-flex gap-0.5" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={cx(onChange && 'transition hover:scale-125 active:scale-95')}
          aria-label={`${n} sao`}
        >
          <Star
            style={{ width: size, height: size }}
            className={n <= Math.round(value) ? 'fill-butter-2 text-brown' : 'text-brown/30'}
            strokeWidth={2}
          />
        </button>
      ))}
    </span>
  )
}
