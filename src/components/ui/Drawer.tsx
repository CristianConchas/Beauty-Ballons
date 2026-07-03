'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open:       boolean
  onClose:    () => void
  title?:     string
  children:   ReactNode
  side?:      'left' | 'right' | 'bottom'
  className?: string
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side    = 'right',
  className,
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const panelClasses = {
    right: 'right-0 top-0 h-full w-full max-w-sm animate-slide-in-right',
    left:  'left-0 top-0 h-full w-full max-w-sm',
    bottom:'bottom-0 left-0 w-full rounded-t-3xl animate-slide-up',
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/40 animate-fade-in" />

      <div
        className={cn(
          'absolute z-10 bg-white shadow-modal',
          panelClasses[side],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
            <h2 className="font-heading text-lg font-semibold text-admin-text">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-admin-muted transition-colors hover:bg-slate-100"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="h-full overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  )
}
