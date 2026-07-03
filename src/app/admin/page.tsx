import { redirect } from 'next/navigation'
import { ADMIN_ROUTES } from '@/lib/constants'

/**
 * /admin redirige automáticamente a /admin/dashboard.
 * La redirección también está en next.config.ts como fallback.
 */
export default function AdminPage() {
  redirect(ADMIN_ROUTES.dashboard)
}
