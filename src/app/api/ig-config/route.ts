import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { requireAdminUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAdminUser()
    const { access_token } = await req.json()
    if (!access_token?.trim()) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    const supabase = await createAdminSupabaseClient()

    // Verificar si ya existe un registro activo
    const { data: existing } = await supabase
      .from('ig_config')
      .select('id')
      .eq('is_active', true)
      .single()

    if (existing) {
      // Actualizar el existente
      await supabase
        .from('ig_config')
        .update({
          access_token:    access_token.trim(),
          last_refreshed:  new Date().toISOString(),
          token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', existing.id)
    } else {
      // Crear nuevo
      await supabase
        .from('ig_config')
        .insert({
          access_token:    access_token.trim(),
          is_active:       true,
          last_refreshed:  new Date().toISOString(),
          token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
