'use client'

import { useEffect, useRef } from 'react'
import { trackScrollDepth } from '@/lib/analytics'

/**
 * Rastrea el scroll depth del usuario y dispara eventos de analítica
 * en los puntos 25%, 50%, 75% y 100%.
 * Solo se activa en el sitio público (no en /admin).
 */
export function useScrollProgress() {
  const reported = useRef(new Set<number>())

  useEffect(() => {
    const checkpoints: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100]

    const handleScroll = () => {
      const scrollTop    = window.scrollY
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0
        ? Math.round((scrollTop / docHeight) * 100)
        : 0

      for (const point of checkpoints) {
        if (scrollPercent >= point && !reported.current.has(point)) {
          reported.current.add(point)
          trackScrollDepth(point)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
