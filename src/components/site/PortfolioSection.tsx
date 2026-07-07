'use client'

import Image from 'next/image'
import { useEffect } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } }
  }
}
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

/** Feed de Instagram usando embed oficial
 *  Funciona con cualquier cuenta pública — sin API, sin tokens */
function IgFeedGrid() {
  useEffect(() => {
    // Cargar el script oficial de Instagram de forma diferida
    if (document.getElementById('ig-embed-script')) {
      // Si ya está cargado, re-procesar los embeds
      if (window.instgrm) window.instgrm.Embeds.process()
      return
    }
    const script = document.createElement('script')
    script.id    = 'ig-embed-script'
    script.src   = 'https://www.instagram.com/embed.js'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.instgrm) window.instgrm.Embeds.process()
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div className="px-4">
      {/* Embed oficial de Instagram — muestra los últimos posts del perfil */}
      <div className="flex flex-col items-center gap-4">

        {/* Post 1 */}
        <blockquote
          className="instagram-media"
          data-instgrm-permalink="https://www.instagram.com/beauty_.balloons/"
          data-instgrm-version="14"
          data-instgrm-captioned
          style={{
            background: '#FFF',
            border: 0,
            borderRadius: '1rem',
            boxShadow: '0 0 1px 0 rgba(0,0,0,.5), 0 1px 10px 0 rgba(0,0,0,.15)',
            margin: '0 auto',
            maxWidth: 540,
            minWidth: 326,
            padding: 0,
            width: '100%',
          }}
        />
      </div>

      {/* Botón para ver más en Instagram */}
      <div className="mt-6 text-center">
        <a
          href="https://www.instagram.com/beauty_.balloons"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #E1306C, #833AB4)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
          </svg>
          Ver todos los trabajos en Instagram
        </a>
      </div>
    </div>
  )
}

export function PortfolioSection({
  photos, categories, label, waNumber, waDefaultMsg, showViewAll = true,
}: PortfolioSectionProps) {
  const { activeSlug, setFilter, filteredPhotos } = usePortfolioFilter(photos, categories)
  const lightbox = useLightbox(filteredPhotos)
  const wa       = useWhatsApp({ number: waNumber, defaultMessage: waDefaultMsg })
  const hasPhotos = photos.length > 0

  return (
    <>
      <div className="section-divider" />
      <section
        id="portafolio"
        className="section-warm"
        style={{ padding: 'var(--section-py) 0' }}
        aria-labelledby="portfolio-title"
      >
        {/* Header */}
        <div className="mb-8 px-5 text-center reveal">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--color-primary)' }}>
            {hasPhotos ? 'Portafolio' : 'Síguenos'}
          </p>
          <h2
            id="portfolio-title"
            className="font-heading leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)' }}
          >
            {hasPhotos
              ? (label?.title ?? 'Nuestros trabajos')
              : 'Nuestros últimos trabajos'}
          </h2>
          {(label?.subtitle || !hasPhotos) && (
            <p className="mt-2 text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
              {hasPhotos
                ? label?.subtitle
                : 'Ve nuestros eventos más recientes directamente desde Instagram'}
            </p>
          )}
        </div>

        {hasPhotos ? (
          <>
            {/* Filtros */}
            {categories.length > 1 && (
              <div className="mb-5 flex gap-2 overflow-x-auto scroll-hide px-4 pb-1 reveal">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
                    activeSlug === 'all'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white text-[var(--text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                  )}
                  style={{ border: '1.5px solid', borderColor: activeSlug === 'all' ? 'transparent' : 'var(--border-light)' }}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.slug)}
                    className={cn(
                      'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
                      activeSlug === cat.slug
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-white text-[var(--text-muted)] hover:text-[var(--color-primary)]'
                    )}
                    style={{ border: '1.5px solid', borderColor: activeSlug === cat.slug ? 'transparent' : 'var(--border-light)' }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Masonry */}
            <div className="masonry-grid px-3 reveal">
              {filteredPhotos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => lightbox.open(i)}
                  className="group relative w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2"
                  style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
                  aria-label={`Ver ${photo.alt_text}`}
                >
                  <Image
                    src={photo.thumbnail_url || photo.image_url}
                    alt={photo.alt_text}
                    width={photo.width  || 400}
                    height={photo.height || 400}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading={i < 6 ? 'eager' : 'lazy'}
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <p className="text-xs font-medium text-white">{photo.caption}</p>
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
                  className="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Ver portafolio completo →
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Feed de Instagram cuando no hay fotos subidas */
          <IgFeedGrid />
        )}
      </section>

      {/* Lightbox */}
      {lightbox.isOpen && lightbox.currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto del portafolio"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
          onClick={lightbox.close}
          {...lightbox.swipeHandlers}
        >
          <button
            onClick={lightbox.close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {lightbox.hasMultiple && (
            <button
              onClick={(e) => { e.stopPropagation(); lightbox.prev() }}
              className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            className="relative mx-12 max-h-[80svh] max-w-[90vw] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.currentPhoto.image_url}
              alt={lightbox.currentPhoto.alt_text}
              width={lightbox.currentPhoto.width  || 800}
              height={lightbox.currentPhoto.height || 800}
              className="max-h-[70svh] w-auto object-contain"
              priority
            />
            <div className="bg-white p-4">
              {lightbox.currentPhoto.caption && (
                <p className="mb-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {lightbox.currentPhoto.caption}
                </p>
              )}
              <button
                onClick={() => wa.open({
                  context: 'lightbox',
                  specificMessage: lightbox.currentPhoto?.whatsapp_msg ?? undefined,
                })}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors"
                style={{ background: 'var(--wa)' }}
              >
                💬 Quiero algo así
              </button>
            </div>
          </div>

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
