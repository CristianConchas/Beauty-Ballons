'use client'

import { type TouchEvent as ReactTouchEvent, useCallback, useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/constants'

interface LightboxPhoto {
  id:            string
  image_url:     string
  alt_text:      string
  caption?:      string | null
  whatsapp_msg?: string | null
  width?:        number | null
  height?:       number | null
  category?:     { name: string }
}

export function useLightbox(photos: LightboxPhoto[]) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  const isOpen       = currentIndex !== null
  const currentPhoto = currentIndex !== null ? photos[currentIndex] : null

  const open = useCallback((index: number) => {
    setCurrentIndex(index)
    const photo = photos[index]
    if (photo) {
      trackEvent(ANALYTICS_EVENTS.LIGHTBOX_OPEN, {
        photo_id: photo.id,
        category: photo.category?.name ?? 'unknown',
      })
    }
  }, [photos])

  const close = useCallback(() => setCurrentIndex(null), [])

  const next = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === null ? null : (prev + 1) % photos.length
    )
  }, [photos.length])

  const prev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    )
  }, [photos.length])

  // Navegación con teclado
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, next, prev, close])

  // Swipe en touch — registrado aquí para consistencia
  const swipeHandlers = {
    onTouchStart: (e: ReactTouchEvent<HTMLDivElement>) => {
      const startX = e.touches[0]?.clientX
      const handleTouchEnd = (endEvent: globalThis.TouchEvent) => {
        const endX   = endEvent.changedTouches[0]?.clientX ?? 0
        const diff   = (startX ?? 0) - endX
        if (Math.abs(diff) > 50) {
          diff > 0 ? next() : prev()
        }
        window.removeEventListener('touchend', handleTouchEnd)
      }
      window.addEventListener('touchend', handleTouchEnd, { once: true })
    },
  }

  return {
    isOpen,
    currentIndex,
    currentPhoto,
    open,
    close,
    next,
    prev,
    swipeHandlers,
    hasMultiple: photos.length > 1,
  }
}
