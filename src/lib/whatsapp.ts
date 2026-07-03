interface BuildWhatsAppUrlOptions {
  /** Número en formato 52XXXXXXXXXX (sin +, sin espacios) */
  number: string
  /** Mensaje pre-llenado. Se URL-encodea automáticamente. */
  message?: string
}

/**
 * Construye la URL oficial de WhatsApp.
 * wa.me funciona tanto en móvil (abre la app) como en desktop (abre web.whatsapp.com).
 */
export function buildWhatsAppUrl({ number, message }: BuildWhatsAppUrlOptions): string {
  const cleanNumber = number.replace(/\D/g, '')
  const baseUrl     = `https://wa.me/${cleanNumber}`

  if (!message) return baseUrl

  const encodedMessage = encodeURIComponent(message.trim())
  return `${baseUrl}?text=${encodedMessage}`
}

/**
 * Genera el mensaje de WhatsApp según el contexto de origen.
 * Usa el mensaje específico si existe; si no, aplica un template por contexto.
 */
export function buildContextualMessage(
  context: 'hero' | 'service' | 'lightbox' | 'float' | 'cta_final' | 'faq',
  options: {
    defaultMessage:  string
    specificMessage?: string
    serviceName?:    string
  }
): string {
  const { defaultMessage, specificMessage, serviceName } = options

  if (specificMessage?.trim()) {
    return specificMessage
  }

  const contextMessages: Record<typeof context, string> = {
    hero:      defaultMessage,
    float:     defaultMessage,
    cta_final: defaultMessage,
    service:   serviceName
      ? `Hola Beauty Ballons! 🎈 Me interesa cotizar *${serviceName}* para mi evento. ¿Me pueden ayudar?`
      : defaultMessage,
    lightbox:  '¡Hola! 🎈 Vi esta decoración en su portafolio y me encantó. ¿Podrían cotizarme algo similar?',
    faq:       '¡Hola! Tengo una pregunta sobre sus servicios de decoración con globos. ¿Me pueden ayudar?',
  }

  return contextMessages[context] ?? defaultMessage
}

/**
 * Sanitiza y normaliza un número de WhatsApp al formato 52XXXXXXXXXX.
 * Acepta: "33 1234 5678", "+52 33 1234 5678", "5233XXXXXXXX"
 */
export function sanitizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '')

  // 12 dígitos que empiezan con 52 → ya tiene código de país
  if (digits.length === 12 && digits.startsWith('52')) {
    return digits
  }

  // 10 dígitos → número local, agregar código de México
  if (digits.length === 10) {
    return `52${digits}`
  }

  return digits
}
