import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ADMIN_ROUTES } from '@/lib/constants'

export type AdminRole = 'owner' | 'editor'

export interface AdminUser {
  id:    string
  email: string
  role:  AdminRole
}

/**
 * Obtiene el usuario admin autenticado actual.
 * Si no hay sesión o no está en admin_users → retorna null.
 * Usar en Server Components y Server Actions.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (adminError || !adminData) return null

    return {
      id:    user.id,
      email: user.email ?? '',
      role:  adminData.role as AdminRole,
    }
  } catch {
    return null
  }
}

/**
 * Requiere autenticación. Si no hay sesión → redirect al login.
 * Usar al inicio de Server Components protegidos.
 */
export async function requireAdminUser(): Promise<AdminUser> {
  const user = await getAdminUser()
  if (!user) {
    redirect(ADMIN_ROUTES.login)
    // redirect() lanza internamente — esta línea nunca se ejecuta
    // pero TypeScript necesita el throw para inferir el tipo correctamente
    throw new Error('unreachable')
  }
  return user
}

/**
 * Requiere rol Owner. Si es Editor → redirect al dashboard con error.
 */
export async function requireOwner(): Promise<AdminUser> {
  const user = await requireAdminUser()
  if (user.role !== 'owner') {
    redirect(`${ADMIN_ROUTES.dashboard}?error=unauthorized`)
    throw new Error('unreachable')
  }
  return user
}

/**
 * Verifica si el usuario tiene permiso para una operación.
 * Owner puede todo. Editor solo puede portafolio y leads.
 */
export function canPerform(
  user: AdminUser,
  action: 'manage_config' | 'manage_content' | 'manage_portfolio' | 'manage_leads'
): boolean {
  if (user.role === 'owner') return true

  // Editor solo puede gestionar portafolio y leads
  return action === 'manage_portfolio' || action === 'manage_leads'
}
