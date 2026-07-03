'use client'

import { trackEvent } from '@/lib/analytics'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { ANALYTICS_EVENTS } from '@/lib/constants'
import type { Service } from '@/types/content.types'
import type { SectionLabel } from '@/types/site.types'

interface ServicesSectionProps {
  services:     Service[]
  label:        SectionLabel | null
  waNumber:     string
  waDefaultMsg: string
}

export function ServicesSection({ services, label, waNumber, waDefaultMsg }: ServicesSectionProps) {
  if (!services.length) return null

  function handleServiceClick(service: Service) {
    trackEvent(ANALYTICS_EVENTS.SERVICE_CLICK, {
      service_name: service.name,
      service_id:   service.id,
    })
    const url = buildWhatsAppUrl({
      number:  waNumber,
      message: service.whatsapp_msg || waDefaultMsg,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="section-divider" />
      <section
        id="servicios"
        className="section-warm"
        style={{ padding: 'var(--section-py) 1.25rem' }}
      >
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-10 text-center reveal">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Servicios
            </p>
            <h2
              className="font-heading leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)' }}
            >
              ¿Qué{' '}
              <em
                className="italic"
                style={{ color: 'var(--color-primary)' }}
              >
                {label?.title ?? 'necesitas?'}
              </em>
            </h2>
            {label?.subtitle && (
              <p className="mt-2 text-[0.875rem] text-[var(--text-secondary)] font-light">
                {label.subtitle}
              </p>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
            {services.map((service, i) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className={`group flex flex-col items-center gap-2.5 rounded-2xl border bg-[var(--bg-surface)] p-3.5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 sm:p-4 reveal reveal-delay-${Math.min(i + 1, 4)}`}
                style={{ borderColor: 'var(--border-light)' }}
                aria-label={`Cotizar ${service.name} por WhatsApp`}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: 'rgba(200,81,122,0.09)' }}
                >
                  {service.icon}
                </span>
                <span
                  className="text-[0.7rem] font-semibold leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {service.name}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-[0.72rem]" style={{ color: 'var(--text-muted)' }}>
            Toca cualquier servicio para cotizar al instante →
          </p>
        </div>
      </section>
    </>
  )
}
