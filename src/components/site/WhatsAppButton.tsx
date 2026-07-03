'use client'

import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { trackWhatsAppClick } from '@/lib/analytics'

interface WhatsAppButtonProps {
  number:  string
  message: string
}

export function WhatsAppButton({ number, message }: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl({ number, message })

  return (
    <>
      {/* Estilos del pulso — ::before en el elemento real */}
      <style>{`
        .wa-fab-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #25D366;
          z-index: -1;
          animation: fab-ring 2.4s ease-out infinite;
        }
        @keyframes fab-ring {
          0%        { transform: scale(1);   opacity: .55 }
          70%, 100% { transform: scale(1.6); opacity: 0   }
        }
      `}</style>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick('float')}
        aria-label="Contactar por WhatsApp: 33 2294 2088"
        className="wa-fab-btn fixed bottom-6 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform hover:scale-110 active:scale-95"
        style={{
          background: '#25D366',
          boxShadow: '0 4px 18px rgba(37,211,102,0.42)',
          position: 'fixed',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
        </svg>
      </a>
    </>
  )
}
