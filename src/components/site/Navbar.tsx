'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  logoUrl:  string | null
  siteName: string
  waNumber: string
  waMsg:    string
}

const NAV_LINKS = [
  { label: 'Inicio',      href: '#inicio' },
  { label: 'Portafolio',  href: '/portafolio' },
  { label: 'Servicios',   href: '#servicios' },
  { label: 'Proceso',     href: '#proceso' },
  { label: 'FAQ',         href: '#faq' },
]

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
  </svg>
)

export function Navbar({ logoUrl, siteName, waNumber, waMsg }: NavbarProps) {
  const [scrolled,  setScrolled]  = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const rafRef = useRef<number | null>(null)
  const waUrl  = buildWhatsAppUrl({ number: waNumber, message: waMsg })

  useEffect(() => {
    const handler = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        const scrollY  = window.scrollY
        const docH     = document.documentElement.scrollHeight - window.innerHeight
        setScrolled(scrollY > 48)
        setProgress(docH > 0 ? Math.min((scrollY / docH) * 100, 100) : 0)
        rafRef.current = null
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#mobile-menu')) setMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          scrolled
            ? 'bg-[rgba(253,246,238,0.95)] backdrop-blur-md shadow-[0_1px_0_rgba(28,10,22,0.08),0_4px_24px_rgba(28,10,22,0.05)] border-b border-[rgba(200,81,122,0.1)]'
            : 'bg-transparent'
        )}
      >
        {/* Barra de progreso del scroll */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
          }}
          aria-hidden="true"
        />

        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none" aria-label={`${siteName} — Inicio`}>
            {logoUrl ? (
              <Image src={logoUrl} alt={siteName} width={34} height={34} className="rounded-lg object-contain" />
            ) : (
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
                aria-hidden="true"
              >
                B
              </div>
            )}
            <span className={cn(
              'font-heading text-[1.2rem] font-semibold tracking-tight transition-colors duration-300',
              scrolled ? 'text-[var(--text-primary)]' : 'text-white drop-shadow-sm'
            )}>
              {siteName}
            </span>
          </Link>

          {/* Links — solo desktop */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[0.82rem] font-medium transition-colors duration-200 hover:opacity-100',
                  scrolled ? 'text-[var(--text-secondary)] hover:text-[var(--color-primary)]' : 'text-white/70 hover:text-white'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Acciones derecha */}
          <div className="flex items-center gap-3">
            {/* Botón Cotizar — desktop */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('navbar')}
              className="hidden md:flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.8rem] font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-95"
              style={{ background: 'var(--wa)', boxShadow: '0 3px 12px rgba(37,211,102,0.35)' }}
            >
              <WaIcon />
              Cotizar
            </a>

            {/* Hamburger — solo móvil */}
            <button
              id="mobile-menu"
              onClick={() => setMenuOpen(v => !v)}
              className={cn(
                'flex md:hidden h-9 w-9 items-center justify-center rounded-full transition-colors',
                scrolled ? 'text-[var(--text-primary)] hover:bg-[var(--bg-warm)]' : 'text-white hover:bg-white/10'
              )}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil — overlay */}
      <div
        className={cn(
          'fixed inset-0 z-30 transition-all duration-300 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(28,10,22,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        id="mobile-menu"
        className={cn(
          'fixed top-16 left-0 right-0 z-40 transition-all duration-300 md:hidden',
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(253,246,238,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,81,122,0.12)' }}
        aria-label="Menú móvil"
      >
        <div className="flex flex-col px-5 py-4 gap-0.5">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-[0.9rem] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-warm)] hover:text-[var(--color-primary)]"
            >
              {link.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          ))}
          <div className="mt-3 pt-3 border-t border-[var(--border-light)]">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackWhatsAppClick('navbar_mobile'); setMenuOpen(false) }}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-[0.9rem] font-bold text-white"
              style={{ background: 'var(--wa)' }}
            >
              <WaIcon />
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
