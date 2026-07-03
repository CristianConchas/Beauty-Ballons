import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beautyballons.vercel.app'
  return {
    rules: [
      {
        userAgent: '*',
        allow:     ['/', '/portafolio', '/privacidad'],
        disallow:  ['/admin', '/api', '/_next'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
