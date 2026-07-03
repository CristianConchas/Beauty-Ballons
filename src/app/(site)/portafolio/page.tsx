import type { Metadata } from 'next'
import { getAllActivePhotos, getPortfolioCategories } from '@/lib/queries/portfolio'
import { getSectionLabel } from '@/lib/queries/content'
import { getSiteConfig } from '@/lib/queries/site-config'
import { Navbar } from '@/components/site/Navbar'
import { PortfolioSection } from '@/components/site/PortfolioSection'
import { Footer } from '@/components/site/Footer'
import { WhatsAppButton } from '@/components/site/WhatsAppButton'
import { RevealObserver } from '@/components/site/RevealObserver'
import { SITE_DEFAULTS } from '@/config/site'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  return {
    title: `Portafolio | ${config?.site_name ?? SITE_DEFAULTS.name}`,
    description: 'Galería de trabajos reales de decoración de eventos con globos en Guadalajara.',
  }
}

export default async function PortfolioPage() {
  const [config, photos, categories, label] = await Promise.all([
    getSiteConfig(),
    getAllActivePhotos(),
    getPortfolioCategories(),
    getSectionLabel('portfolio'),
  ])

  const waNumber = config?.whatsapp_number ?? SITE_DEFAULTS.whatsapp.number
  const waMsg    = config?.whatsapp_default_msg ?? SITE_DEFAULTS.whatsapp.message

  return (
    <>
      <RevealObserver />

      <Navbar
        logoUrl={config?.logo_url ?? null}
        siteName={config?.site_name ?? SITE_DEFAULTS.name}
        waNumber={waNumber}
        waMsg={waMsg}
        navbarCta={config?.navbar_cta_text ?? 'Cotizar'}
      />

      <div className="pt-16">
        <PortfolioSection
          photos={photos}
          categories={categories}
          label={label}
          waNumber={waNumber}
          waDefaultMsg={waMsg}
          showViewAll={false}
        />
      </div>

      {config && <Footer config={config} />}
      <WhatsAppButton number={waNumber} message={waMsg} />
    </>
  )
}
