import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { cormorant, dmSans } from '@/config/fonts'
import { SITE_DEFAULTS } from '@/config/site'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default:  `${SITE_DEFAULTS.name} | Decoración de Eventos en Guadalajara`,
    template: `%s | ${SITE_DEFAULTS.name}`,
  },
  description: SITE_DEFAULTS.description,
  metadataBase: new URL(SITE_DEFAULTS.url),
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  let colorVars = ''

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('site_config')
      .select('color_primary, color_secondary, color_accent, color_background, color_text')
      .single()

    if (data) {
      const lines = [
        `--color-primary:   ${data.color_primary};`,
        `--color-secondary: ${data.color_secondary};`,
        data.color_accent    ? `--color-accent:    ${data.color_accent};`    : '',
        data.color_background ? `--bg-base:         ${data.color_background};` : '',
        data.color_text      ? `--text-primary:    ${data.color_text};`     : '',
      ].filter(Boolean).join('\n  ')

      colorVars = `:root {\n  ${lines}\n}`
    }
  } catch {
    // Fallback a colores de globals.css
  }

  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        {colorVars ? <style dangerouslySetInnerHTML={{ __html: colorVars }} /> : null}
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable} font-body antialiased`}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'var(--bg-surface, #fffdf9)',
              color:      'var(--text-primary, #1c0a16)',
              border:     '1px solid rgba(200,81,122,0.12)',
            },
          }}
        />
      </body>
    </html>
  )
}
