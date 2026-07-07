'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavbarProps {
  logoUrl:  string | null
  siteName: string
}

export function Navbar({ logoUrl, siteName }: NavbarProps) {
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

      </div>
    </header>
  )
}
