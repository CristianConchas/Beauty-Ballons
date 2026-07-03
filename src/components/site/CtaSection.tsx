'use client'

import { useState } from 'react'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/analytics'
import type { SiteConfig } from '@/types/site.types'

interface CtaSectionProps {
  config:      Pick<SiteConfig, 'site_name' | 'whatsapp_number' | 'whatsapp_default_msg'>
  label?:      unknown
  socialLinks?: unknown[]
}

export function CtaSection({ config }: CtaSectionProps) {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)

  const waUrl = buildWhatsAppUrl({
    number:  config.whatsapp_number,
    message: config.whatsapp_default_msg,
  })

  function handleSubmit() {
    if (name.trim().length < 2) {
      alert('Por favor escribe tu nombre.')
      return
    }
    let text = `Hola ${config.site_name}! Soy *${name.trim()}*.`
    if (phone.trim()) text += ` Mi WhatsApp es ${phone.trim()}.`
    text += message.trim()
      ? ` ${message.trim()}`
      : ' Me gustaría cotizar una decoración para mi evento.'

    const url = buildWhatsAppUrl({ number: config.whatsapp_number, message: text })
    trackWhatsAppClick('cta_form')
    setSent(true)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="section-divider" />
      <section
        id="contacto"
        className="relative overflow-hidden"
        style={{
          padding: 'var(--section-py) 1.25rem',
          background: 'linear-gradient(158deg, #1C0A16 0%, #2D1025 55%, #1A0D28 100%)',
        }}
        aria-labelledby="cta-title"
      >
        {/* Orbs decorativos estáticos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-36 -right-36 h-[480px] w-[480px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(200,81,122,.16), transparent 65%)' }} />
          <div className="absolute -bottom-24 -left-24 h-[340px] w-[340px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(155,111,212,.13), transparent 65%)' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-[28rem] text-center">
          {/* Eyebrow */}
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40 reveal">
            Cotiza ahora
          </p>

          {/* Título */}
          <h2
            id="cta-title"
            className="mb-3 font-heading leading-tight reveal"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)', fontWeight: 300, color: 'white' }}
          >
            Tu evento{' '}
            <em
              className="italic"
              style={{
                background: 'linear-gradient(130deg, #F4A9C0, #C4B5FD)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              merece
            </em>{' '}
            lo mejor
          </h2>

          <p className="mb-9 text-[0.875rem] font-light text-white/45 reveal">
            Sin compromiso. Sin costo. Solo cuéntanos de tu evento.
          </p>

          {/* Botón principal WA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('cta_main')}
            className="mb-8 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[1rem] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-97 reveal"
            style={{
              background: 'var(--wa)',
              boxShadow: '0 6px 24px rgba(37,211,102,0.38)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
            </svg>
            Cotizar por WhatsApp
          </a>

          {/* Mini formulario */}
          {!sent ? (
            <div
              className="rounded-2xl p-5 text-left reveal"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <p className="mb-4 text-[0.78rem] font-medium text-white/60">
                O déjanos tus datos y te contactamos:
              </p>
              <div className="flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Tu nombre *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-[0.85rem] text-white placeholder:text-white/30 outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,81,122,0.55)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.14)')}
                  maxLength={60}
                  autoComplete="name"
                />
                <input
                  type="tel"
                  placeholder="Tu WhatsApp (opcional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-[0.85rem] text-white placeholder:text-white/30 outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,81,122,0.55)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.14)')}
                  maxLength={15}
                  autoComplete="tel"
                />
                <textarea
                  placeholder="Cuéntanos de tu evento: tipo, fecha, lugar…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl px-4 py-3 text-[0.85rem] text-white placeholder:text-white/30 outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,81,122,0.55)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.14)')}
                  maxLength={500}
                />
                <button
                  onClick={handleSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[0.875rem] font-bold transition-all hover:brightness-95 active:scale-97"
                  style={{
                    background: 'white',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
                  </svg>
                  Enviar y abrir WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 text-center reveal"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: 'rgba(37,211,102,0.2)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p className="font-semibold text-white">¡Listo! Revisa WhatsApp.</p>
              <p className="mt-1 text-[0.78rem] text-white/55">Nos pondremos en contacto muy pronto ✨</p>
            </div>
          )}

          {/* Número visible */}
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.78rem] text-white/38 reveal">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
            </svg>
            33 2294 2088
          </p>
        </div>
      </section>
    </>
  )
}
