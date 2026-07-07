import { requireOwner } from '@/lib/auth'
import { getSiteConfig, getSeoConfig } from '@/lib/queries/site-config'
import { getAdminUsers } from '@/lib/actions/admin-users'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AjustesClient } from '@/components/admin/AjustesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Ajustes' }

export default async function AjustesPage() {
  const currentUser = await requireOwner()
  const [config, seo, adminUsers] = await Promise.all([
    getSiteConfig(),
    getSeoConfig(),
    getAdminUsers(),
  ])

  return (
    <AdminLayout title="Ajustes">
      <AjustesClient
        config={config}
        seo={seo}
        adminUsers={adminUsers}
        currentUserId={currentUser.id}
      />
    </AdminLayout>
  )
}
