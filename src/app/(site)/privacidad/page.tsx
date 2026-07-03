import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteConfig } from '@/lib/queries/site-config'
import { SITE_DEFAULTS } from '@/config/site'
import { currentYear } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Aviso de Privacidad', robots: { index: false, follow: false } }
}

export default async function PrivacidadPage() {
  const config   = await getSiteConfig()
  const siteName = config?.site_name ?? SITE_DEFAULTS.name
  const city     = SITE_DEFAULTS.city

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-sm text-gray-700">
      <Link href="/" className="mb-8 inline-block text-brand-primary hover:underline">
        ← Volver al inicio
      </Link>

      <h1 className="font-heading mb-6 text-2xl font-bold text-gray-900">
        Aviso de Privacidad
      </h1>

      <div className="space-y-4 leading-relaxed">
        <p>
          <strong>{siteName}</strong>, con domicilio en {city}, Jalisco, México, es responsable del tratamiento de los datos personales que usted proporcione, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
        </p>

        <h2 className="font-heading text-lg font-semibold text-gray-900 mt-6">¿Qué datos recopilamos?</h2>
        <p>Nombre y número de WhatsApp o teléfono proporcionados voluntariamente a través del formulario de contacto o mensajes directos.</p>

        <h2 className="font-heading text-lg font-semibold text-gray-900 mt-6">¿Para qué los usamos?</h2>
        <p>Exclusivamente para contactarle y brindarle cotizaciones de nuestros servicios de decoración de eventos.</p>

        <h2 className="font-heading text-lg font-semibold text-gray-900 mt-6">¿Compartimos sus datos?</h2>
        <p>No. Sus datos personales nunca son compartidos, vendidos ni transferidos a terceros.</p>

        <h2 className="font-heading text-lg font-semibold text-gray-900 mt-6">Derechos ARCO</h2>
        <p>
          Usted tiene derecho de Acceso, Rectificación, Cancelación u Oposición (derechos ARCO) respecto a sus datos personales. Para ejercerlos, contáctenos por WhatsApp al número indicado en nuestro sitio.
        </p>

        <p className="mt-8 text-xs text-gray-400">
          Última actualización: {currentYear()}. {siteName} · {city}, Jalisco.
        </p>
      </div>
    </div>
  )
}
