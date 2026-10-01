import logoSvg from '@/assets/logo.svg'
import logoTextSvg from '@/assets/logo-text.svg'
import logoFull from '@/assets/logo-full.png'
import pawsImg from '@/assets/paws.png'
import { cx } from '@/lib'

export { logoSvg, logoTextSvg, logoFull, pawsImg }

/* ---------- Paw + brand ---------- */
export function Paw({ className = 'size-5', fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden>
      <ellipse cx="5.2" cy="10.2" rx="2.2" ry="2.9" transform="rotate(-18 5.2 10.2)" />
      <ellipse cx="9.4" cy="5.6" rx="2.2" ry="3" transform="rotate(-6 9.4 5.6)" />
      <ellipse cx="14.8" cy="5.6" rx="2.2" ry="3" transform="rotate(6 14.8 5.6)" />
      <ellipse cx="18.9" cy="10.2" rx="2.2" ry="2.9" transform="rotate(18 18.9 10.2)" />
      <path d="M12 10.5c-3 0-6 3.6-6 6.3 0 2 1.6 2.9 3 2.9 1.1 0 1.9-.5 3-.5s1.9.5 3 .5c1.4 0 3-.9 3-2.9 0-2.7-3-6.3-6-6.3z" />
    </svg>
  )
}

export function Logo({ onClick, compact, className }: { onClick?: () => void; compact?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cx('flex items-center gap-2 sm:gap-2.5 group cursor-pointer text-left select-none', className)}
      aria-label="Happy Paws"
    >
      <img
        src={logoSvg}
        alt="Happy Paws icon"
        className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 shrink-0"
      />
      {!compact && (
        <img
          src={logoTextSvg}
          alt="Happy Paws"
          className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-[1.02] shrink-0 hidden sm:block"
        />
      )}
    </button>
  )
}

export function BrandImage({ className = 'w-64' }: { className?: string }) {
  return <img src={logoSvg} alt="Happy Paws logo" className={className} />
}

export function PawsBanner({ className = 'h-12 w-auto' }: { className?: string }) {
  return <img src={pawsImg} alt="Happy Paws banner" className={className} />
}
