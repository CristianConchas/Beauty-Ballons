'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ADMIN_ROUTES } from '@/lib/constants'
import { z } from 'zod'

const LoginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña demasiado corta'),
})

interface ActionResult {
  error?: string
}

export async function loginAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = LoginSchema.safeParse({
    email:    formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Credenciales inválidas.' }
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  })

  if (error || !data.user) {
    // Mensaje genérico — nunca revelar si el email existe
    return { error: 'Credenciales incorrectas. Verifica tu email y contraseña.' }
  }

  // Verificar que el usuario está en admin_users
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('id', data.user.id)
    .single()

  if (!adminUser) {
    await supabase.auth.signOut()
    return { error: 'No tienes acceso al panel de administración.' }
  }

  // Redirigir al dashboard
  redirect(ADMIN_ROUTES.dashboard)
  throw new Error('unreachable')
}

export async function logoutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect(ADMIN_ROUTES.login)
  throw new Error('unreachable')
}
