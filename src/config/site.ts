/**
 * Re-exporta CLIENT_CONFIG como SITE_DEFAULTS para compatibilidad
 * con el resto del codebase. No modificar este archivo.
 * Modificar: src/config/client.config.ts
 */
import { CLIENT_CONFIG } from '@/config/client.config'

export const SITE_DEFAULTS = {
  name:        CLIENT_CONFIG.site.name,
  description: CLIENT_CONFIG.site.description,
  url:         CLIENT_CONFIG.site.url,
  locale:      CLIENT_CONFIG.site.locale,
  city:        CLIENT_CONFIG.location.city,
  region:      CLIENT_CONFIG.location.region,
  country:     CLIENT_CONFIG.location.country,
  colors:      CLIENT_CONFIG.branding.colors,
  fonts:       CLIENT_CONFIG.branding.fonts,
  whatsapp:    CLIENT_CONFIG.whatsapp,
} as const
