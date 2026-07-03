import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  rounded?:   boolean
}

export function Skeleton({ className, rounded = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'skeleton',
        rounded ? 'rounded-full' : 'rounded-xl',
        className
      )}
    />
  )
}

// Skeleton de tarjeta de servicio
export function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-admin-border bg-white p-4">
      <Skeleton className="mb-3 h-10 w-10" rounded />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

// Skeleton de foto del portafolio
export function PhotoSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <Skeleton className={cn('w-full', tall ? 'h-48' : 'h-32')} />
  )
}

// Skeleton de lead
export function LeadSkeleton() {
  return (
    <div className="rounded-2xl border border-admin-border bg-white p-4">
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-10 w-10" rounded />
        <div className="flex-1">
          <Skeleton className="mb-1.5 h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

// Skeleton de stats del dashboard
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-admin-border bg-white p-4">
          <Skeleton className="mb-2 h-8 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}
