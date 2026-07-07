import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getPortfolioCategories } from '@/lib/queries/portfolio'
import { getSiteConfig } from '@/lib/queries/site-config'
import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { PortfolioPageClient } from '@/components/site/PortfolioPageClient'
import { SITE_DEFAULTS } from '@/config/site'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'Portafolio | Beauty Ballons',
  description: 'Conoce nuestros trabajos de decoración con globos, centros de mesa, arcos y más en Guadalajara y ZMG.',
}

async function getAllPhotos() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('portfolio_photos')
    .select('*, category:portfolio_categories(id, name, slug)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data ?? []
}

export default async function PortfolioPage() {
  const [photos, categories, config] = await Promise.all([
    getAllPhotos(),
    getPortfolioCategories(),
    getSiteConfig(),
  ])

  const waNumber = config?.whatsapp_number ?? SITE_DEFAULTS.whatsapp.number
  const waMsg    = config?.whatsapp_default_msg ?? SITE_DEFAULTS.whatsapp.message

  return (
    <>
      <Navbar
        logoUrl={config?.logo_url ?? null}
        siteName={config?.site_name ?? SITE_DEFAULTS.name}
        waNumber={waNumber}
        waMsg={waMsg}
        navbarCta={config?.navbar_cta_text ?? 'Cotizar'}
      />
      <main className="min-h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        {/* Header */}
        <div
          className="relative overflow-hidden py-14 text-center"
          style={{
            background: 'linear-gradient(158deg, #240818 0%, #130210 100%)',
          }}
        >
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,81,122,.35) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Nuestro trabajo
            </p>
            <h1
              className="font-heading text-white"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300 }}
            >
              Portafolio
            </h1>
            <p className="mt-2 text-[0.875rem] font-light text-white/50">
              {photos.length} {photos.length === 1 ? 'trabajo' : 'trabajos'} · Guadalajara y ZMG
            </p>
          </div>
        </div>

        {/* Grid con filtros */}
        <PortfolioPageClient
          photos={photos as any}
          categories={categories}
          waNumber={waNumber}
          waDefaultMsg={waMsg}
        />
      </main>
      {config && <Footer config={config} />}
    </>
  )
}
