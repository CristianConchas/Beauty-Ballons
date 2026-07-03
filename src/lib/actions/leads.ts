'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { requireAdminUser, requireOwner } from '@/lib/auth'
import type { LeadStatus } from '@/lib/constants'
import { z } from 'zod'

const CreateLeadSchema = z.object({
  name:         z.string().min(2).max(60),
  message:      z.string().max(500).optional(),
  source:       z.enum(['hero','service','portfolio','lightbox','float','cta_final','faq','unknown']),
  utm_source:   z.string().optional(),
  utm_medium:   z.string().optional(),
  utm_campaign: z.string().optional(),
  device_type:  z.enum(['mobile','desktop','tablet']).optional(),
})

/** Crea un lead desde el sitio público. Sin auth requerida. */
export async function createLeadPublic(
  data: z.infer<typeof CreateLeadSchema>
) {
  const parsed   = CreateLeadSchema.parse(data)
  const supabase = await createAdminSupabaseClient()

  const { error } = await supabase.from('leads').insert({
    ...parsed,
    status:      'new',
    is_read:     false,
    is_archived: false,
    admin_notes: null,
  })

  if (error) throw new Error(error.message)
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await requireAdminUser()
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase
    .from('leads')
    .update({ status, is_read: true })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function markLeadAsRead(id: string) {
  await requireAdminUser()
  const supabase = await createAdminSupabaseClient()
  await supabase.from('leads').update({ is_read: true }).eq('id', id)
}

export async function updateLeadNotes(id: string, notes: string) {
  await requireAdminUser()
  const supabase = await createAdminSupabaseClient()
  await supabase.from('leads').update({ admin_notes: notes }).eq('id', id)
}

export async function archiveLead(id: string) {
  await requireAdminUser()
  const supabase = await createAdminSupabaseClient()
  await supabase.from('leads').update({ is_archived: true }).eq('id', id)
}

export async function deleteLead(id: string) {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
