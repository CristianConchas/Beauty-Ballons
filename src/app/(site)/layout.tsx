import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getSeoConfig, getSiteConfig } from '@/lib/queries/site-config'
import { SITE_DEFAULTS } from '@/config/site'
import { SchemaOrg } from '@/components/site/SchemaOrg'
import { Analytics } from '@/components/site/Analytics'

export async function generateMetadata(): Promise<Metadata> {
  const [seo, config] = await Promise.all([getSeoConfig(), getSiteConfig()])

  const title       = seo?.meta_title       ?? `${config?.site_name ?? SITE_DEFAULTS.name} | Decoración de Eventos en Guadalajara`
  const description = seo?.meta_description ?? SITE_DEFAULTS.description
  const canonical   = seo?.canonical_url    ?? SITE_DEFAULTS.url

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url:      canonical,
      siteName: config?.site_name ?? SITE_DEFAULTS.name,
      locale:   'es_MX',
      type:     'website',
      images:   seo?.og_image_url
        ? [{ url: seo.og_image_url, width: 1200, height: 630, alt: title }]
        : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      seo?.og_image_url ? [seo.og_image_url] : [],
    },
    robots: {
      index:     true,
      follow:    true,
      googleBot: {
        index:              true,
        follow:             true,
        'max-image-preview': 'large',
      },
    },
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [seo, config] = await Promise.all([getSeoConfig(), getSiteConfig()])

  return (
    <>
      {/* Schema.org — SEO local estructurado */}
      <SchemaOrg config={config} seo={seo} pageType="home" />

      {/* Google Analytics 4 + Meta Pixel */}
      <Analytics
        gaId={seo?.google_analytics_id}
        pixelId={seo?.meta_pixel_id}
      />

      {children}
    </>
  )
}
