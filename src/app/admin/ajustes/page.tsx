import { requireOwner } from '@/lib/auth'
import { getSiteConfig, getSeoConfig } from '@/lib/queries/site-config'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AjustesClient } from '@/components/admin/AjustesClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Ajustes' }

export default async function AjustesPage() {
  await requireOwner()
  const [config, seo] = await Promise.all([getSiteConfig(), getSeoConfig()])

  return (
    <AdminLayout title="Ajustes">
      <AjustesClient config={config} seo={seo} />
    </AdminLayout>
  )
}
