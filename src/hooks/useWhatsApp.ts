'use client'

import { useCallback } from 'react'
import { buildWhatsAppUrl, buildContextualMessage } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/analytics'

interface UseWhatsAppOptions {
  number:          string
  defaultMessage:  string
}

interface OpenWhatsAppOptions {
  context:         'hero' | 'service' | 'lightbox' | 'float' | 'cta_final' | 'faq'
  specificMessage?: string
  serviceName?:    string
}

export function useWhatsApp({ number, defaultMessage }: UseWhatsAppOptions) {
  const open = useCallback(
    ({ context, specificMessage, serviceName }: OpenWhatsAppOptions) => {
      const message = buildContextualMessage(context, {
        defaultMessage,
        specificMessage,
        serviceName,
      })

      const url = buildWhatsAppUrl({ number, message })

      // Registrar en analytics antes de abrir
      trackWhatsAppClick(context, { service_name: serviceName })

      window.open(url, '_blank', 'noopener,noreferrer')
    },
    [number, defaultMessage]
  )

  const buildUrl = useCallback(
    ({ context, specificMessage, serviceName }: OpenWhatsAppOptions) => {
      const message = buildContextualMessage(context, {
        defaultMessage,
        specificMessage,
        serviceName,
      })
      return buildWhatsAppUrl({ number, message })
    },
    [number, defaultMessage]
  )

  return { open, buildUrl }
}
