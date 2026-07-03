'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { requireOwner } from '@/lib/auth'
import { revalidateSite } from '@/lib/actions/revalidate'
import { z } from 'zod'

// ── Helpers para actualizar tablas singleton ──────────────────
// Estas tablas siempre tienen exactamente 1 fila. Hacemos
// UPDATE sin WHERE (Supabase actualiza todas las filas = la única).
// Usamos .neq('id', '') que siempre es verdadero — forma idiomática
// recomendada por Supabase para singleton updates sin conocer el ID.

type SingletonTable = 'site_config' | 'seo_config' | 'hero_section'

async function updateSingleton(table: SingletonTable, data: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createAdminSupabaseClient() as any
  const { data: row } = await supabase
    .from(table)
    .select('id')
    .limit(1)
    .single()

  if (!row?.id) throw new Error(`No se encontró configuración en ${table}`)

  const { error } = await supabase
    .from(table)
    .update(data)
    .eq('id', row.id)

  if (error) throw new Error(error.message)
}

// ── Testimonios ───────────────────────────────────────────────

const TestimonialSchema = z.object({
  client_name: z.string().min(2).max(30),
  event_type:  z.string().min(2).max(30),
  location:    z.string().max(30).optional().nullable(),
  rating:      z.number().int().min(1).max(5),
  content:     z.string().min(20).max(200),
  is_featured: z.boolean().default(false),
  is_active:   z.boolean().default(true),
  sort_order:  z.number().int().default(0),
})

export async function createTestimonial(data: z.infer<typeof TestimonialSchema>) {
  const user   = await requireOwner()
  const parsed = TestimonialSchema.parse(data)

  if (parsed.is_featured && parsed.rating < 5) {
    throw new Error('Solo los testimonios de 5 estrellas pueden destacarse.')
  }

  const supabase = await createAdminSupabaseClient()

  if (parsed.is_featured) {
    await supabase
      .from('testimonials')
      .update({ is_featured: false })
      .eq('is_featured', true)
  }

  const { error } = await supabase
    .from('testimonials')
    .insert({ ...parsed, created_by: user.id })

  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function updateTestimonial(
  id:   string,
  data: Partial<z.infer<typeof TestimonialSchema>>
) {
  await requireOwner()

  if (data.is_featured && data.rating && data.rating < 5) {
    throw new Error('Solo los testimonios de 5 estrellas pueden destacarse.')
  }

  const supabase = await createAdminSupabaseClient()

  if (data.is_featured) {
    await supabase
      .from('testimonials')
      .update({ is_featured: false })
      .neq('id', id)
  }

  const { error } = await supabase.from('testimonials').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function deleteTestimonial(id: string) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  await supabase.from('testimonials').delete().eq('id', id)
  await revalidateSite()
}

// ── FAQ ───────────────────────────────────────────────────────

const FaqSchema = z.object({
  question:      z.string().min(10).max(120),
  answer:        z.string().min(20).max(400),
  cta_in_answer: z.boolean().default(false),
  is_active:     z.boolean().default(true),
  sort_order:    z.number().int().default(0),
})

export async function createFaq(data: z.infer<typeof FaqSchema>) {
  const user     = await requireOwner()
  const parsed   = FaqSchema.parse(data)
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase
    .from('faqs')
    .insert({ ...parsed, created_by: user.id })
  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function updateFaq(id: string, data: Partial<z.infer<typeof FaqSchema>>) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase.from('faqs').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function deleteFaq(id: string) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  await supabase.from('faqs').delete().eq('id', id)
  await revalidateSite()
}

export async function updateFaqsOrder(ids: string[]) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  await Promise.all(
    ids.map((id, i) => supabase.from('faqs').update({ sort_order: i }).eq('id', id))
  )
  await revalidateSite()
}

// ── Proceso ───────────────────────────────────────────────────

export async function updateProcessStep(
  id:   string,
  data: { icon?: string; title?: string; description?: string; is_active?: boolean }
) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase.from('process_steps').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  await revalidateSite()
}

// ── Hero (singleton) ──────────────────────────────────────────

export async function updateHero(data: Record<string, unknown>) {
  await requireOwner()
  await updateSingleton('hero_section', data)
  await revalidateSite()
}

// ── Site config (singleton) ───────────────────────────────────

export async function updateSiteConfig(data: Record<string, unknown>) {
  await requireOwner()
  await updateSingleton('site_config', data)
  await revalidateSite()
}

// ── SEO config (singleton) ────────────────────────────────────

export async function updateSeoConfig(data: Record<string, unknown>) {
  await requireOwner()
  await updateSingleton('seo_config', data)
  await revalidateSite()
}

// ── Section labels ────────────────────────────────────────────

export async function updateSectionLabel(
  key:  string,
  data: { title: string; subtitle?: string | null }
) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase
    .from('section_labels')
    .update(data)
    .eq('section_key', key)
  if (error) throw new Error(error.message)
  await revalidateSite()
}

// ── Redes sociales ────────────────────────────────────────────

export async function updateSocialLink(
  id:   string,
  data: { url?: string; username?: string; is_active?: boolean; sort_order?: number }
) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase.from('social_links').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  await revalidateSite()
}
