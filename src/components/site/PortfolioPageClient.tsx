'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Share2, MessageCircle, Check } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'
import type { PortfolioPhoto, PortfolioCategory } from '@/types/content.types'

interface PortfolioPageClientProps {
  photos:       PortfolioPhoto[]
  categories:   PortfolioCategory[]
  waNumber:     string
  waDefaultMsg: string
}

export function PortfolioPageClient({
  photos, categories, waNumber, waDefaultMsg,
}: PortfolioPageClientProps) {
  const [activeSlug, setActiveSlug] = useState<string>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const filtered = activeSlug === 'all'
    ? photos
    : photos.filter(p => (p as any).category?.slug === activeSlug)

  const currentPhoto = lightboxIdx !== null ? filtered[lightboxIdx] : null

  const openLightbox  = (i: number) => setLightboxIdx(i)
  const closeLightbox = () => setLightboxIdx(null)
  const prev = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null), [filtered.length])
  const next = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % filtered.length : null), [filtered.length])

  /** Compartir foto vía Web Share API o copiar link */
  async function sharePhoto(photo: PortfolioPhoto) {
    const photoUrl   = photo.image_url
    const shareTitle = `Beauty Ballons — ${photo.alt_text ?? 'Decoración de eventos'}`
    const shareText  = photo.caption ?? '¡Mira esta hermosa decoración! 🎈'
    const siteUrl    = window.location.origin

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: siteUrl + '/portafolio' })
        return
      } catch { /* usuario canceló */ }
    }

    // Fallback: copiar URL al clipboard
    try {
      await navigator.clipboard.writeText(siteUrl + '/portafolio')
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch { /* sin permisos de clipboard */ }
  }

  function openWA(photo: PortfolioPhoto) {
    const msg = photo.whatsapp_msg
      ?? `¡Hola Beauty Ballons! 🎈 Vi esta decoración en su portafolio y me gustaría algo similar para mi evento. ¿Pueden ayudarme con una cotización?`
    window.open(buildWhatsAppUrl({ number: waNumber, message: msg }), '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ padding: '2rem 1rem 4rem' }}>
      {/* Filtros */}
      {categories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveSlug('all')}
            className={cn('rounded-full px-4 py-1.5 text-xs font-semibold transition-all', activeSlug === 'all' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--text-muted)] border')}
            style={{ borderColor: 'var(--border-light)' }}
          >
            Todos ({photos.length})
          </button>
          {categories.filter(c => c.slug !== 'all').map(cat => {
            const count = photos.filter(p => (p as any).category?.slug === cat.slug).length
            if (count === 0) return null
            return (
              <button
                key={cat.id}
                onClick={() => setActiveSlug(cat.slug)}
                className={cn('rounded-full px-4 py-1.5 text-xs font-semibold transition-all', activeSlug === cat.slug ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--text-muted)] border')}
                style={{ borderColor: 'var(--border-light)' }}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Grid masonry */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-3xl mb-2">📸</p>
          <p style={{ color: 'var(--text-muted)' }}>No hay fotos en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="masonry-grid max-w-5xl mx-auto">
          {filtered.map((photo, i) => (
            <div key={photo.id} className="group relative cursor-pointer overflow-hidden rounded-xl" onClick={() => openLightbox(i)}>
              <Image
                src={photo.thumbnail_url || photo.image_url}
                alt={photo.alt_text ?? 'Decoración de eventos'}
                width={photo.width || 400}
                height={photo.height || 400}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={i < 8 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {photo.caption && (
                  <p className="text-[0.68rem] font-medium text-white line-clamp-2 mb-1">{photo.caption}</p>
                )}
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); openWA(photo) }}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[var(--wa)] py-1.5 text-[0.65rem] font-bold text-white"
                  >
                    <MessageCircle className="h-3 w-3" />
                    Quiero esto
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); sharePhoto(photo) }}
                    className="flex items-center justify-center w-8 rounded-lg bg-white/20 text-white"
                    aria-label="Compartir"
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Aviso de copiado */}
      {copied && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-4 py-2 text-[0.8rem] font-medium text-white shadow-lg">
          <Check className="h-4 w-4 text-[var(--wa)]" />
          Link copiado al portapapeles
        </div>
      )}

      {/* Lightbox */}
      {currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/94"
          onClick={closeLightbox}
        >
          {/* Cerrar */}
          <button onClick={closeLightbox} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 z-10" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>

          {/* Prev/Next */}
          {filtered.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 z-10" aria-label="Anterior">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 z-10" aria-label="Siguiente">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Imagen */}
          <div
            className="relative mx-16 max-h-[80svh] max-w-[88vw] overflow-hidden rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentPhoto.image_url}
              alt={currentPhoto.alt_text ?? 'Decoración'}
              width={currentPhoto.width || 800}
              height={currentPhoto.height || 800}
              className="max-h-[65svh] w-auto object-contain"
              priority
            />

            {/* Acciones */}
            <div className="p-4">
              {currentPhoto.caption && (
                <p className="mb-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {currentPhoto.caption}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => openWA(currentPhoto)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-colors"
                  style={{ background: 'var(--wa)' }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Quiero algo así
                </button>
                <button
                  onClick={() => sharePhoto(currentPhoto)}
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                  style={{ background: 'var(--bg-warm)', color: 'var(--text-primary)' }}
                  aria-label="Compartir foto"
                >
                  {copied ? <Check className="h-4 w-4" style={{ color: 'var(--wa)' }} /> : <Share2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Contador */}
          {filtered.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs text-white">
              {(lightboxIdx ?? 0) + 1} / {filtered.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
