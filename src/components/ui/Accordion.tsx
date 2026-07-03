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
  items:       AccordionItem[]
  defaultOpen?: string
  waNumber?:   string
  className?:  string
}

export function Accordion({ items, defaultOpen, waNumber, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? items[0]?.id ?? null)

  return (
    <div className={cn('flex flex-col divide-y divide-admin-border', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-admin-text sm:text-base">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-admin-muted transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="pb-4">
                <p className="text-sm leading-relaxed text-admin-muted">
                  {item.answer}
                </p>

                {item.cta && waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Hola! Tengo una pregunta sobre sus servicios.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-wa/10 px-4 py-2 text-sm font-medium text-wa hover:bg-wa/20 transition-colors"
                  >
                    <span>💬</span>
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
