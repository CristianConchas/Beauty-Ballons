'use client'

import { useActionState, useState } from 'react'

import { useFormStatus } from 'react-dom'
import { loginAction } from '@/lib/actions/auth'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
          Verificando...
        </>
      ) : (
        'Entrar al panel'
      )}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, {} as { error?: string })
  const [showPass, setShowPass] = useState(false)

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🎈</div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: '#0F172A' }}>
            Beauty Ballons
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#64748B' }}>Panel de administración</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium" style={{ color: '#0F172A' }}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="email" name="email" type="email"
                  autoComplete="email" required
                  placeholder="admin@beautyballons.mx"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: '#0F172A' }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="password" name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password" required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <SubmitButton />
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          🔒 Acceso seguro · Solo personal autorizado
        </p>
      </div>
    </div>
  )
}
