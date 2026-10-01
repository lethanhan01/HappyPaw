import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cx } from '@/lib/cn'
import { IconBtn } from './Button'

/* ---------- Modal + sheet ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  sheet = true,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  wide?: boolean
  sheet?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-brown/45 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cx(
          'max-h-[92vh] w-full animate-[rise_.25s_ease-out] overflow-y-auto border-2 border-brown bg-paper p-6 shadow-[0_8px_0_rgba(107,65,40,.35)]',
          sheet ? 'rounded-t-[28px] sm:rounded-[28px]' : 'rounded-[28px]',
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md',
        )}
      >
        {sheet && <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-brown/25 sm:hidden" />}
        <div className="mb-3 flex items-start justify-between gap-3">
          {title && <h3 className="font-display text-2xl font-extrabold leading-tight">{title}</h3>}
          <IconBtn
            label="Đóng"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-auto"
          >
            <X className="size-5" />
          </IconBtn>
        </div>
        {children}
      </div>
    </div>
  )
}
