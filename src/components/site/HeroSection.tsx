'use client'

import Image from 'next/image'
import Link from 'next/link'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/analytics'
import type { HeroSection as HeroType } from '@/types/site.types'

interface HeroSectionProps {
  hero:     HeroType
  waNumber: string
  waMsg:    string
}

const WaIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
  </svg>
)

const TRUST_BADGES = [
  { emoji: '🎈', label: '+50 eventos realizados' },
  { emoji: '⭐', label: 'Atención personalizada' },
  { emoji: '📍', label: 'Guadalajara y ZMG'    },
]

export function HeroSection({ hero, waNumber, waMsg }: HeroSectionProps) {
  const waUrl       = buildWhatsAppUrl({ number: waNumber, message: waMsg })
  const hasBgImage  = !!hero.bg_image_url?.length

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      style={{ paddingBottom: 'clamp(3.5rem, 8vw, 5.5rem)', paddingTop: '5rem' }}
    >
      {/* ── Fondo ── */}
      {hasBgImage ? (
        <>
          <Image
            src={hero.bg_image_url!}
            alt="Decoración de eventos Beauty Ballons"
            fill priority
            className="object-cover object-center scale-[1.04]"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${hero.bg_overlay_opacity ?? 0.45})` }} />
          <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)' }} />
        </>
      ) : (
        <>
          {/* Gradiente multicolor marca */}
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 95% 70% at 80% 15%, rgba(155,111,212,.65) 0%, transparent 52%),
              radial-gradient(ellipse 75% 65% at 10% 80%, rgba(200,81,122,.80) 0%, transparent 50%),
              radial-gradient(ellipse 55% 50% at 88% 85%, rgba(201,150,58,.38) 0%, transparent 55%),
              linear-gradient(162deg, #280A1C 0%, #120110 100%)
            `,
          }} />

          {/* Orbs de glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-28 -right-28 h-[520px] w-[520px] rounded-full opacity-60"
              style={{ background: 'radial-gradient(circle at 38% 38%, rgba(200,81,122,.40) 0%, transparent 65%)' }} />
            <div className="absolute -bottom-16 -left-16 h-[420px] w-[420px] rounded-full opacity-60"
              style={{ background: 'radial-gradient(circle at 38% 38%, rgba(155,111,212,.44) 0%, transparent 65%)' }} />
            <div className="absolute top-[35%] right-[10%] h-[260px] w-[260px] rounded-full opacity-50"
              style={{ background: 'radial-gradient(circle at 38% 38%, rgba(201,150,58,.28) 0%, transparent 65%)' }} />
            {/* Anillos sutiles */}
            <div className="absolute -top-52 -right-52 h-[680px] w-[680px] rounded-full" style={{ border: '1px solid rgba(255,255,255,0.05)' }} />
            <div className="absolute -bottom-24 -left-24 h-[440px] w-[440px] rounded-full" style={{ border: '1px solid rgba(200,81,122,0.07)' }} />
            {/* Textura de puntos */}
            <div className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-2/3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.18) 52%, transparent 100%)' }} />
        </>
      )}

      {/* ── Contenido ── */}
      <div
        className="relative z-10 mx-auto w-full max-w-3xl px-5 lg:px-8"
        style={{ animation: 'hero-rise 1s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* Chips de identidad */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.11] px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white" style={{ backdropFilter: 'blur(8px)' }}>
            🎈 Decoración de Eventos
          </span>
          {hero.badge_text && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.07] px-3 py-1.5 text-[0.65rem] font-medium text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--wa)]" style={{ animation: 'dot-blink 2.2s ease infinite' }} aria-hidden="true" />
              {hero.badge_text}
            </span>
          )}
        </div>

        {/* Headline */}
        <h1
          className="mb-4 font-heading leading-[0.95] tracking-[-0.025em] text-white"
          style={{ fontSize: 'clamp(3rem, 7.5vw, 6rem)', fontWeight: 300 }}
        >
          {hero.headline}
          {hero.headline_em && (
            <>
              {' '}
              <em className="block font-heading italic text-gradient-hero" style={{ fontSize: '1.05em' }}>
                {hero.headline_em}
              </em>
            </>
          )}
        </h1>

        {/* Subheadline */}
        {hero.subheadline && (
          <p
            className="mb-8 max-w-[32rem] text-[1rem] font-light leading-[1.8]"
            style={{ color: 'rgba(255,255,255,0.88)', textShadow: '0 1px 10px rgba(0,0,0,0.6)' }}
          >
            {hero.subheadline}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('hero_primary')}
            className="btn-ripple flex items-center gap-2.5 rounded-full px-7 py-4 text-[0.95rem] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
            style={{ background: 'var(--wa)', boxShadow: '0 6px 28px rgba(37,211,102,0.48)' }}
          >
            <WaIcon size={18} />
            {hero.cta_primary_text ?? 'Cotizar gratis'}
          </a>

          <Link
            href="/portafolio"
            className="btn-ripple flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.1] px-6 py-4 text-[0.875rem] font-semibold text-white transition-all duration-200 hover:bg-white/[0.2] hover:-translate-y-0.5"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            Ver trabajos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {TRUST_BADGES.map(b => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-[0.68rem] font-medium text-white/70"
              style={{ backdropFilter: 'blur(6px)' }}
            >
              <span className="text-[0.9em]">{b.emoji}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 scroll-hint"
        aria-hidden="true"
      >
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-white/40">Scroll</span>
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <div className="h-1.5 w-1 rounded-full bg-white/50" style={{ animation: 'scroll-hint 2s ease infinite' }} />
        </div>
      </div>
    </section>
  )
}
