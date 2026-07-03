import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Lead } from '@/types/lead.types'

export async function getLeads(options?: {
  status?:   string
  archived?: boolean
  limit?:    number
}): Promise<Lead[]> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('leads')
    .select('*')
    .eq('is_archived', options?.archived ?? false)
    .order('created_at', { ascending: false })

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data } = await query
  return (data ?? []) as Lead[]
}

export async function getUnreadLeadsCount(): Promise<number> {
  const supabase = await createServerSupabaseClient()
  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
    .eq('is_archived', false)
  return count ?? 0
}

export async function getDashboardStats(): Promise<{
  newLeads:    number
  totalPhotos: number
  totalServices: number
}> {
  const supabase = await createServerSupabaseClient()

  const [leadsRes, photosRes, servicesRes] = await Promise.all([
    supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')
      .eq('is_archived', false),
    supabase
      .from('portfolio_photos')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
  ])

  return {
    newLeads:      leadsRes.count      ?? 0,
    totalPhotos:   photosRes.count     ?? 0,
    totalServices: servicesRes.count   ?? 0,
  }
}
