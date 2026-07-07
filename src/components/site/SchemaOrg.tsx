import type { SiteConfig, SeoConfig } from '@/types/site.types'
import { CLIENT_CONFIG } from '@/config/client.config'

interface SchemaOrgProps {
  config:    SiteConfig | null
  seo:       SeoConfig  | null
  pageType?: 'home' | 'portfolio' | 'privacy'
}

export function SchemaOrg({ config, seo, pageType = 'home' }: SchemaOrgProps) {
  const name        = config?.site_name    ?? CLIENT_CONFIG.site.name
  const url         = seo?.canonical_url   ?? CLIENT_CONFIG.site.url
  const description = seo?.meta_description ?? CLIENT_CONFIG.site.description
  const phone       = config?.whatsapp_number
    ? `+${config.whatsapp_number}`
    : '+523322942088'
  const city        = seo?.schema_city    ?? CLIENT_CONFIG.location.city
  const region      = seo?.schema_region  ?? CLIENT_CONFIG.location.region
  const country     = seo?.schema_country ?? CLIENT_CONFIG.location.country
  const areaServed  = seo?.schema_area_served ?? CLIENT_CONFIG.location.areaServed
  const image       = seo?.og_image_url ?? undefined

  // ── LocalBusiness Schema ───────────────────────────────────
  const localBusiness = {
    '@context':   'https://schema.org',
    '@type':      ['LocalBusiness', 'EventPlanningService'],
    '@id':        `${url}/#business`,
    name,
    description,
    url,
    telephone:    phone,
    image:        image ?? undefined,
    priceRange:   config?.price_range ?? '$$',
    openingHours: config?.opening_hours ?? 'Mo-Su 09:00-20:00',
    address: {
      '@type':           'PostalAddress',
      addressLocality:   city,
      addressRegion:     region,
      addressCountry:    country,
    },
    areaServed: areaServed.map((area) => ({
      '@type': 'City',
      name:    area,
    })),
    sameAs: [
      'https://www.instagram.com/beauty_.balloons',
      'https://www.facebook.com/share/1BWgFdbjAs/',
    ],
    contactPoint: {
      '@type':          'ContactPoint',
      telephone:        phone,
      contactType:      'customer service',
      availableLanguage: 'Spanish',
      contactOption:    'TollFree',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:    'Servicios de Decoración',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Arcos de globos' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Decoración de salón' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Centros de mesa' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Velas decorativas' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Recuerditos personalizados' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mesas de dulces' } },
      ],
    },
  }

  // ── WebSite Schema (buscador en Google) ───────────────────
  const website = {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':      `${url}/#website`,
    url,
    name,
    description,
    potentialAction: {
      '@type':       'SearchAction',
      target:        { '@type': 'EntryPoint', urlTemplate: `${url}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  // ── BreadcrumbList ────────────────────────────────────────
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: url },
      ...(pageType === 'portfolio'
        ? [{ '@type': 'ListItem', position: 2, name: 'Portafolio', item: `${url}/portafolio` }]
        : []),
    ],
  }

  const schemas = [localBusiness, website, breadcrumb]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

// ── FAQPage Schema — para las preguntas frecuentes ──────────
interface FaqSchemaProps {
  faqs: Array<{ question: string; answer: string }>
}

export function FaqSchema({ faqs }: FaqSchemaProps) {
  if (!faqs.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type':          'Question',
      name:             faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
