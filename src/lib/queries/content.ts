import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { HeroSection, SectionLabel, SectionKey } from '@/types/site.types'
import type { Testimonial, Faq, ProcessStep } from '@/types/content.types'

export async function getHeroSection(): Promise<HeroSection | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('hero_section').select('*').single()
  return data as HeroSection | null
}

export async function getSectionLabel(key: SectionKey): Promise<SectionLabel | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('section_labels')
    .select('*')
    .eq('section_key', key)
    .single()
  return data as SectionLabel | null
}

export async function getAllSectionLabels(): Promise<SectionLabel[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('section_labels').select('*')
  return (data ?? []) as SectionLabel[]
}

export async function getFeaturedTestimonial(): Promise<Testimonial | null> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .single()
  return data as Testimonial | null
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as Testimonial[]
}

export async function getActiveFaqs(): Promise<Faq[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as Faq[]
}

export async function getAllFaqsAdmin(): Promise<Faq[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as Faq[]
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('process_steps')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as ProcessStep[]
}

export async function getAllProcessSteps(): Promise<ProcessStep[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('process_steps')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as ProcessStep[]
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as Testimonial[]
}
