import type { ReactNode } from "react"
import { Btn, type BtnVariant } from "./Button"
import { Modal } from "./Modal"

export interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onOk: () => void
  title: string
  body: ReactNode
  okLabel?: string
  cancelLabel?: string
  okVariant?: BtnVariant
}

export function ConfirmModal({
  open,
  onClose,
  onOk,
  title,
  body,
  okLabel = "Xác nhận",
  cancelLabel = "Hủy",
  okVariant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="mb-5 text-sm font-semibold text-brown leading-relaxed">{body}</div>
      <div className="flex justify-end gap-2.5">
        <Btn variant="outline" size="md" onClick={onClose}>
          {cancelLabel}
        </Btn>
        <Btn
          variant={okVariant}
          size="md"
          onClick={() => {
            onOk()
            onClose()
          }}
        >
          {okLabel}
        </Btn>
      </div>
    </Modal>
  )
}

// Alias for backward compatibility with Confirm
export const Confirm = ConfirmModal
