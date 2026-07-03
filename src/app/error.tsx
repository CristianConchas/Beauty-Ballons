'use client'

import { useEffect } from 'react'

/**
 * Error boundary global de Next.js.
 * Captura errores no manejados en el árbol de componentes del cliente.
 * Debe ser un Client Component (requiere 'use client').
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar el error para depuración
    console.error('Error no manejado:', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}
    >
      <div className="text-6xl mb-4" aria-hidden="true">
        💫
      </div>

      <h2
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Algo salió mal
      </h2>

      <p className="opacity-70 mb-6 max-w-sm">
        Hubo un error inesperado. Por favor intenta de nuevo.
      </p>

      <button
        onClick={reset}
        className="py-3 px-8 rounded-full text-white font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
