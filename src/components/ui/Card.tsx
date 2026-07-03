'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface CardProps {
  children:   ReactNode
  className?: string
  padding?:   'none' | 'sm' | 'md' | 'lg'
  hover?:     boolean
  onClick?:   () => void
}

const paddingMap = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export function Card({
  children,
  className,
  padding  = 'md',
  hover    = false,
  onClick,
}: CardProps) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-admin-border bg-white shadow-card',
        paddingMap[padding],
        hover && 'transition-shadow duration-200 hover:shadow-card-md cursor-pointer',
        onClick && 'w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
        className
      )}
    >
      {children}
    </Tag>
  )
}

// Sub-componentes para estructura semántica
Card.Header = function CardHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3 className={cn('font-heading text-base font-semibold text-admin-text', className)}>
      {children}
    </h3>
  )
}

Card.Footer = function CardFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mt-4 border-t border-admin-border pt-4', className)}>
      {children}
    </div>
  )
}
