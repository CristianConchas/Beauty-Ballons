import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SITE_DEFAULTS } from '@/config/site'
import type { SeoConfig, SiteConfig } from '@/types/site.types'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = await createServerSupabaseClient()

    const [seoRes, configRes] = await Promise.all([
      supabase.from('seo_config').select('*').single(),
      supabase.from('site_config').select('site_name').single(),
    ])

    const seo    = seoRes.data    as SeoConfig | null
    const config = configRes.data as Pick<SiteConfig, 'site_name'> | null

    if (!seo || !config) {
      return { title: SITE_DEFAULTS.name }
    }

    return {
      title: {
        default:  seo.meta_title,
        template: `%s | ${config.site_name}`,
      },
      description:  seo.meta_description,
      keywords:     seo.meta_keywords ?? undefined,
      metadataBase: new URL(seo.canonical_url || SITE_DEFAULTS.url),
      alternates: {
        canonical: seo.canonical_url || SITE_DEFAULTS.url,
      },
      openGraph: {
        type:        'website',
        locale:      'es_MX',
        url:         seo.canonical_url || SITE_DEFAULTS.url,
        title:       seo.og_title || seo.meta_title,
        description: seo.og_description || seo.meta_description,
        siteName:    config.site_name,
        images:      seo.og_image_url
          ? [{ url: seo.og_image_url, width: 1200, height: 630 }]
          : undefined,
      },
      twitter: {
        card:        'summary_large_image',
        title:       seo.og_title || seo.meta_title,
        description: seo.og_description || seo.meta_description,
        images:      seo.og_image_url ? [seo.og_image_url] : undefined,
      },
      robots: {
        index:  true,
        follow: true,
      },
    }
  } catch {
    return { title: SITE_DEFAULTS.name }
  }
}

export default async function SiteLayout({
  children,
}: {
  children: ReactNode
}) {
  let schemaScript: string | null = null
  let ga4Id:        string | null = null
  let metaPixelId:  string | null = null

  try {
    const supabase = await createServerSupabaseClient()

    const [configRes, seoRes, socialRes] = await Promise.all([
      supabase
        .from('site_config')
        .select('site_name, whatsapp_number, price_range, opening_hours')
        .single(),
      supabase
        .from('seo_config')
        .select(
          'schema_city, schema_region, schema_country, schema_area_served, canonical_url, og_image_url, google_analytics_id, meta_pixel_id'
        )
        .single(),
      supabase
        .from('social_links')
        .select('url')
        .eq('is_active', true),
    ])

    const config = configRes.data as Pick<SiteConfig, 'site_name' | 'whatsapp_number' | 'price_range' | 'opening_hours'> | null
    const seo    = seoRes.data    as Pick<SeoConfig, 'schema_city' | 'schema_region' | 'schema_country' | 'schema_area_served' | 'canonical_url' | 'og_image_url' | 'google_analytics_id' | 'meta_pixel_id'> | null
    const social = socialRes.data as { url: string }[] | null

    if (config && seo) {
      ga4Id       = seo.google_analytics_id ?? null
      metaPixelId = seo.meta_pixel_id ?? null

      const schema = buildSchemaJsonLd({
        name:         config.site_name,
        url:          seo.canonical_url || SITE_DEFAULTS.url,
        telephone:    `+${config.whatsapp_number}`,
        city:         seo.schema_city,
        region:       seo.schema_region,
        country:      seo.schema_country,
        areaServed:   (seo.schema_area_served as string[]) ?? [],
        priceRange:   config.price_range ?? '$$',
        openingHours: config.opening_hours ?? 'Mo-Su 09:00-20:00',
        image:        seo.og_image_url ?? '',
        sameAs:       (social ?? []).map((s) => s.url),
        waUrl:        `https://wa.me/${config.whatsapp_number}`,
      })

      schemaScript = JSON.stringify(schema)
    }
  } catch {
    // La ausencia de Schema.org no es crítica
  }

  return (
    <>
      {schemaScript ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaScript }}
        />
      ) : null}

      {ga4Id ? (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', { page_path: window.location.pathname });
              `,
            }}
          />
        </>
      ) : null}

      {metaPixelId ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
              n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${metaPixelId}');fbq('track','PageView');
            `,
          }}
        />
      ) : null}

      {children}
    </>
  )
}

// ─── Schema.org ───────────────────────────────────────────────

interface SchemaOptions {
  name:         string
  url:          string
  telephone:    string
  city:         string
  region:       string
  country:      string
  areaServed:   string[]
  priceRange:   string
  openingHours: string
  image:        string
  sameAs:       string[]
  waUrl:        string
}

function buildSchemaJsonLd(opts: SchemaOptions): object {
  return {
    '@context': 'https://schema.org',
    '@type':    ['LocalBusiness', 'EventPlanner'],
    name:        opts.name,
    description: `Decoración de eventos con globos en ${opts.city}. Bodas, XV Años, Baby Shower y más.`,
    url:         opts.url,
    telephone:   opts.telephone,
    image:       opts.image || undefined,
    priceRange:  opts.priceRange,
    openingHours: opts.openingHours,
    address: {
      '@type':         'PostalAddress',
      addressLocality:  opts.city,
      addressRegion:    opts.region,
      addressCountry:   opts.country,
    },
    areaServed: opts.areaServed.map((area) => ({
      '@type': 'City',
      name:     area,
    })),
    sameAs: opts.sameAs,
    potentialAction: {
      '@type': 'CommunicateAction',
      target:   opts.waUrl,
    },
  }
}
