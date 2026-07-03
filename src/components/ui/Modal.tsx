'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open:       boolean
  onClose:    () => void
  title?:     string
  children:   ReactNode
  size?:      'sm' | 'md' | 'lg' | 'full'
  className?: string
  /** Muestra el modal como bottom sheet en mobile */
  bottomSheetOnMobile?: boolean
}

const sizeMap = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-2xl',
  full: 'max-w-full mx-4',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  className,
  bottomSheetOnMobile = true,
}: ModalProps) {
  const overlayRef  = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Bloquear scroll del body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus al primer elemento enfocable
  useEffect(() => {
    if (!open || !contentRef.current) return
    const focusable = contentRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable[0]?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-fade-in" />

      {/* Panel */}
      <div
        ref={contentRef}
        className={cn(
          'relative z-10 w-full bg-white shadow-modal',
          // Mobile: bottom sheet
          bottomSheetOnMobile
            ? 'rounded-t-3xl sm:rounded-2xl animate-slide-up sm:animate-fade-in-scale'
            : 'rounded-2xl animate-fade-in-scale',
          // Desktop: tamaño máximo
          'sm:' + sizeMap[size],
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
            <h2 className="font-heading text-lg font-semibold text-admin-text">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-admin-muted transition-colors hover:bg-slate-100 hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Cuerpo */}
        <div className="max-h-[85dvh] overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  )
}

// Sub-componentes
Modal.Body = function ModalBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('px-5 py-4', className)}>
      {children}
    </div>
  )
}

Modal.Footer = function ModalFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 border-t border-admin-border px-5 py-4',
      className
    )}>
      {children}
    </div>
  )
}
