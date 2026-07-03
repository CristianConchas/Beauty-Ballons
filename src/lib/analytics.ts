'use client'

import { ANALYTICS_EVENTS } from '@/lib/constants'

type EventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]

interface EventParams {
  [key: string]: string | number | boolean | undefined
}

// Extensión del tipo Window para los scripts de analytics
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?:  (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/**
 * Dispara un evento en GA4 y en Meta Pixel simultáneamente.
 * Es segura: no falla si los scripts no están cargados.
 */
export function trackEvent(eventName: EventName, params?: EventParams): void {
  if (typeof window === 'undefined') return

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params ?? {})
  }

  // Meta Pixel — mapeo de eventos personalizados a estándar de Meta
  if (typeof window.fbq === 'function') {
    const metaEventMap: Partial<Record<EventName, string>> = {
      [ANALYTICS_EVENTS.WA_CLICK]:         'Lead',
      [ANALYTICS_EVENTS.LIGHTBOX_OPEN]:    'ViewContent',
      [ANALYTICS_EVENTS.LEAD_FORM_SUBMIT]: 'Contact',
    }

    const metaEvent = metaEventMap[eventName]
    if (metaEvent) {
      window.fbq('track', metaEvent, params ?? {})
    } else {
      window.fbq('trackCustom', eventName, params ?? {})
    }
  }
}

/**
 * Helper para rastrear clics en WhatsApp (conversión principal).
 */
export function trackWhatsAppClick(source: string, additionalParams?: EventParams): void {
  trackEvent(ANALYTICS_EVENTS.WA_CLICK, {
    source,
    ...additionalParams,
  })
}

/**
 * Helper para rastrear scroll depth.
 * Llamado desde useScrollProgress.
 */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100): void {
  const eventMap = {
    25:  ANALYTICS_EVENTS.SCROLL_25,
    50:  ANALYTICS_EVENTS.SCROLL_50,
    75:  ANALYTICS_EVENTS.SCROLL_75,
    100: ANALYTICS_EVENTS.SCROLL_100,
  } as const

  trackEvent(eventMap[depth], { depth_percentage: depth })
}
