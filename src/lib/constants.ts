// ─── Reglas de negocio del CMS ───────────────────────────────

/** Máximo de servicios marcados como destacados en el home */
export const MAX_FEATURED_SERVICES = 6

/** Máximo de fotos del portafolio en el preview del home */
export const MAX_FEATURED_PHOTOS = 8

/** Máximo recomendado de FAQs activas (aviso en admin si se supera) */
export const MAX_RECOMMENDED_FAQS = 7

/** Rating mínimo para poder marcar un testimonio como destacado */
export const MIN_FEATURED_RATING = 5

/** Solo 1 testimonio puede estar destacado en home simultáneamente */
export const MAX_FEATURED_TESTIMONIALS = 1

/** Número de pasos del proceso — fijo, no se crean ni eliminan */
export const PROCESS_STEPS_COUNT = 4

// ─── Límites de contenido ─────────────────────────────────────

export const CONTENT_LIMITS = {
  hero: {
    headline:    { min: 3,  max: 60  },
    subheadline: { min: 0,  max: 120 },
    badge_text:  { min: 0,  max: 40  },
    cta_text:    { min: 2,  max: 30  },
  },
  service: {
    name:        { min: 3,  max: 40  },
    description: { min: 0,  max: 80  },
    wa_msg:      { min: 10, max: 200 },
  },
  testimonial: {
    client_name: { min: 2,  max: 30  },
    content:     { min: 20, max: 200 },
  },
  faq: {
    question:    { min: 10, max: 120 },
    answer:      { min: 20, max: 400 },
  },
  photo: {
    alt_text:    { min: 5,  max: 100 },
    caption:     { min: 0,  max: 60  },
    wa_msg:      { min: 0,  max: 200 },
  },
  site: {
    site_name:   { min: 2,  max: 60  },
    tagline:     { min: 0,  max: 80  },
    coverage:    { min: 2,  max: 60  },
    response:    { min: 2,  max: 40  },
    legal_text:  { min: 0,  max: 200 },
  },
  lead: {
    name:        { min: 2,  max: 60  },
    message:     { min: 0,  max: 500 },
  },
} as const

// ─── Upload de imágenes ───────────────────────────────────────

export const UPLOAD_LIMITS = {
  maxFileSizeBytes:   20 * 1024 * 1024,
  maxOutputSizeBytes: 500 * 1024,
  minWidthPx:         400,
  minHeightPx:        400,
  thumbnailSize:      400,
  acceptedMimeTypes:  ['image/jpeg', 'image/png', 'image/webp', 'image/heic'] as string[],
} as const

// ─── Rutas del admin ──────────────────────────────────────────

export const ADMIN_ROUTES = {
  login:     '/admin/login',
  dashboard: '/admin/dashboard',
  leads:     '/admin/leads',
  portfolio: '/admin/portafolio',
  content:   '/admin/contenido',
  settings:  '/admin/ajustes',
} as const

// ─── Supabase Storage ─────────────────────────────────────────

export const STORAGE = {
  bucket: 'beauty-ballons',
  folders: {
    brand:      'brand',
    hero:       'hero',
    portfolio:  'portfolio/originals',
    thumbnails: 'portfolio/thumbnails',
    services:   'services',
    temp:       'temp',
  },
} as const

// ─── Analítica ────────────────────────────────────────────────

export const ANALYTICS_EVENTS = {
  WA_CLICK:         'whatsapp_click',
  PORTFOLIO_VIEW:   'portfolio_view',
  LIGHTBOX_OPEN:    'portfolio_lightbox_open',
  SERVICE_CLICK:    'service_card_click',
  LEAD_FORM_START:  'lead_form_start',
  LEAD_FORM_SUBMIT: 'lead_form_submit',
  FAQ_EXPAND:       'faq_expand',
  FILTER_CLICK:     'portfolio_filter_click',
  SOCIAL_CLICK:     'social_link_click',
  SCROLL_25:        'scroll_depth_25',
  SCROLL_50:        'scroll_depth_50',
  SCROLL_75:        'scroll_depth_75',
  SCROLL_100:       'scroll_depth_100',
} as const

// ─── Estados de leads ─────────────────────────────────────────

export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'closed', 'lost'] as const
export type LeadStatus = typeof LEAD_STATUSES[number]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new:       'Nuevo',
  contacted: 'Contactado',
  quoted:    'Cotizado',
  closed:    'Cerrado',
  lost:      'No concretó',
}

// ─── Acciones de CTA del hero ─────────────────────────────────

export const CTA_ACTIONS = [
  'whatsapp',
  'scroll_portfolio',
  'scroll_services',
  'scroll_contact',
] as const
export type CtaAction = typeof CTA_ACTIONS[number]

// ─── Rate limiting ────────────────────────────────────────────

export const RATE_LIMIT = {
  leadFormMaxPerHour: 3,
  loginMaxAttempts:   5,
} as const
