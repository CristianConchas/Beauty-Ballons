import { NextRequest, NextResponse } from 'next/server'
import { createLeadPublic } from '@/lib/actions/leads'
import { z } from 'zod'

const Schema = z.object({
  name:         z.string().min(2).max(60),
  message:      z.string().max(500).optional(),
  source:       z.enum(['hero','service','portfolio','lightbox','float','cta_final','faq','unknown']),
  utm_source:   z.string().optional(),
  utm_medium:   z.string().optional(),
  utm_campaign: z.string().optional(),
  device_type:  z.enum(['mobile','desktop','tablet']).optional(),
})

// Mapa de fuente a texto legible
const SOURCE_LABELS: Record<string, string> = {
  hero:       '🦸 Hero del sitio',
  service:    '🎈 Sección de servicios',
  portfolio:  '📸 Portafolio',
  lightbox:   '🖼️ Lightbox de foto',
  float:      '💬 Botón flotante WA',
  cta_final:  '📝 Formulario de contacto',
  faq:        '❓ Preguntas frecuentes',
  unknown:    '❓ Desconocido',
}

/**
 * Enviar notificación por email al admin cuando llega un lead.
 * Usa Resend si RESEND_API_KEY está configurado.
 * Si no está configurado, solo guarda en DB (sin notificación).
 */
async function sendLeadNotification(data: {
  name:       string
  message?:   string | null
  source:     string
  device_type?: string | null
}) {
  const apiKey      = process.env.RESEND_API_KEY
  const adminEmail  = process.env.ADMIN_NOTIFICATION_EMAIL
  const siteName    = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Beauty Ballons'
  const siteUrl     = process.env.NEXT_PUBLIC_SITE_URL  ?? 'https://beauty-ballons-cris-dev25.vercel.app'

  // Sin config de Resend — skip silenciosamente
  if (!apiKey || !adminEmail) return

  const sourceLabel  = SOURCE_LABELS[data.source] ?? data.source
  const device       = data.device_type === 'mobile' ? '📱 Móvil' : '💻 Desktop'
  const now          = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family: system-ui, sans-serif; background: #FDF6EE; margin: 0; padding: 2rem;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #C8517A, #9B6FD4); padding: 1.5rem 2rem;">
          <p style="color: rgba(255,255,255,0.7); font-size: 0.75rem; margin: 0 0 0.25rem; text-transform: uppercase; letter-spacing: 0.1em;">Nuevo prospecto</p>
          <h1 style="color: white; font-size: 1.5rem; margin: 0;">${siteName}</h1>
        </div>
        
        <!-- Contenido -->
        <div style="padding: 1.5rem 2rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #F0E4D8;">
              <td style="padding: 0.75rem 0; color: rgba(28,10,22,0.5); font-size: 0.8rem; width: 40%;">Nombre</td>
              <td style="padding: 0.75rem 0; font-weight: 600; color: #1C0A16;">${data.name}</td>
            </tr>
            ${data.message ? `
            <tr style="border-bottom: 1px solid #F0E4D8;">
              <td style="padding: 0.75rem 0; color: rgba(28,10,22,0.5); font-size: 0.8rem; vertical-align: top;">Mensaje</td>
              <td style="padding: 0.75rem 0; color: #1C0A16; line-height: 1.6;">${data.message}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #F0E4D8;">
              <td style="padding: 0.75rem 0; color: rgba(28,10,22,0.5); font-size: 0.8rem;">Origen</td>
              <td style="padding: 0.75rem 0; color: #1C0A16;">${sourceLabel}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F0E4D8;">
              <td style="padding: 0.75rem 0; color: rgba(28,10,22,0.5); font-size: 0.8rem;">Dispositivo</td>
              <td style="padding: 0.75rem 0; color: #1C0A16;">${device}</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem 0; color: rgba(28,10,22,0.5); font-size: 0.8rem;">Fecha y hora</td>
              <td style="padding: 0.75rem 0; color: #1C0A16;">${now}</td>
            </tr>
          </table>
          
          <!-- CTA -->
          <div style="margin-top: 1.5rem; text-align: center;">
            <a href="https://wa.me/523322942088" 
               style="display: inline-block; background: #25D366; color: white; padding: 0.875rem 2rem; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 0.9rem;">
              Responder por WhatsApp →
            </a>
          </div>
          
          <p style="margin-top: 1.5rem; text-align: center;">
            <a href="${siteUrl}/admin/leads" style="color: rgba(28,10,22,0.4); font-size: 0.75rem; text-decoration: none;">
              Ver todos los leads en el admin →
            </a>
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #FDF6EE; padding: 1rem 2rem; text-align: center;">
          <p style="color: rgba(28,10,22,0.35); font-size: 0.7rem; margin: 0;">
            Notificación automática de ${siteName}
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    `${siteName} <noreply@resend.dev>`,
        to:      [adminEmail],
        subject: `🎈 Nuevo prospecto: ${data.name}`,
        html,
      }),
    })
  } catch (err) {
    // No bloquear la experiencia si el email falla
    console.error('Error enviando notificación de lead:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = Schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    // 1. Guardar en Supabase
    await createLeadPublic(parsed.data)

    // 2. Enviar notificación (no bloquea la respuesta)
    sendLeadNotification({
      name:        parsed.data.name,
      message:     parsed.data.message,
      source:      parsed.data.source,
      device_type: parsed.data.device_type,
    }).catch(console.error)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
