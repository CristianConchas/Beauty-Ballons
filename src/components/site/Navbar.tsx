'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface NavbarProps {
  logoUrl:   string | null
  siteName:  string
  waNumber:  string
  waMsg:     string
  navbarCta: string
}

export function Navbar({ logoUrl, siteName, waNumber, waMsg, navbarCta }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // requestAnimationFrame para evitar jank en scroll
    const handler = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48)
        rafRef.current = null
      })
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const waUrl = buildWhatsAppUrl({ number: waNumber, message: waMsg })

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        // Sin backdrop-filter — causa jank en scroll
        scrolled
          ? 'bg-[rgba(253,246,238,0.97)] shadow-[0_1px_0_rgba(28,10,22,0.08),0_4px_24px_rgba(28,10,22,0.06)] border-b border-[rgba(200,81,122,0.1)]'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none"
          aria-label={`${siteName} — Inicio`}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName}
              width={34}
              height={34}
              className="rounded-lg object-contain"
            />
          ) : (
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
              aria-hidden="true"
            >
              B
            </div>
          )}
          <span
            className={cn(
              'font-heading text-[1.2rem] font-semibold tracking-tight transition-colors duration-300',
              scrolled ? 'text-[var(--text-primary)]' : 'text-white drop-shadow-sm'
            )}
          >
            {siteName}
          </span>
        </Link>

        {/* CTA — único botón en navbar */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('navbar')}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{
            background: 'var(--wa)',
            boxShadow: '0 3px 12px rgba(37,211,102,0.38)',
          }}
          aria-label={navbarCta}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
          </svg>
          {navbarCta}
        </a>
      </div>
    </header>
  )
}
