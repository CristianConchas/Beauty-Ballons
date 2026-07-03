import type { CtaAction } from '@/lib/constants'

// ─── Configuración global ─────────────────────────────────────

export interface SiteConfig {
  id: string
  site_name: string
  tagline: string | null
  logo_url: string | null
  logo_dark_url: string | null
  favicon_url: string | null

  color_primary:    string
  color_secondary:  string
  color_accent:     string | null
  color_background: string
  color_text:       string

  font_heading: string
  font_body:    string

  whatsapp_number:       string
  whatsapp_default_msg:  string
  whatsapp_float_visible: boolean
  navbar_cta_text:        string
  cta_final_btn_text:     string
  show_mini_form:         boolean
  mini_form_placeholder:  string | null

  metric_1_value:   string
  metric_1_label:   string
  metric_2_value:   string
  metric_2_label:   string
  metric_3_value:   string
  metric_3_label:   string
  trust_bar_visible: boolean

  coverage_zone:  string
  response_time:  string
  events_count:   number
  price_range:    string | null
  opening_hours:  string | null

  legal_text:          string | null
  privacy_policy_url:  string | null

  maintenance_mode: boolean
  maintenance_msg:  string | null

  updated_at: string
}

// ─── Configuración SEO ────────────────────────────────────────

export interface SeoConfig {
  id: string
  meta_title:       string
  meta_description: string
  meta_keywords:    string[] | null
  og_title:         string | null
  og_description:   string | null
  og_image_url:     string
  canonical_url:    string
  schema_city:       string
  schema_region:     string
  schema_country:    string
  schema_area_served: string[]
  google_analytics_id: string | null
  meta_pixel_id:       string | null
  tiktok_pixel_id:     string | null
  updated_at: string
}

// ─── Redes sociales ───────────────────────────────────────────

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter'

export interface SocialLink {
  id:         string
  platform:   SocialPlatform
  url:        string
  username:   string | null
  is_active:  boolean
  sort_order: number
  updated_at: string
}

// ─── Hero Section ─────────────────────────────────────────────

export interface HeroSection {
  id: string
  badge_text:          string | null
  headline:            string
  headline_em:         string | null   // E01 — frase en cursiva con gradiente
  subheadline:         string | null
  cta_primary_text:    string
  cta_primary_action:  CtaAction
  cta_secondary_text:  string | null
  cta_secondary_action: CtaAction | null
  bg_image_url:          string | null  // E03 — puede ser null o string vacío
  bg_image_mobile_url:   string | null
  bg_overlay_opacity:    number
  show_balloons:         boolean
  text_align:            'left' | 'center'
  updated_at:            string
}

// ─── Section Labels ───────────────────────────────────────────

export type SectionKey =
  | 'portfolio'
  | 'services'
  | 'process'
  | 'testimonials'
  | 'faq'
  | 'cta_final'

export interface SectionLabel {
  id:          string
  section_key: SectionKey
  title:       string
  subtitle:    string | null
  updated_at:  string
}
