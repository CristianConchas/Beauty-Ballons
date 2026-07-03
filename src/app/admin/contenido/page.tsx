import { requireAdminUser } from '@/lib/auth'
import {
  getHeroSection, getAllSectionLabels, getAllTestimonialsAdmin,
  getAllFaqsAdmin, getAllProcessSteps,
} from '@/lib/queries/content'
import { getAllServicesAdmin, getServiceCategories } from '@/lib/queries/services'
import { getSocialLinks } from '@/lib/queries/site-config'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ContentClient } from '@/components/admin/ContentClient'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Contenido' }

export default async function ContentPage() {
  const user = await requireAdminUser()
  const [hero, labels, services, categories, testimonials, faqs, steps, socials] =
    await Promise.all([
      getHeroSection(),
      getAllSectionLabels(),
      getAllServicesAdmin(),
      getServiceCategories(),
      getAllTestimonialsAdmin(),
      getAllFaqsAdmin(),
      getAllProcessSteps(),
      getSocialLinks(),
    ])

  return (
    <AdminLayout title="Contenido">
      <ContentClient
        hero={hero}
        sectionLabels={labels}
        services={services}
        serviceCategories={categories}
        testimonials={testimonials}
        faqs={faqs}
        processSteps={steps}
        socialLinks={socials}
        isOwner={user.role === 'owner'}
      />
    </AdminLayout>
  )
}
