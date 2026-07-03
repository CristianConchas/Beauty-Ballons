'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  open:          boolean
  onClose:       () => void
  onConfirm:     () => void
  title:         string
  description?:  string
  confirmLabel?: string
  cancelLabel?:  string
  variant?:      'danger' | 'warning'
  loading?:      boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel  = 'Cancelar',
  variant      = 'danger',
  loading      = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Body className="pt-5">
        <div className="mb-4 text-center">
          <div className="mb-3 text-4xl">
            {variant === 'danger' ? '⚠️' : '❓'}
          </div>
          <h2 className="font-heading text-lg font-semibold text-admin-text">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-admin-muted">{description}</p>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
