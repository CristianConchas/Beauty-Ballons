/**
 * ============================================================
 * ARCHIVO DE CONFIGURACIÓN DEL CLIENTE
 * ============================================================
 * Este es el único archivo que DEBES modificar para adaptar
 * el framework a un nuevo cliente. Todos los valores aquí
 * son los fallbacks cuando la base de datos no está disponible.
 *
 * Los valores reales en producción se gestionan desde el
 * panel admin en /admin/ajustes y se almacenan en Supabase.
 * ============================================================
 */

export const CLIENT_CONFIG = {
  // ── Identidad del negocio ─────────────────────────────────
  site: {
    name:         'Beauty Ballons',
    tagline:      'Decoración de eventos con globos',
    description:  'Decoración de eventos con globos en Guadalajara, Zapopan y ZMG. Bodas, XV Años, Baby Shower y más.',
    url:          process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beautyballons.vercel.app',
    locale:       'es_MX',
    /** Nombre del bucket en Supabase Storage */
    storageBucket: 'beauty-ballons',
  },

  // ── Ubicación (SEO local) ─────────────────────────────────
  location: {
    city:         'Guadalajara',
    region:       'Jalisco',
    country:      'MX',
    coverageZone: 'Zona Metropolitana de Guadalajara',
    areaServed:   ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco de Zúñiga'],
    openingHours: 'Mo-Su 09:00-20:00',
    priceRange:   '$$',
  },

  // ── Colores de marca ──────────────────────────────────────
  branding: {
    colors: {
      primary:    '#D4618C',
      secondary:  '#9B6FD4',
      accent:     '#F4A261',
      background: '#FFFBFE',
      text:       '#1C1B1F',
    },
    fonts: {
      heading: 'Playfair Display',
      body:    'Inter',
    },
  },

  // ── Canal de conversión (WhatsApp) ────────────────────────
  whatsapp: {
    /** Formato: 52XXXXXXXXXX — código de país + número sin espacios */
    number:  process.env.NEXT_PUBLIC_WA_FALLBACK_NUMBER ?? '523322942088',
    message: 'Hola Beauty Ballons! Me gustaría cotizar una decoración para mi evento.',
  },

  // ── Operación ─────────────────────────────────────────────
  operation: {
    responseTime: '1 a 2 horas',
    eventsCount:  50,
  },

  // ── Redes sociales (fallback) ─────────────────────────────
  social: {
    instagram: 'https://www.instagram.com/beauty_.balloons',
    facebook:  'https://www.facebook.com/share/1BWgFdbjAs/',
    tiktok:    'https://vt.tiktok.com/ZSCxwjGev/',
  },
} as const

export type ClientConfig = typeof CLIENT_CONFIG
