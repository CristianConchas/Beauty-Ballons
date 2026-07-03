import { requireAdminUser } from '@/lib/auth'
import { getLeads } from '@/lib/queries/leads'
import { getSiteConfig } from '@/lib/queries/site-config'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { LeadsClient } from '@/components/admin/LeadsClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Leads' }

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdminUser()
  const params = await searchParams
  const status = params.status ?? 'all'

  const [leads, config] = await Promise.all([
    getLeads({ status: status !== 'all' ? status : undefined }),
    getSiteConfig(),
  ])

  return (
    <AdminLayout title="Leads">
      <LeadsClient
        leads={leads}
        waNumber={config?.whatsapp_number ?? ''}
        currentStatus={status}
      />
    </AdminLayout>
  )
}
