import type { LeadStatus } from '@/lib/constants'

export interface Lead {
  id:           string
  name:         string
  whatsapp:     string | null
  event_type:   string | null
  event_date:   string | null
  location:     string | null
  message:      string | null
  status:       LeadStatus
  source:       string
  utm_source:   string | null
  utm_medium:   string | null
  utm_campaign: string | null
  device_type:  string | null
  admin_notes:  string | null
  is_read:      boolean
  is_archived:  boolean
  created_at:   string
}

/** DTO para crear un lead desde el formulario público */
export interface CreateLeadDto {
  name:         string
  message?:     string
  source:       string
  utm_source?:  string
  utm_medium?:  string
  utm_campaign?: string
  device_type?: string
}
