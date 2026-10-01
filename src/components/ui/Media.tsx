import { useState } from 'react'
import { cx } from '@/lib/cn'

/* ---------- Illustrations ---------- */
export function DogIllo({ className = 'size-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M26 44c-10 2-16 16-12 30 3 8 12 8 15 0l4-22z" fill="#d9a066" stroke="#6b4128" strokeWidth="4" />
      <path d="M94 44c10 2 16 16 12 30-3 8-12 8-15 0l-4-22z" fill="#d9a066" stroke="#6b4128" strokeWidth="4" />
      <ellipse cx="60" cy="66" rx="36" ry="34" fill="#fff6e0" stroke="#6b4128" strokeWidth="4" />
      <ellipse cx="60" cy="80" rx="17" ry="13" fill="#f6d4a6" stroke="#6b4128" strokeWidth="3" />
      <ellipse cx="60" cy="74" rx="6" ry="4.5" fill="#6b4128" />
      <path d="M60 78v5M52 86c4 4 12 4 16 0" stroke="#6b4128" strokeWidth="3" />
      <circle cx="45" cy="60" r="4.5" fill="#6b4128" />
      <circle cx="75" cy="60" r="4.5" fill="#6b4128" />
      <circle cx="46.5" cy="58.5" r="1.4" fill="#fff" />
      <circle cx="76.5" cy="58.5" r="1.4" fill="#fff" />
      <ellipse cx="36" cy="74" rx="6" ry="4" fill="#f5cfd6" opacity=".9" />
      <ellipse cx="84" cy="74" rx="6" ry="4" fill="#f5cfd6" opacity=".9" />
    </svg>
  )
}

export function CatIllo({ className = 'size-32' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 54 20 20l28 16z" fill="#c9c4bd" stroke="#6b4128" strokeWidth="4" />
      <path d="M98 54l2-34-28 16z" fill="#c9c4bd" stroke="#6b4128" strokeWidth="4" />
      <ellipse cx="60" cy="68" rx="40" ry="34" fill="#eeeae4" stroke="#6b4128" strokeWidth="4" />
      <path d="M44 38c2 6 0 9-3 12M76 38c-2 6 0 9 3 12M60 36v10" stroke="#a8a29a" strokeWidth="3.5" />
      <circle cx="44" cy="66" r="4.5" fill="#6b4128" />
      <circle cx="76" cy="66" r="4.5" fill="#6b4128" />
      <circle cx="45.5" cy="64.5" r="1.4" fill="#fff" />
      <circle cx="77.5" cy="64.5" r="1.4" fill="#fff" />
      <path d="M56 76h8l-4 5z" fill="#e89aa9" stroke="#6b4128" strokeWidth="2.5" />
      <path d="M60 81v3M54 86c3 3 9 3 12 0" stroke="#6b4128" strokeWidth="3" />
      <path d="M26 74h-12M26 80l-11 4M94 74h12M94 80l11 4" stroke="#6b4128" strokeWidth="2.5" />
      <ellipse cx="34" cy="78" rx="6" ry="4" fill="#f5cfd6" />
      <ellipse cx="86" cy="78" rx="6" ry="4" fill="#f5cfd6" />
    </svg>
  )
}

export const PetIllo = ({ species, className }: { species: string; className?: string }) =>
  species === 'Mèo' ? <CatIllo className={className} /> : <DogIllo className={className} />

export function PetPhoto({
  src,
  species,
  alt,
  className,
}: {
  src?: string
  species: string
  alt: string
  className?: string
}) {
  const [bad, setBad] = useState(!src)
  return (
    <div className={cx('relative overflow-hidden bg-cream-2', className)}>
      {bad ? (
        <div role="img" aria-label={alt} className="grid size-full place-items-center bg-peach/50">
          <PetIllo species={species} className="size-[55%] max-h-28 max-w-28" />
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className="size-full object-cover" />
      )}
    </div>
  )
}
