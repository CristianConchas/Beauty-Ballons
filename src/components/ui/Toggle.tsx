'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
  checked:   boolean
  onChange:  (checked: boolean) => void
  label?:    string
  hint?:     string
  disabled?: boolean
  size?:     'sm' | 'md'
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const trackSize  = size === 'sm' ? 'h-5 w-9'  : 'h-6 w-11'
  const thumbSize  = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const thumbShift = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Track */}
      <div className="relative shrink-0">
        <div
          role="switch"
          aria-checked={checked}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && onChange(!checked)}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault()
              onChange(!checked)
            }
          }}
          className={cn(
            'rounded-full transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
            trackSize,
            checked ? 'bg-brand-primary' : 'bg-slate-200'
          )}
        >
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-[3px] left-[3px] rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              thumbSize,
              checked ? thumbShift : 'translate-x-0'
            )}
          />
        </div>
      </div>

      {/* Labels */}
      {(label || hint) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-admin-text">{label}</span>
          )}
          {hint && (
            <span className="text-xs text-admin-muted">{hint}</span>
          )}
        </div>
      )}
    </label>
  )
}
