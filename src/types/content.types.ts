// ─── Servicios ────────────────────────────────────────────────

export interface ServiceCategory {
  id:         string
  name:       string
  slug:       string
  is_active:  boolean
  sort_order: number
  created_at: string
}

export interface Service {
  id:                string
  category_id:       string | null
  name:              string
  icon:              string
  short_description: string | null
  cover_image_url:   string | null
  whatsapp_msg:      string
  is_featured:       boolean
  is_active:         boolean
  sort_order:        number
  created_at:        string
  updated_at:        string
  category?:         ServiceCategory
}

// ─── Portafolio ───────────────────────────────────────────────

export interface PortfolioCategory {
  id:         string
  name:       string
  slug:       string
  is_active:  boolean
  sort_order: number
  created_at: string
}

export interface PortfolioPhoto {
  id:            string
  category_id:   string
  image_url:     string
  thumbnail_url: string
  alt_text:      string
  caption:       string | null
  whatsapp_msg:  string | null
  is_featured:   boolean
  is_active:     boolean
  sort_order:    number
  width:         number
  height:        number
  uploaded_at:   string
  category?:     PortfolioCategory
}

// ─── Testimonios ──────────────────────────────────────────────

export interface Testimonial {
  id:          string
  client_name: string
  event_type:  string
  location:    string | null
  rating:      number
  content:     string
  is_featured: boolean
  is_active:   boolean
  sort_order:  number
  created_at:  string
}

// ─── FAQ ──────────────────────────────────────────────────────

export interface Faq {
  id:            string
  question:      string
  answer:        string
  cta_in_answer: boolean
  is_active:     boolean
  sort_order:    number
  created_at:    string
}

// ─── Proceso ──────────────────────────────────────────────────

export interface ProcessStep {
  id:          string
  step_number: number
  icon:        string
  title:       string
  description: string
  is_active:   boolean
  sort_order:  number
}
