'use server'

import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server'
import { requireOwner } from '@/lib/auth'
import { z } from 'zod'

const InviteSchema = z.object({
  email:    z.string().email('Email inválido'),
  role:     z.enum(['owner', 'editor']),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

const UpdateSchema = z.object({
  userId: z.string().uuid(),
  role:   z.enum(['owner', 'editor']),
})

const PasswordSchema = z.object({
  userId:      z.string().uuid(),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
})

/** Lista todos los usuarios admin con su email desde auth.users */
export async function getAdminUsers() {
  await requireOwner()
  const supabase = await createAdminSupabaseClient()

  // Obtener admin_users con su role
  const { data: adminUsers, error } = await supabase
    .from('admin_users')
    .select('id, role, created_at')
    .order('created_at', { ascending: true })

  if (error || !adminUsers) return []

  // Obtener emails de auth.users para cada admin
  const results = await Promise.all(
    adminUsers.map(async (admin) => {
      const { data } = await supabase.auth.admin.getUserById(admin.id)
      return {
        id:         admin.id,
        email:      data?.user?.email ?? 'Sin email',
        role:       admin.role as 'owner' | 'editor',
        created_at: admin.created_at,
        last_sign_in: data?.user?.last_sign_in_at ?? null,
      }
    })
  )

  return results
}

/** Crear nuevo usuario admin con email + contraseña */
export async function createAdminUser(data: {
  email:    string
  password: string
  role:     'owner' | 'editor'
}) {
  await requireOwner()

  const parsed = InviteSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const supabase = await createAdminSupabaseClient()

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email:             parsed.data.email,
    password:          parsed.data.password,
    email_confirm:     true, // confirmar automáticamente
  })

  if (authError) {
    if (authError.message.includes('already been registered')) {
      throw new Error('Este email ya tiene una cuenta.')
    }
    throw new Error(authError.message)
  }

  if (!authData.user) throw new Error('No se pudo crear el usuario.')

  // 2. Registrar en admin_users con su rol
  const { error: adminError } = await supabase
    .from('admin_users')
    .insert({ id: authData.user.id, role: parsed.data.role })

  if (adminError) {
    // Rollback: eliminar el usuario de auth si falla el registro
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw new Error('Error al asignar rol de administrador.')
  }
}

/** Cambiar rol de un usuario admin */
export async function updateAdminUserRole(data: { userId: string; role: 'owner' | 'editor' }) {
  const currentUser = await requireOwner()

  const parsed = UpdateSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  // No puede cambiar su propio rol
  if (parsed.data.userId === currentUser.id) {
    throw new Error('No puedes cambiar tu propio rol.')
  }

  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase
    .from('admin_users')
    .update({ role: parsed.data.role })
    .eq('id', parsed.data.userId)

  if (error) throw new Error('Error al actualizar el rol.')
}

/** Cambiar contraseña de un usuario */
export async function updateAdminUserPassword(data: { userId: string; newPassword: string }) {
  await requireOwner()

  const parsed = PasswordSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  const supabase = await createAdminSupabaseClient()
  const { error } = await supabase.auth.admin.updateUserById(parsed.data.userId, {
    password: parsed.data.newPassword,
  })

  if (error) throw new Error('Error al cambiar la contraseña.')
}

/** Cambiar la propia contraseña del usuario autenticado */
export async function updateOwnPassword(data: { currentPassword: string; newPassword: string }) {
  if (data.newPassword.length < 8) throw new Error('Mínimo 8 caracteres.')

  const supabase = await createServerSupabaseClient()

  // Re-autenticar con la contraseña actual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('No autenticado.')

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email:    user.email,
    password: data.currentPassword,
  })
  if (signInError) throw new Error('Contraseña actual incorrecta.')

  // Actualizar contraseña
  const { error } = await supabase.auth.updateUser({ password: data.newPassword })
  if (error) throw new Error('Error al actualizar la contraseña.')
}

/** Eliminar usuario admin */
export async function deleteAdminUser(userId: string) {
  const currentUser = await requireOwner()

  if (userId === currentUser.id) throw new Error('No puedes eliminarte a ti mismo.')

  const supabase = await createAdminSupabaseClient()

  // 1. Eliminar de admin_users
  await supabase.from('admin_users').delete().eq('id', userId)

  // 2. Eliminar de auth.users
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) throw new Error('Error al eliminar el usuario.')
}
