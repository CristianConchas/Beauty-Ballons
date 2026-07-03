'use client'

import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { usePortfolioFilter } from '@/hooks/usePortfolioFilter'
import { useLightbox } from '@/hooks/useLightbox'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import type { PortfolioPhoto, PortfolioCategory } from '@/types/content.types'
import type { SectionLabel } from '@/types/site.types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PortfolioSectionProps {
  photos:       PortfolioPhoto[]
  categories:   PortfolioCategory[]
  label:        SectionLabel | null
  waNumber:     string
  waDefaultMsg: string
  showViewAll?: boolean
}

export function PortfolioSection({
  photos, categories, label, waNumber, waDefaultMsg, showViewAll = true,
}: PortfolioSectionProps) {
  const { activeSlug, setFilter, filteredPhotos } = usePortfolioFilter(photos, categories)
  const lightbox = useLightbox(filteredPhotos)
  const wa       = useWhatsApp({ number: waNumber, defaultMessage: waDefaultMsg })

  if (!photos.length) return null

  return (
    <>
      <section id="portafolio" className="py-[var(--section-py)] bg-white">
        {/* Header */}
        <div className="mb-6 px-4 text-center reveal">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-primary">
            Portafolio
          </p>
          <h2 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
            {label?.title ?? 'Nuestros trabajos'}
          </h2>
          {label?.subtitle && (
            <p className="mt-2 text-sm text-gray-500">{label.subtitle}</p>
          )}
        </div>

        {/* Filtros */}
        {categories.length > 1 && (
          <div className="mb-5 flex gap-2 overflow-x-auto scroll-hide px-4 pb-1">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
                activeSlug === 'all'
                  ? 'bg-brand-primary text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.slug)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
                  activeSlug === cat.slug
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Masonry grid */}
        <div className="masonry-grid px-3">
          {filteredPhotos.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => lightbox.open(i)}
              className="group relative w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label={`Ver ${photo.alt_text}`}
            >
              <Image
                src={photo.thumbnail_url || photo.image_url}
                alt={photo.alt_text}
                width={photo.width || 400}
                height={photo.height || 400}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={i < 6 ? 'eager' : 'lazy'}
              />
              {/* Overlay */}
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <p className="text-xs text-white font-medium">{photo.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Ver más */}
        {showViewAll && (
          <div className="mt-6 px-4 text-center">
            <Link
              href="/portafolio"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline"
            >
              Ver portafolio completo →
            </Link>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox.isOpen && lightbox.currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto del portafolio"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={lightbox.close}
          {...lightbox.swipeHandlers}
        >
          {/* Cerrar */}
          <button
            onClick={lightbox.close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {lightbox.hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); lightbox.prev() }}
              className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Foto */}
          <div
            className="relative mx-12 max-h-[80svh] max-w-[90vw] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.currentPhoto.image_url}
              alt={lightbox.currentPhoto.alt_text}
              width={lightbox.currentPhoto.width || 800}
              height={lightbox.currentPhoto.height || 800}
              className="max-h-[70svh] w-auto object-contain"
              priority
            />

            {/* Caption + CTA */}
            <div className="bg-white p-4">
              {lightbox.currentPhoto.caption && (
                <p className="mb-3 text-sm font-medium text-gray-700">{lightbox.currentPhoto.caption}</p>
              )}
              <button
                onClick={() => wa.open({
                  context: 'lightbox',
                  specificMessage: lightbox.currentPhoto?.whatsapp_msg ?? undefined,
                })}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-wa py-3 text-sm font-bold text-white hover:bg-wa-dark transition-colors"
              >
                💬 Quiero algo así
              </button>
            </div>
          </div>

          {/* Next */}
          {lightbox.hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); lightbox.next() }}
              className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
