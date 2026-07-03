'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value:      number
  onChange?:  (value: number) => void
  readonly?:  boolean
  size?:      'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function StarRating({
  value,
  onChange,
  readonly  = false,
  size      = 'md',
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={`Calificación: ${value} de 5 estrellas`}
    >
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={cn(
            'transition-colors duration-100',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
            'focus-visible:outline-none'
          )}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          role={readonly ? undefined : 'radio'}
          aria-checked={value === star}
        >
          <Star
            className={cn(
              sizeMap[size],
              'transition-colors',
              star <= display
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-slate-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}
