"use client"

import { useEffect } from "react"
import { XIcon } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-md duration-200">
        <div className="bg-surface-dark border-border-dark mx-4 overflow-hidden rounded-2xl border shadow-2xl">
          {/* Header */}
          <div className="border-border-dark flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-text-secondary transition-colors hover:text-white"
            >
              <XIcon className="size-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">{children}</div>

          {/* Actions */}
          {actions && (
            <div className="border-border-dark flex justify-end gap-3 border-t px-6 py-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "primary"
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-surface-highlight hover:bg-surface-dark rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50 ${
              variant === "danger"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-primary text-background-dark hover:bg-primary-hover"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </>
      }
    >
      <p className="text-text-secondary">{message}</p>
    </Modal>
  )
}
