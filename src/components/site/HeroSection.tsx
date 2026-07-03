'use client'

import Image from 'next/image'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/analytics'
import type { HeroSection as HeroType } from '@/types/site.types'

interface HeroSectionProps {
  hero:     HeroType
  waNumber: string
  waMsg:    string
}

export function HeroSection({ hero, waNumber, waMsg }: HeroSectionProps) {
  const waUrl = buildWhatsAppUrl({ number: waNumber, message: waMsg })

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-24"
    >
      {/* ── Fondo ── */}
      {hero.bg_image_url ? (
        <>
          <Image
            src={hero.bg_image_url}
            alt="Decoración de eventos Beauty Ballons"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${hero.bg_overlay_opacity ?? 0.45})` }}
          />
        </>
      ) : (
        <>
          {/* Gradiente base */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 78% 55% at 72% 28%, rgba(155,111,212,.52) 0%, transparent 58%),
                radial-gradient(ellipse 58% 52% at 18% 72%, rgba(200,81,122,.68) 0%, transparent 55%),
                linear-gradient(158deg, #2A061A 0%, #160312 100%)
              `,
            }}
          />
          {/* Orbs estáticos — sin animation loop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full"
              style={{ background: 'radial-gradient(circle at 36% 36%, rgba(200,81,122,.38) 0%, rgba(200,81,122,.06) 48%, transparent 70%)' }}
            />
            <div className="absolute -bottom-16 -left-28 h-[380px] w-[380px] rounded-full"
              style={{ background: 'radial-gradient(circle at 36% 36%, rgba(155,111,212,.44) 0%, rgba(155,111,212,.06) 48%, transparent 70%)' }}
            />
            <div className="absolute top-[38%] right-[6%] h-[220px] w-[220px] rounded-full"
              style={{ background: 'radial-gradient(circle at 36% 36%, rgba(201,150,58,.26) 0%, rgba(201,150,58,.05) 48%, transparent 70%)' }}
            />
            {/* Anillos decorativos */}
            <div className="absolute -top-52 -right-52 h-[620px] w-[620px] rounded-full border border-white/[0.06]" />
            <div className="absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full"
              style={{ border: '1px solid rgba(200,81,122,.07)' }}
            />
          </div>
        </>
      )}

      {/* ── Contenido — animación de entrada única ── */}
      <div
        className="relative z-10 flex max-w-[42rem] flex-col px-5"
        style={{ animation: 'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* Badge */}
        {hero.badge_text && (
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/[0.09] px-3.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/80">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: 'var(--wa)',
                animation: 'dot-blink 2.2s ease infinite',
              }}
              aria-hidden="true"
            />
            {hero.badge_text}
          </span>
        )}

        {/* Headline — grande, editorial */}
        <h1
          className="mb-4 font-heading leading-[0.98] tracking-[-0.02em] text-white"
          style={{ fontSize: 'clamp(3rem, 7.5vw, 6rem)', fontWeight: 300 }}
        >
          {hero.headline}
          {hero.headline_em && (
            <>
              {' '}
              <em
                className="block font-heading italic"
                style={{
                  fontStyle: 'italic',
                  fontSize: '1.08em',
                  background: 'linear-gradient(128deg, #F4A9C0 10%, #C4B5FD 55%, #EDD08E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {hero.headline_em}
              </em>
            </>
          )}
        </h1>

        {/* Subheadline */}
        {hero.subheadline && (
          <p className="mb-8 max-w-[26rem] text-[0.97rem] font-light leading-[1.75] text-white/62">
            {hero.subheadline}
          </p>
        )}

        {/* CTA — UN solo botón principal */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('hero_primary')}
            className="flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[0.95rem] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
            style={{
              background: 'var(--wa)',
              boxShadow: '0 8px 28px rgba(37,211,102,0.42)',
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
            </svg>
            {hero.cta_primary_text ?? 'Cotizar sin compromiso'}
          </a>

          {/* Link secundario (sin botón visible) */}
          {hero.cta_secondary_text && (
            <a
              href={`#${hero.cta_secondary_action?.replace('scroll_', '') ?? 'portafolio'}`}
              className="flex items-center gap-1.5 text-[0.875rem] text-white/55 transition-colors hover:text-white/85"
            >
              {hero.cta_secondary_text}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
