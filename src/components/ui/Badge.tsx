import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'wa'

interface BadgeProps {
  variant?:  BadgeVariant
  children:  ReactNode
  className?: string
  dot?:      boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-slate-100 text-slate-600',
  primary:  'bg-brand-primary/10 text-brand-primary',
  success:  'bg-green-50 text-green-700',
  warning:  'bg-amber-50 text-amber-700',
  danger:   'bg-red-50 text-red-600',
  info:     'bg-blue-50 text-blue-700',
  wa:       'bg-green-50 text-green-700',
}

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
        'text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' ? 'bg-green-500' :
            variant === 'warning' ? 'bg-amber-500' :
            variant === 'danger'  ? 'bg-red-500'   :
            variant === 'primary' ? 'bg-brand-primary' :
            'bg-current'
          )}
        />
      )}
      {children}
    </span>
  )
}
