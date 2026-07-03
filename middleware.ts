import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'
import { ADMIN_ROUTES } from '@/lib/constants'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Rutas públicas — no necesitan verificación de sesión
  const isAdminRoute = pathname.startsWith('/admin')
  if (!isAdminRoute) {
    return response
  }

  const isLoginPage = pathname === ADMIN_ROUTES.login

  try {
    const supabase = createMiddlewareClient(request, response)

    // Refresca el token de sesión (requerido por @supabase/ssr)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Sin sesión → redirigir al login conservando la URL de destino
    if (!isLoginPage && !user) {
      const loginUrl = new URL(ADMIN_ROUTES.login, request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Ya autenticado intentando acceder al login → ir al dashboard
    if (isLoginPage && user) {
      return NextResponse.redirect(new URL(ADMIN_ROUTES.dashboard, request.url))
    }
  } catch {
    // Si Supabase falla (red, env vars, timeout), dejar pasar el request.
    // Las páginas admin protegerán el acceso con requireAdminUser() del servidor.
    if (!isLoginPage) {
      const loginUrl = new URL(ADMIN_ROUTES.login, request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
