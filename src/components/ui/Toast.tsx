import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useUI } from '@/store/uiStore'

/* ---------- Toasts ---------- */
export function ToastHost() {
  const { toasts } = useUI()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-8">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex animate-[pop_.3s_both] items-center gap-2 rounded-2xl border-2 border-brown bg-brown px-4 py-2.5 text-sm font-bold text-cream shadow-lg"
        >
          {t.tone === 'ok' ? (
            <CheckCircle2 className="size-5 text-sage" />
          ) : (
            <AlertCircle className="size-5 text-butter" />
          )}
          {t.msg}
        </div>
      ))}
    </div>
  )
}
