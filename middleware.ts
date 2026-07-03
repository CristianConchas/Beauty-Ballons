import { type NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

const PUBLIC_PATHS  = ['/', '/portafolio', '/privacidad']
const ADMIN_PREFIX  = '/admin'
const AUTH_PATH     = '/admin/login'
const API_PREFIX    = '/api'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Rutas de API — pasar directo ──────────────────────────────
  if (pathname.startsWith(API_PREFIX)) {
    return NextResponse.next()
  }

  try {
    const { supabase, response } = createServerSupabaseMiddlewareClient(request)

    // ── Modo mantenimiento ────────────────────────────────────────
    // Solo bloquear rutas públicas, no el admin
    if (!pathname.startsWith(ADMIN_PREFIX)) {
      const { data: config } = await supabase
        .from('site_config')
        .select('maintenance_mode, maintenance_msg')
        .single()

      if (config?.maintenance_mode) {
        // Mostrar página de mantenimiento (JSON por ahora, mejorar con página real)
        return new NextResponse(
          `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>En mantenimiento | Beauty Ballons</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0;
           background: #FDF6EE; color: #1C0A16; text-align: center; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 1rem; color: #C8517A; }
    p  { color: rgba(28,10,22,.65); line-height: 1.7; }
    a  { color: #25D366; font-weight: 600; }
  </style>
</head>
<body>
  <div>
    <div style="font-size:3rem;margin-bottom:1rem">🎈</div>
    <h1>Beauty Ballons</h1>
    <p>${config.maintenance_msg ?? 'Estamos mejorando nuestro sitio. Volvemos muy pronto.'}</p>
    <p style="margin-top:1.5rem">
      ¿Necesitas cotizar ahora?<br>
      <a href="https://wa.me/523322942088">Escríbenos por WhatsApp →</a>
    </p>
  </div>
</body>
</html>`,
          {
            status:  503,
            headers: {
              'Content-Type':  'text/html; charset=utf-8',
              'Retry-After':   '3600',
              'Cache-Control': 'no-store',
            },
          }
        )
      }
    }

    // ── Rutas admin — verificar autenticación ─────────────────────
    if (pathname.startsWith(ADMIN_PREFIX)) {
      const { data: { user } } = await supabase.auth.getUser()
      const isLoginPage = pathname === AUTH_PATH

      if (!user && !isLoginPage) {
        const loginUrl = new URL(AUTH_PATH, request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      if (user && isLoginPage) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }

      // Verificar que es admin
      if (user && !isLoginPage) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('id', user.id)
          .single()

        if (!adminUser) {
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL(AUTH_PATH, request.url))
        }
      }
    }

    return response
  } catch {
    // Si hay error de DB, no bloquear el sitio
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
