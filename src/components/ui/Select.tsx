'use client'

import type { SelectHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string
  error?:   string
  hint?:    string
  options:  SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2, 7)}`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-admin-text">
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10',
              'text-admin-text',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary',
              error
                ? 'border-red-400'
                : 'border-admin-border hover:border-slate-300',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-admin-muted">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
        {hint && !error && <p className="text-xs text-admin-muted">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
