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

/** Genera un mensaje de WA atractivo y contextual para cada servicio */
function buildServiceMessage(service: Service, fallback: string): string {
  if (service.whatsapp_msg && service.whatsapp_msg.length > 20) {
    return service.whatsapp_msg
  }
  // Mensaje por defecto atractivo si el de la DB está vacío o es muy corto
  return `¡Hola Beauty Ballons! 🎈 Me interesa cotizar *${service.name}* para mi evento. ¿Me pueden dar más información sobre precios y disponibilidad?`
}

export function ServicesSection({ services, label, waNumber, waDefaultMsg }: ServicesSectionProps) {
  if (!services.length) return null

  function handleServiceClick(service: Service) {
    trackEvent(ANALYTICS_EVENTS.SERVICE_CLICK, {
      service_name: service.name,
      service_id:   service.id,
    })
    const message = buildServiceMessage(service, waDefaultMsg)
    const url = buildWhatsAppUrl({ number: waNumber, message })
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
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center reveal">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--color-primary)' }}>
              Servicios
            </p>
            <h2
              className="font-heading leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)' }}
            >
              ¿Qué{' '}
              <em className="italic" style={{ color: 'var(--color-primary)' }}>
                {label?.title ?? 'necesitas?'}
              </em>
            </h2>
            {label?.subtitle && (
              <p className="mt-2 text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
                {label.subtitle}
              </p>
            )}
          </div>

          {/* Grid — 3 columnas en móvil, 4 en desktop */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
            {services.map((service, i) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="group relative flex flex-col items-center gap-2 rounded-2xl border bg-[var(--bg-surface)] p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 sm:p-4 reveal"
                style={{
                  borderColor: 'var(--border-light)',
                  animationDelay: `${(i % 4) * 0.06}s`,
                }}
                aria-label={`Cotizar ${service.name} por WhatsApp`}
              >
                {/* Icono */}
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: 'rgba(200,81,122,0.09)' }}
                >
                  {service.icon}
                </span>

                {/* Nombre */}
                <span
                  className="text-[0.7rem] font-semibold leading-tight sm:text-[0.75rem]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {service.name}
                </span>

                {/* Descripción corta — solo en sm+ */}
                {service.short_description && (
                  <span
                    className="hidden text-[0.65rem] font-light leading-snug sm:block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {service.short_description}
                  </span>
                )}

                {/* Indicador de tap — ícono de WA mini */}
                <span
                  className="mt-0.5 flex items-center gap-0.5 text-[0.58rem] font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ color: 'var(--wa)' }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
                  </svg>
                  Cotizar
                </span>
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-[0.72rem]" style={{ color: 'var(--text-muted)' }}>
            Toca cualquier servicio para recibir una cotización personalizada →
          </p>
        </div>
      </section>
    </>
  )
}
