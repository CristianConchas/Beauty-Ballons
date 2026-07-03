'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?:        ReactNode
  emoji?:       string
  title:        string
  description?: string
  action?:      ReactNode
  className?:   string
  compact?:     boolean
}

export function EmptyState({
  icon,
  emoji,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8 px-4' : 'py-16 px-6',
        className
      )}
    >
      {(icon || emoji) && (
        <div className={cn('mb-4', compact ? 'text-3xl' : 'text-5xl')}>
          {emoji ?? icon}
        </div>
      )}

      <h3 className={cn(
        'font-heading font-semibold text-admin-text mb-1',
        compact ? 'text-base' : 'text-lg'
      )}>
        {title}
      </h3>

      {description && (
        <p className={cn(
          'text-admin-muted max-w-xs',
          compact ? 'text-xs' : 'text-sm'
        )}>
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  )
}

// Variantes predefinidas de uso frecuente
export function NoPhotosState({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      emoji="📸"
      title="Sin fotos aún"
      description="Sube fotos de tus trabajos para mostrarlas en el portafolio."
      action={onUpload ? (
        <button
          onClick={onUpload}
          className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Subir primera foto
        </button>
      ) : undefined}
    />
  )
}

export function NoLeadsState() {
  return (
    <EmptyState
      emoji="📥"
      title="Sin prospectos aún"
      description="Cuando alguien llene el formulario de tu sitio, aparecerá aquí."
      compact
    />
  )
}

export function NoServicesState() {
  return (
    <EmptyState
      emoji="🎈"
      title="Sin servicios configurados"
      description="Agrega los servicios que ofreces para mostrarlos en tu sitio."
      compact
    />
  )
}
