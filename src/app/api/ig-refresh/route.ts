import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

/**
 * GET /api/ig-refresh
 *
 * Refresca el Long-Lived Token de Instagram (expira cada 60 días).
 * Se llama automáticamente via Vercel Cron cada 30 días.
 *
 * Configurar en vercel.json:
 * "crons": [{ "path": "/api/ig-refresh", "schedule": "0 9 1,15 * *" }]
 *
 * También se puede llamar manualmente desde /admin/ajustes.
 */
export async function GET(request: Request) {
  // Verificar que es llamado por Vercel Cron o por el admin
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET ?? process.env.REVALIDATE_SECRET
  const isAdmin    = authHeader === `Bearer ${cronSecret}`
  const isCron     = request.headers.get('x-vercel-cron') === '1'

  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createAdminSupabaseClient()

    const { data: igConfig } = await supabase
      .from('ig_config')
      .select('access_token, is_active')
      .single()

    if (!igConfig?.access_token || !igConfig.is_active) {
      return NextResponse.json({ message: 'No token configured' })
    }

    // Refrescar el token
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${igConfig.access_token}`
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
    }

    const data = await res.json()

    // Guardar el token nuevo en Supabase
    await supabase
      .from('ig_config')
      .update({
        access_token:    data.access_token,
        token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        last_refreshed:   new Date().toISOString(),
      })
      .eq('is_active', true)

    return NextResponse.json({ success: true, expires_in: data.expires_in })

  } catch (error) {
    console.error('IG refresh error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
