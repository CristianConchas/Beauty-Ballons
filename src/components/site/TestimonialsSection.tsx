'use client'

import { useEffect, useRef } from 'react'
import type { Testimonial } from '@/types/content.types'
import type { SectionLabel } from '@/types/site.types'
import { getInitials } from '@/lib/utils'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  label:        SectionLabel | null
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article
      className="flex h-full w-[min(82vw,300px)] flex-shrink-0 [scroll-snap-align:start] flex-col gap-3.5 rounded-2xl border bg-[var(--bg-surface)] p-5 sm:w-[296px]"
      style={{ borderColor: 'rgba(200,81,122,0.12)' }}
    >
      {/* Estrellas */}
      <div className="flex gap-0.5" aria-label={`${t.rating} de 5 estrellas`}>
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            width="14" height="14"
            viewBox="0 0 24 24"
            fill={i < t.rating ? '#F59E0B' : '#E5E7EB'}
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>

      {/* Cita */}
      <blockquote
        className="flex-1 border-l-[3px] pl-3.5 font-heading text-[1rem] italic leading-[1.6]"
        style={{
          borderColor: 'var(--color-primary)',
          color: 'var(--text-primary)',
          fontWeight: 300,
        }}
      >
        "{t.content}"
      </blockquote>

      {/* Autor */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[0.8rem] font-bold text-white"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          aria-hidden="true"
        >
          {getInitials(t.client_name)}
        </div>
        <div>
          <p className="text-[0.82rem] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t.client_name}
          </p>
          <p className="text-[0.7rem]" style={{ color: 'var(--text-muted)' }}>
            {t.event_type}{t.location ? ` · ${t.location}` : ''}
          </p>
        </div>
      </div>
    </article>
  )
}

export function TestimonialsSection({ testimonials, label }: TestimonialsSectionProps) {
  const trackRef   = useRef<HTMLDivElement>(null)
  const styleRef   = useRef<HTMLStyleElement | null>(null)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Duplicar tarjetas para loop infinito
  const items = testimonials.length > 0 ? [...testimonials, ...testimonials] : []

  // Calcular velocidad (px/segundo)
  const PX_PER_SEC = 65

  useEffect(() => {
    if (!trackRef.current || testimonials.length === 0) return

    function recalc() {
      const track = trackRef.current
      if (!track) return

      const cards = track.querySelectorAll('article')
      const half  = cards.length / 2
      let totalW  = 0

      cards.forEach((c, i) => {
        if (i < half) {
          totalW += c.getBoundingClientRect().width
          if (i < half - 1) totalW += 16 // gap 1rem
        }
      })

      if (totalW === 0) return

      const duration = totalW / PX_PER_SEC

      // Inyectar / actualizar keyframe
      if (!styleRef.current) {
        styleRef.current = document.createElement('style')
        document.head.appendChild(styleRef.current)
      }
      styleRef.current.textContent = `
        @keyframes carousel-scroll {
          from { transform: translateX(0) }
          to   { transform: translateX(-${totalW}px) }
        }
      `
      track.style.animationDuration = `${duration}s`
    }

    document.fonts.ready.then(recalc)

    const onResize = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(recalc, 150)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (styleRef.current) styleRef.current.remove()
    }
  }, [testimonials])

  if (testimonials.length === 0) return null

  return (
    <>
      <div className="section-divider" />
      <section
        className="section-muted overflow-hidden"
        style={{ padding: 'var(--section-py) 0' }}
        aria-labelledby="test-title"
      >
        {/* Header */}
        <div className="mb-10 px-5 text-center reveal">
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--color-primary)' }}>
            Clientes
          </p>
          <h2
            id="test-title"
            className="font-heading leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)' }}
          >
            Lo que dicen{' '}
            <em className="italic" style={{ color: 'var(--color-primary)' }}>
              {label?.title ?? 'de nosotros'}
            </em>
          </h2>
        </div>

        {/* Track con fade lateral */}
        <div
          className="relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-4"
            style={{
              width: 'max-content',
              animation: 'carousel-scroll linear infinite',
              animationDuration: '30s', // se sobreescribe por JS
            }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
            onTouchStart={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
            onTouchEnd={(e) => (e.currentTarget.style.animationPlayState = 'running')}
            aria-label="Opiniones de clientes — carrusel automático"
          >
            {items.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
