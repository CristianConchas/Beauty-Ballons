'use client'

import { useEffect } from 'react'

/**
 * Global error boundary para Next.js 15.
 * Se activa cuando ocurre un error en el root layout.
 * DEBE incluir <html> y <body> porque reemplaza el layout completo.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error no manejado:', error)
  }, [error])

  return (
    <html lang="es-MX">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#fff' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>💫</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1c1b1f' }}>
            Algo salió mal
          </h2>
          <p style={{ opacity: 0.7, marginBottom: '1.5rem', maxWidth: '24rem', color: '#1c1b1f' }}>
            Hubo un error inesperado. Por favor intenta de nuevo.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              color: '#fff',
              fontWeight: 500,
              backgroundColor: '#D4618C',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  )
}
