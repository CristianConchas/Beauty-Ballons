/**
 * Tipos generados manualmente a partir del schema de Fase 2.
 * En producción, regenerar con: npm run db:types
 * (requiere Supabase CLI y SUPABASE_PROJECT_ID en .env)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id:         string
          role:       'owner' | 'editor'
          created_at: string
        }
        Insert: {
          id:          string
          role?:       'owner' | 'editor'
          created_at?: string
        }
        Update: {
          id?:         string
          role?:       'owner' | 'editor'
          created_at?: string
        }
      }
      site_config: {
        Row: {
          id:                     string
          site_name:              string
          tagline:                string | null
          logo_url:               string | null
          logo_dark_url:          string | null
          favicon_url:            string | null
          color_primary:          string
          color_secondary:        string
          color_accent:           string | null
          color_background:       string
          color_text:             string
          font_heading:           string
          font_body:              string
          whatsapp_number:        string
          whatsapp_default_msg:   string
          whatsapp_float_visible: boolean
          navbar_cta_text:        string
          cta_final_btn_text:     string
          show_mini_form:         boolean
          mini_form_placeholder:  string | null
          metric_1_value:         string
          metric_1_label:         string
          metric_2_value:         string
          metric_2_label:         string
          metric_3_value:         string
          metric_3_label:         string
          trust_bar_visible:      boolean
          coverage_zone:          string
          response_time:          string
          events_count:           number
          price_range:            string | null
          opening_hours:          string | null
          legal_text:             string | null
          privacy_policy_url:     string | null
          maintenance_mode:       boolean
          maintenance_msg:        string | null
          updated_at:             string
        }
        Insert: Partial<Database['public']['Tables']['site_config']['Row']>
        Update: Partial<Database['public']['Tables']['site_config']['Row']>
      }
      seo_config: {
        Row: {
          id:                  string
          meta_title:          string
          meta_description:    string
          meta_keywords:       string[] | null
          og_title:            string | null
          og_description:      string | null
          og_image_url:        string
          canonical_url:       string
          schema_city:         string
          schema_region:       string
          schema_country:      string
          schema_area_served:  string[]
          google_analytics_id: string | null
          meta_pixel_id:       string | null
          tiktok_pixel_id:     string | null
          updated_at:          string
        }
        Insert: Partial<Database['public']['Tables']['seo_config']['Row']>
        Update: Partial<Database['public']['Tables']['seo_config']['Row']>
      }
      social_links: {
        Row: {
          id:         string
          platform:   'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'twitter'
          url:        string
          username:   string | null
          is_active:  boolean
          sort_order: number
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['social_links']['Row']>
        Update: Partial<Database['public']['Tables']['social_links']['Row']>
      }
      hero_section: {
        Row: {
          id:                   string
          badge_text:           string | null
          headline:             string
          subheadline:          string | null
          cta_primary_text:     string
          cta_primary_action:   string
          cta_secondary_text:   string | null
          cta_secondary_action: string | null
          bg_image_url:         string
          bg_image_mobile_url:  string | null
          bg_overlay_opacity:   number
          show_balloons:        boolean
          text_align:           'left' | 'center'
          updated_at:           string
        }
        Insert: Partial<Database['public']['Tables']['hero_section']['Row']>
        Update: Partial<Database['public']['Tables']['hero_section']['Row']>
      }
      section_labels: {
        Row: {
          id:          string
          section_key: string
          title:       string
          subtitle:    string | null
          updated_at:  string
        }
        Insert: Partial<Database['public']['Tables']['section_labels']['Row']>
        Update: Partial<Database['public']['Tables']['section_labels']['Row']>
      }
      process_steps: {
        Row: {
          id:          string
          step_number: number
          icon:        string
          title:       string
          description: string
          is_active:   boolean
          sort_order:  number
          updated_at:  string
        }
        Insert: Partial<Database['public']['Tables']['process_steps']['Row']>
        Update: Partial<Database['public']['Tables']['process_steps']['Row']>
      }
      service_categories: {
        Row: {
          id:         string
          name:       string
          slug:       string
          is_active:  boolean
          sort_order: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['service_categories']['Row']>
        Update: Partial<Database['public']['Tables']['service_categories']['Row']>
      }
      services: {
        Row: {
          id:                string
          category_id:       string | null
          created_by:        string | null
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
        }
        Insert: Partial<Database['public']['Tables']['services']['Row']>
        Update: Partial<Database['public']['Tables']['services']['Row']>
      }
      portfolio_categories: {
        Row: {
          id:         string
          name:       string
          slug:       string
          is_active:  boolean
          sort_order: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['portfolio_categories']['Row']>
        Update: Partial<Database['public']['Tables']['portfolio_categories']['Row']>
      }
      portfolio_photos: {
        Row: {
          id:            string
          category_id:   string
          created_by:    string | null
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
          updated_at:    string
        }
        Insert: Partial<Database['public']['Tables']['portfolio_photos']['Row']>
        Update: Partial<Database['public']['Tables']['portfolio_photos']['Row']>
      }
      testimonials: {
        Row: {
          id:          string
          created_by:  string | null
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
        Insert: Partial<Database['public']['Tables']['testimonials']['Row']>
        Update: Partial<Database['public']['Tables']['testimonials']['Row']>
      }
      faqs: {
        Row: {
          id:            string
          created_by:    string | null
          question:      string
          answer:        string
          cta_in_answer: boolean
          is_active:     boolean
          sort_order:    number
          created_at:    string
          updated_at:    string
        }
        Insert: Partial<Database['public']['Tables']['faqs']['Row']>
        Update: Partial<Database['public']['Tables']['faqs']['Row']>
      }
      leads: {
        Row: {
          id:           string
          name:         string
          whatsapp:     string | null
          event_type:   string | null
          event_date:   string | null
          location:     string | null
          message:      string | null
          status:       'new' | 'contacted' | 'quoted' | 'closed' | 'lost'
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
        Insert: Partial<Database['public']['Tables']['leads']['Row']>
        Update: Partial<Database['public']['Tables']['leads']['Row']>
      }
    }
    Views:     Record<string, never>
    Functions: {
      is_admin: { Args: Record<never, never>; Returns: boolean }
      is_owner: { Args: Record<never, never>; Returns: boolean }
    }
    Enums:     Record<string, never>
  }
}
