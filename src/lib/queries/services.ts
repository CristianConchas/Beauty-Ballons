import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Service, ServiceCategory } from '@/types/content.types'

export async function getFeaturedServices(): Promise<Service[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('services')
    .select('*, category:service_categories(id, name, slug)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(6)
  return (data ?? []) as unknown as Service[]
}

export async function getAllServicesAdmin(): Promise<Service[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('services')
    .select('*, category:service_categories(id, name, slug)')
    .order('sort_order', { ascending: true })
  return (data ?? []) as unknown as Service[]
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as ServiceCategory[]
}
