'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'wa'
export type ButtonSize    = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant
  size?:      ButtonSize
  loading?:   boolean
  fullWidth?: boolean
  leftIcon?:  ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-brand-primary text-white',
    'hover:opacity-90 active:opacity-80',
    'shadow-card hover:shadow-card-md',
  ].join(' '),

  secondary: [
    'bg-transparent text-brand-primary',
    'border-2 border-brand-primary',
    'hover:bg-brand-primary hover:text-white',
    'active:opacity-80',
  ].join(' '),

  ghost: [
    'bg-transparent text-brand-text',
    'hover:bg-black/5 active:bg-black/10',
    'border border-admin-border',
  ].join(' '),

  danger: [
    'bg-red-500 text-white',
    'hover:bg-red-600 active:bg-red-700',
    'shadow-card',
  ].join(' '),

  wa: [
    'bg-wa text-white',
    'hover:bg-wa-dark active:opacity-90',
    'shadow-wa',
  ].join(' '),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm:  'h-9  px-4  text-sm  gap-1.5 rounded-xl',
  md:  'h-11 px-6  text-sm  gap-2   rounded-xl',
  lg:  'h-12 px-8  text-base gap-2   rounded-2xl',
  xl:  'h-14 px-10 text-base gap-2   rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = 'primary',
      size      = 'md',
      loading   = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          'inline-flex items-center justify-center',
          'font-medium transition-all duration-200',
          'select-none whitespace-nowrap',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',

          // Variante y tamaño
          variantClasses[variant],
          sizeClasses[size],

          // Estado
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          fullWidth  && 'w-full',

          className
        )}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className="text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}

        {children && <span>{children}</span>}

        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
