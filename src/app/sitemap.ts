import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beautyballons.vercel.app'
  const now     = new Date()

  return [
    {
      url:              baseUrl,
      lastModified:     now,
      changeFrequency:  'weekly',
      priority:         1,
    },
    {
      url:              `${baseUrl}/portafolio`,
      lastModified:     now,
      changeFrequency:  'weekly',
      priority:         0.8,
    },
    {
      url:              `${baseUrl}/privacidad`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.2,
    },
  ]
}
