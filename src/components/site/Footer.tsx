import Link from 'next/link'
import { currentYear } from '@/lib/utils'
import type { SiteConfig } from '@/types/site.types'

interface FooterProps {
  config: Pick<SiteConfig, 'site_name' | 'coverage_zone' | 'legal_text' | 'privacy_policy_url' | 'whatsapp_number'>
}

export function Footer({ config }: FooterProps) {
  return (
    <footer
      className="border-t px-4 py-8"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-light)' }}
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo / nombre */}
        <p
          className="font-heading text-[1.2rem] font-semibold"
          style={{
            background: 'linear-gradient(130deg, var(--color-primary), var(--color-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {config.site_name}
        </p>

        {config.coverage_zone && (
          <p className="mt-0.5 text-xs font-light" style={{ color: 'var(--text-muted)' }}>
            {config.coverage_zone}
          </p>
        )}

        {/* Redes sociales */}
        <div className="mt-4 flex items-center justify-center gap-2.5 flex-wrap">
          <a href="https://www.instagram.com/beauty_.balloons" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-medium transition-all hover:border-[#E1306C] hover:text-[#E1306C]"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
            </svg>
            @beauty_.balloons
          </a>
          <a href="https://www.facebook.com/share/1BWgFdbjAs/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-medium transition-all hover:border-[#1877F2] hover:text-[#1877F2]"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Beauty Ballons
          </a>
          <a href="https://vt.tiktok.com/ZSCxwjGev/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-medium transition-all hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
            </svg>
            TikTok
          </a>
        </div>

        {/* Copyright */}
        <div
          className="mt-5 flex items-center justify-center gap-2 text-[0.65rem]"
          style={{ color: 'rgba(28,10,22,0.28)' }}
        >
          <span>© {currentYear()} {config.site_name}</span>
          {config.privacy_policy_url && (
            <>
              <span aria-hidden="true">·</span>
              <Link href={config.privacy_policy_url} className="transition-colors hover:text-[var(--text-muted)]">
                Aviso de Privacidad
              </Link>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>Guadalajara, Jal.</span>
        </div>
      </div>
    </footer>
  )
}
