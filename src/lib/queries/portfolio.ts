import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { PortfolioPhoto, PortfolioCategory } from '@/types/content.types'

export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('portfolio_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as PortfolioCategory[]
}

export async function getAllPortfolioCategories(): Promise<PortfolioCategory[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('portfolio_categories')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as PortfolioCategory[]
}

export async function getFeaturedPhotos(): Promise<PortfolioPhoto[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('portfolio_photos')
    .select('*, category:portfolio_categories(id, name, slug)')
    .eq('is_active', true)          // mostrar todas las activas (no solo is_featured)
    .order('sort_order', { ascending: true })
    .limit(12)
  return (data ?? []) as unknown as PortfolioPhoto[]
}

export async function getAllActivePhotos(): Promise<PortfolioPhoto[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('portfolio_photos')
    .select('*, category:portfolio_categories(id, name, slug)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as unknown as PortfolioPhoto[]
}

export async function getAllPhotosAdmin(): Promise<PortfolioPhoto[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('portfolio_photos')
    .select('*, category:portfolio_categories(id, name, slug)')
    .order('uploaded_at', { ascending: false })
  return (data ?? []) as unknown as PortfolioPhoto[]
}
