import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?:      'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn(
        'inline-block rounded-full border-current border-r-transparent',
        'animate-spin',
        sizeMap[size],
        className
      )}
    />
  )
}
