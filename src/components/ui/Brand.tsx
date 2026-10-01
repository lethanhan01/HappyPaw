import logoSvg from '@/assets/logo.svg'
import logoFull from '@/assets/logo-full.png'
import pawsImg from '@/assets/paws.png'

export { logoSvg, logoFull, pawsImg }

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

export function Logo({ onClick, compact }: { onClick?: () => void; compact?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 group cursor-pointer text-left select-none"
      aria-label="Happy Paws"
    >
      <span className="grid size-10 place-items-center rounded-2xl border-[2.5px] border-brown bg-butter text-brown shadow-[0_3px_0_var(--color-brown)] group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_0_var(--color-brown)] transition overflow-hidden p-1">
        <img src={logoSvg} alt="Happy Paws emblem" className="size-8 object-contain scale-[1.35]" />
      </span>
      {!compact && (
        <span className="whitespace-nowrap font-display text-[22px] font-extrabold leading-none tracking-tight text-brown">
          HAPPY <span className="rounded-lg bg-butter px-1.5 py-0.5 border-2 border-brown">PAWS</span>
        </span>
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
