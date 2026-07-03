'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { requireOwner } from '@/lib/auth'
import { revalidateSite } from '@/lib/actions/revalidate'
import { MAX_FEATURED_SERVICES } from '@/lib/constants'
import { z } from 'zod'

const ServiceSchema = z.object({
  name:              z.string().min(3).max(40),
  icon:              z.string().min(1).max(10),
  short_description: z.string().max(80).optional().nullable(),
  cover_image_url:   z.string().url().optional().nullable(),
  whatsapp_msg:      z.string().min(10).max(200),
  is_featured:       z.boolean().default(false),
  is_active:         z.boolean().default(true),
  sort_order:        z.number().int().default(0),
  category_id:       z.string().uuid().optional().nullable(),
})

export async function createService(data: z.infer<typeof ServiceSchema>) {
  const user   = await requireOwner()
  const parsed = ServiceSchema.parse(data)

  if (parsed.is_featured) {
    const supabase = await createAdminSupabaseClient()
    const { count } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)
      .eq('is_active', true)

    if ((count ?? 0) >= MAX_FEATURED_SERVICES) {
      throw new Error(`Solo puedes tener ${MAX_FEATURED_SERVICES} servicios destacados.`)
    }
  }

  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase
    .from('services')
    .insert({ ...parsed, created_by: user.id })

  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function updateService(id: string, data: Partial<z.infer<typeof ServiceSchema>>) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()

  if (data.is_featured) {
    const { count } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)
      .eq('is_active', true)
      .neq('id', id)

    if ((count ?? 0) >= MAX_FEATURED_SERVICES) {
      throw new Error(`Solo puedes tener ${MAX_FEATURED_SERVICES} servicios destacados.`)
    }
  }

  const { error } = await supabase
    .from('services')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function deleteService(id: string) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function updateServicesOrder(ids: string[]) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()

  const updates = ids.map((id, index) =>
    supabase.from('services').update({ sort_order: index }).eq('id', id)
  )

  await Promise.all(updates)
  await revalidateSite()
}
