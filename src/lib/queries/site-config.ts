import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { SiteConfig, SeoConfig, SocialLink } from '@/types/site.types'

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .single()

    if (error) return null
    return data as SiteConfig
  } catch {
    return null
  }
}

export async function getSeoConfig(): Promise<SeoConfig | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('seo_config')
      .select('*')
      .single()

    if (error) return null
    return data as SeoConfig
  } catch {
    return null
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) return []
    return (data ?? []) as SocialLink[]
  } catch {
    return []
  }
}
