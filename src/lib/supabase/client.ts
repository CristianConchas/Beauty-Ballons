import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente de Supabase para el BROWSER (componentes client-side).
 * Usa la ANON KEY — respeta Row Level Security.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
