import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors:  true },

  images: {
    remotePatterns: [
      // Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co',    pathname: '/storage/v1/object/public/**' },
      // Instagram CDN
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: 'scontent*.cdninstagram.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
      { protocol: 'https', hostname: 'scontent*.fbcdn.net' },
      // Facebook CDN
      { protocol: 'https', hostname: '*.facebook.com' },
    ],
    formats:     ['image/avif', 'image/webp'],
    deviceSizes: [390, 430, 768, 1024, 1280, 1920],
    imageSizes:  [64, 128, 256, 400, 800],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/admin/(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
      {
        source: '/api/ig-feed',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
      },
    ]
  },

  async redirects() {
    return [
      { source: '/admin', destination: '/admin/dashboard', permanent: false },
    ]
  },
}

export default nextConfig
