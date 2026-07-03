'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { requireAdminUser, requireOwner } from '@/lib/auth'
import { revalidateSite } from '@/lib/actions/revalidate'
import { STORAGE, MAX_FEATURED_PHOTOS } from '@/lib/constants'
import { z } from 'zod'

const PhotoMetaSchema = z.object({
  category_id:  z.string().uuid(),
  alt_text:     z.string().min(5).max(100),
  caption:      z.string().max(60).optional().nullable(),
  whatsapp_msg: z.string().max(200).optional().nullable(),
  is_featured:  z.boolean().default(false),
  is_active:    z.boolean().default(true),
  sort_order:   z.number().int().default(0),
  width:        z.number().int().positive(),
  height:       z.number().int().positive(),
  image_url:    z.string().url(),
  thumbnail_url:z.string().url(),
})

export async function createPhoto(data: z.infer<typeof PhotoMetaSchema>) {
  const user   = await requireAdminUser()
  const parsed = PhotoMetaSchema.parse(data)

  if (parsed.is_featured) {
    const supabase = await createAdminSupabaseClient()
    const { count } = await supabase
      .from('portfolio_photos')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)
      .eq('is_active', true)

    if ((count ?? 0) >= MAX_FEATURED_PHOTOS) {
      throw new Error(`Solo puedes tener ${MAX_FEATURED_PHOTOS} fotos destacadas en el home.`)
    }
  }

  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase
    .from('portfolio_photos')
    .insert({ ...parsed, created_by: user.id })

  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function updatePhoto(
  id:   string,
  data: Partial<z.infer<typeof PhotoMetaSchema>>
) {
  await requireAdminUser()
  const supabase = await createAdminSupabaseClient()

  if (data.is_featured) {
    const { count } = await supabase
      .from('portfolio_photos')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)
      .eq('is_active', true)
      .neq('id', id)

    if ((count ?? 0) >= MAX_FEATURED_PHOTOS) {
      throw new Error(`Solo puedes tener ${MAX_FEATURED_PHOTOS} fotos destacadas.`)
    }
  }

  const { error } = await supabase
    .from('portfolio_photos')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  await revalidateSite()
}

export async function deletePhoto(id: string, imageUrl: string) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()

  // Eliminar archivo de Storage
  const bucketPath = imageUrl.split(`${STORAGE.bucket}/`)[1]
  if (bucketPath) {
    await supabase.storage.from(STORAGE.bucket).remove([bucketPath])
  }

  // Eliminar thumbnail
  const thumbPath = imageUrl
    .replace('/originals/', '/thumbnails/')
    .split(`${STORAGE.bucket}/`)[1]
  if (thumbPath) {
    await supabase.storage.from(STORAGE.bucket).remove([thumbPath])
  }

  // Eliminar registro de DB
  const { error } = await supabase.from('portfolio_photos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await revalidateSite()
}

/**
 * Genera una URL firmada para subir directamente al Storage desde el browser.
 * El browser sube directo a Supabase, sin pasar por Next.js.
 */
export async function getUploadSignedUrl(
  filename:  string,
  mimeType:  string
): Promise<{ signedUrl: string; path: string }> {
  await requireAdminUser()

  const supabase  = await createAdminSupabaseClient()
  const ext       = filename.split('.').pop() ?? 'jpg'
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path       = `${STORAGE.folders.portfolio}/${uniqueName}`

  const { data, error } = await supabase.storage
    .from(STORAGE.bucket)
    .createSignedUploadUrl(path)

  if (error || !data) throw new Error('No se pudo generar URL de subida.')

  return { signedUrl: data.signedUrl, path }
}

export async function getCategoryPhotoCount(categoryId: string): Promise<number> {
  const supabase = await createAdminSupabaseClient()
  const { count } = await supabase
    .from('portfolio_photos')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId)
  return count ?? 0
}
