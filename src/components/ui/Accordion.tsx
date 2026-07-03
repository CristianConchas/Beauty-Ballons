'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id:       string
  question: string
  answer:   string
  cta?:     boolean
}

interface AccordionProps {
  items:        AccordionItem[]
  defaultOpen?: string
  waNumber?:    string
  className?:   string
}

export function Accordion({ items, defaultOpen, waNumber, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null)

  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, idx) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            className={cn(
              idx !== items.length - 1 && 'border-b'
            )}
            style={{ borderColor: 'var(--border-light)' }}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="text-[0.875rem] font-medium leading-snug"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.question}
              </span>
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  background: isOpen ? 'var(--color-primary)' : 'rgba(200,81,122,0.1)',
                }}
                aria-hidden="true"
              >
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform duration-200"
                  style={{
                    color:     isOpen ? 'white' : 'var(--color-primary)',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </span>
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="px-5 pb-5">
                <p
                  className="text-[0.875rem] leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.answer}
                </p>

                {item.cta && waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola! Tengo una pregunta sobre disponibilidad.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.78rem] font-medium transition-colors"
                    style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.335-1.512A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.381l-.36-.214-3.728.89.935-3.619-.235-.372A9.818 9.818 0 012.182 12C2.182 6.574 6.574 2.182 12 2.182S21.818 6.574 21.818 12 17.426 21.818 12 21.818z"/>
                    </svg>
                    Pregúntanos por WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
