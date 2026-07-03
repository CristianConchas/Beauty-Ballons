import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const revalidate = 3600 // cachear 1 hora

/**
 * GET /api/ig-feed
 *
 * Devuelve las últimas fotos del Instagram de Beauty Ballons.
 *
 * Arquitectura:
 * 1. Lee el access_token de la tabla ig_config en Supabase
 * 2. Llama a la Graph API de Meta con ese token
 * 3. Devuelve las fotos con caché de 1 hora
 *
 * Para configurar:
 * 1. Ve a /admin/ajustes → "Conectar Instagram"
 * 2. Pega tu Long-Lived Access Token
 * 3. Las fotos aparecen automáticamente en el portafolio
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Obtener el token de IG guardado en Supabase
    const { data: igConfig } = await supabase
      .from('ig_config')
      .select('access_token, instagram_user_id, is_active')
      .single()

    // Sin token configurado — devolver array vacío
    if (!igConfig?.access_token || !igConfig.is_active) {
      return NextResponse.json({ posts: [], connected: false })
    }

    // Llamar a la Graph API de Meta
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp'
    const limit  = 12
    const url    = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${igConfig.access_token}`

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // caché Next.js de 1 hora
    })

    if (!res.ok) {
      // Token expirado o inválido
      const err = await res.json()
      console.error('Instagram API error:', err)
      return NextResponse.json({ posts: [], connected: false, error: 'token_invalid' })
    }

    const data = await res.json()

    // Filtrar solo fotos e imágenes de carrusel (no videos sin thumbnail)
    const posts = (data.data ?? [])
      .filter((p: { media_type: string; media_url?: string; thumbnail_url?: string }) =>
        p.media_type === 'IMAGE' ||
        p.media_type === 'CAROUSEL_ALBUM' ||
        (p.media_type === 'VIDEO' && p.thumbnail_url)
      )
      .map((p: { id: string; media_type: string; media_url?: string; thumbnail_url?: string; permalink: string; caption?: string; timestamp: string }) => ({
        id:            p.id,
        media_url:     p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
        permalink:     p.permalink,
        caption:       p.caption?.slice(0, 120) ?? null,
        timestamp:     p.timestamp,
      }))

    return NextResponse.json({ posts, connected: true })

  } catch (error) {
    console.error('IG feed error:', error)
    return NextResponse.json({ posts: [], connected: false })
  }
}
