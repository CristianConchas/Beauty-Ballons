'use client'

import { useState, useMemo, useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'
import { ANALYTICS_EVENTS } from '@/lib/constants'

interface FilterablePhoto {
  id:          string
  category_id: string
  category?:   { slug: string; name: string }
}

export function usePortfolioFilter<T extends FilterablePhoto>(
  photos: T[],
  categories: { id: string; slug: string; name: string }[]
) {
  const [activeSlug, setActiveSlug] = useState<string>('all')

  const filteredPhotos = useMemo(() => {
    if (activeSlug === 'all') return photos
    const cat = categories.find((c) => c.slug === activeSlug)
    if (!cat) return photos
    return photos.filter((p) => p.category_id === cat.id)
  }, [photos, categories, activeSlug])

  const setFilter = useCallback((slug: string) => {
    setActiveSlug(slug)
    if (slug !== 'all') {
      trackEvent(ANALYTICS_EVENTS.FILTER_CLICK, { category_name: slug })
    }
  }, [])

  return {
    activeSlug,
    setFilter,
    filteredPhotos,
    totalCount:    photos.length,
    filteredCount: filteredPhotos.length,
  }
}
