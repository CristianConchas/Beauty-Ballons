import Link from 'next/link'
import { getSiteConfig } from '@/lib/queries/site-config'
import { SITE_DEFAULTS } from '@/config/site'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export default async function NotFound() {
  const config   = await getSiteConfig()
  const waNumber = config?.whatsapp_number ?? SITE_DEFAULTS.whatsapp.number
  const waUrl    = buildWhatsAppUrl({
    number:  waNumber,
    message: 'Hola Beauty Ballons! Necesito ayuda.',
  })

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
    >
      <div className="text-6xl mb-4" aria-hidden="true">🎈</div>
      <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
        Página no encontrada
      </h1>
      <p className="text-lg mb-8 max-w-sm opacity-70">
        Esta página no existe, pero tu evento merece la mejor decoración.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link href="/"
          className="flex-1 text-center py-3 px-6 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--color-primary)' }}>
          Ir al inicio
        </Link>
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center py-3 px-6 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#25D366' }}>
          WhatsApp
        </a>
      </div>
    </div>
  )
}
