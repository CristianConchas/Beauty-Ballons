import Link from 'next/link'
import { currentYear } from '@/lib/utils'
import type { SiteConfig } from '@/types/site.types'

interface FooterProps {
  config: Pick<SiteConfig, 'site_name' | 'coverage_zone' | 'legal_text' | 'privacy_policy_url' | 'whatsapp_number'>
}

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
  </svg>
)

export function Footer({ config }: FooterProps) {
  const waUrl = config.whatsapp_number
    ? `https://wa.me/${config.whatsapp_number}`
    : null

  return (
    <footer
      className="border-t px-4 py-8"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-light)',
      }}
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

        {/* WhatsApp visible */}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.78rem] font-semibold transition-colors"
            style={{
              color: 'var(--wa)',
              background: 'rgba(37,211,102,0.09)',
            }}
          >
            <WaIcon />
            33 2294 2088
          </a>
        )}

        {/* Redes sociales */}
        <div className="mt-4 flex items-center justify-center gap-2.5 flex-wrap">
          <a
            href="https://www.instagram.com/beauty_.balloons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-medium transition-all hover:border-[#E1306C] hover:text-[#E1306C]"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
            </svg>
            @beauty_.balloons
          </a>
          <a
            href="https://www.facebook.com/share/1BWgFdbjAs/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-medium transition-all hover:border-[#1877F2] hover:text-[#1877F2]"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Beauty Ballons
          </a>
          <a
            href="https://vt.tiktok.com/ZSCxwjGev/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-medium transition-all hover:border-ink hover:text-ink"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
          >
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
