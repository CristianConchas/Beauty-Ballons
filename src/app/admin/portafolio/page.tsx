import { requireAdminUser } from '@/lib/auth'
import { getAllPhotosAdmin, getAllPortfolioCategories } from '@/lib/queries/portfolio'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PortfolioAdminClient } from '@/components/admin/PortfolioAdminClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Portafolio' }

export default async function AdminPortfolioPage() {
  await requireAdminUser()
  const [photos, categories] = await Promise.all([
    getAllPhotosAdmin(),
    getAllPortfolioCategories(),
  ])

  return (
    <AdminLayout title="Portafolio">
      <PortfolioAdminClient photos={photos} categories={categories} />
    </AdminLayout>
  )
}
