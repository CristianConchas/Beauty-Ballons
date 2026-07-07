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

const WaIcon = ({ size = 19 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
  </svg>
)

export function HeroSection({ hero, waNumber, waMsg }: HeroSectionProps) {
  const waUrl = buildWhatsAppUrl({ number: waNumber, message: waMsg })
  const hasBgImage = hero.bg_image_url && hero.bg_image_url.length > 0

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      style={{ paddingBottom: 'clamp(3rem, 8vw, 5rem)', paddingTop: '6rem' }}
    >
      {/* ── Fondo: imagen o gradiente multicolor ── */}
      {hasBgImage ? (
        <>
          <Image
            src={hero.bg_image_url!}
            alt="Decoración de eventos Beauty Ballons"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Overlay con opacidad configurable */}
          <div
            className="absolute inset-0"
            style={{ background: `rgba(0,0,0,${hero.bg_overlay_opacity ?? 0.45})` }}
          />
          {/* Gradiente de texto adicional para legibilidad del subtítulo */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }}
          />
        </>
      ) : (
        <>
          {/* Gradiente multicolor de marca — Rose + Violet + Gold */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 90% 65% at 75% 20%, rgba(155,111,212,.60) 0%, transparent 55%),
                radial-gradient(ellipse 70% 60% at 15% 75%, rgba(200,81,122,.75) 0%, transparent 52%),
                radial-gradient(ellipse 50% 45% at 85% 80%, rgba(201,150,58,.35) 0%, transparent 55%),
                linear-gradient(158deg, #240818 0%, #130210 100%)
              `,
            }}
          />

          {/* Orbs decorativos estáticos */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full"
              style={{ background: 'radial-gradient(circle at 40% 40%, rgba(200,81,122,.35) 0%, transparent 68%)' }} />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle at 40% 40%, rgba(155,111,212,.40) 0%, transparent 68%)' }} />
            <div className="absolute top-1/3 right-[8%] h-[240px] w-[240px] rounded-full"
              style={{ background: 'radial-gradient(circle at 40% 40%, rgba(201,150,58,.22) 0%, transparent 68%)' }} />
            {/* Anillos */}
            <div className="absolute -top-48 -right-48 h-[640px] w-[640px] rounded-full border border-white/[0.05]" />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full"
              style={{ border: '1px solid rgba(200,81,122,.06)' }} />
          </div>

          {/* Overlay de texto adicional para legibilidad del subtítulo */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }}
          />
        </>
      )}

      {/* ── Contenido ── */}
      <div
        className="relative z-10 mx-auto w-full max-w-3xl px-5 lg:px-8"
        style={{ animation: 'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* Badge — identidad del negocio */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {/* Chip de identidad */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.12] px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
            🎈 Decoración de Eventos
          </span>
          {/* Chip de zona */}
          {hero.badge_text && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[0.65rem] font-medium text-white/70">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--wa)]"
                style={{ animation: 'dot-blink 2.2s ease infinite' }}
                aria-hidden="true"
              />
              {hero.badge_text}
            </span>
          )}
        </div>

        {/* Headline */}
        <h1
          className="mb-3 font-heading leading-[0.96] tracking-[-0.02em] text-white"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 300 }}
        >
          {hero.headline}
          {hero.headline_em && (
            <>
              {' '}
              <em
                className="block font-heading italic"
                style={{
                  fontSize: '1.06em',
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

        {/* Subheadline — con sombra de texto para legibilidad garantizada */}
        {hero.subheadline && (
          <p
            className="mb-8 max-w-[30rem] text-[0.97rem] font-light leading-[1.75]"
            style={{
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 1px 8px rgba(0,0,0,0.55)',
            }}
          >
            {hero.subheadline}
          </p>
        )}

        {/* CTAs — solo 2, no más */}
        <div className="flex flex-wrap items-center gap-3">
          {/* CTA primario — WA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('hero_primary')}
            className="flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[0.95rem] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
            style={{
              background: 'var(--wa)',
              boxShadow: '0 6px 24px rgba(37,211,102,0.44)',
            }}
          >
            <WaIcon size={18} />
            {hero.cta_primary_text ?? 'Cotizar gratis'}
          </a>

          {/* CTA secundario — ver portafolio */}
          <Link
            href="/portafolio"
            className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/[0.1] px-5 py-3.5 text-[0.875rem] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.18]"
          >
            Ver trabajos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Indicadores de confianza debajo de los CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {[
            { icon: '✅', text: 'Sin costo de cotización' },
            { icon: '📍', text: 'Guadalajara y ZMG' },
            { icon: '⭐', text: 'Más de 50 eventos' },
          ].map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 text-[0.7rem] font-medium"
              style={{
                color: 'rgba(255,255,255,0.65)',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            >
              <span className="text-[0.85em]">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
