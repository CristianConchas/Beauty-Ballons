'use client'

import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:    string
  error?:    string
  hint?:     string
  maxChars?: number
  value?:    string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, maxChars, className, id, value, ...props }, ref) => {
    const textareaId  = id ?? `textarea-${Math.random().toString(36).slice(2, 7)}`
    const charCount   = typeof value === 'string' ? value.length : 0
    const overLimit   = maxChars ? charCount > maxChars : false

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={textareaId} className="text-sm font-medium text-admin-text">
              {label}
              {props.required && (
                <span className="ml-1 text-red-500" aria-hidden="true">*</span>
              )}
            </label>
            {maxChars && (
              <span className={cn('text-xs', overLimit ? 'text-red-500' : 'text-admin-muted')}>
                {charCount}/{maxChars}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          className={cn(
            'w-full resize-none rounded-xl border bg-white px-4 py-3',
            'text-admin-text placeholder:text-admin-muted',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary',
            error || overLimit
              ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
              : 'border-admin-border hover:border-slate-300',
            className
          )}
          aria-invalid={!!error || overLimit}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-500" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-admin-muted">{hint}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
