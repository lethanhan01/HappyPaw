import { useState, type ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Btn } from "./Button"
import { Modal } from "./Modal"

export interface FilterBarProps {
  children: ReactNode
  active?: number
  activeCount?: number
  onClear?: () => void
  title?: string
  sheetType?: "modal" | "bottomSheet"
  className?: string
}

export function FilterBar({
  children,
  active,
  activeCount,
  onClear,
  title = "Bộ lọc tìm kiếm",
  sheetType = "modal",
  className,
}: FilterBarProps) {
  const [open, setOpen] = useState(false)
  const count = activeCount ?? active ?? 0

  const content = (
    <>
      <div className="flex flex-col gap-3.5 [&>*]:!w-full [&>*]:!max-w-none">
        {children}
      </div>
      <div className="mt-5 flex gap-2">
        {onClear && (
          <Btn variant="outline" size="md" className="flex-1" onClick={onClear}>
            Xóa lọc
          </Btn>
        )}
        <Btn
          variant="dark"
          size="md"
          className="flex-1"
          onClick={() => setOpen(false)}
        >
          Áp dụng
        </Btn>
      </div>
    </>
  )

  return (
    <div className={className}>
      {/* Desktop view: inline horizontal flex */}
      <div className="mb-3 hidden flex-wrap items-center gap-2 md:flex">
        {children}
        {count > 0 && onClear && (
          <Btn variant="ghost" size="sm" onClick={onClear}>
            Xóa lọc
          </Btn>
        )}
      </div>

      {/* Mobile view: full-width toggle button */}
      <div className="mb-3 md:hidden">
        <Btn
          variant="outline"
          size="md"
          full
          icon={<SlidersHorizontal className="size-4" />}
          onClick={() => setOpen(true)}
        >
          Bộ lọc{count > 0 ? ` (${count})` : ""}
        </Btn>
      </div>

      {/* Mobile popup */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        sheet={sheetType === "bottomSheet"}
      >
        {content}
      </Modal>
    </div>
  )
}
