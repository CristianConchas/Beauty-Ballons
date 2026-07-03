import type { Faq } from '@/types/content.types'
import type { SectionLabel } from '@/types/site.types'
import { Accordion } from '@/components/ui/Accordion'

interface FaqSectionProps {
  faqs:     Faq[]
  label:    SectionLabel | null
  waNumber: string
}

export function FaqSection({ faqs, label, waNumber }: FaqSectionProps) {
  if (!faqs.length) return null

  return (
    <>
      <div className="section-divider" />
      <section
        id="faq"
        className="section-base"
        style={{ padding: 'var(--section-py) 1.25rem' }}
        aria-labelledby="faq-title"
      >
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center reveal">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--color-primary)' }}>
              Preguntas frecuentes
            </p>
            <h2
              id="faq-title"
              className="font-heading leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)' }}
            >
              {label?.title ?? (
                <>
                  Todo lo que{' '}
                  <em className="italic" style={{ color: 'var(--color-primary)' }}>
                    necesitas saber
                  </em>
                </>
              )}
            </h2>
          </div>

          <div
            className="reveal rounded-2xl border"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-light)' }}
          >
            <Accordion
              items={faqs.map((f) => ({
                id:       f.id,
                question: f.question,
                answer:   f.answer,
                cta:      f.cta_in_answer,
              }))}
              waNumber={waNumber}
            />
          </div>
        </div>
      </section>
    </>
  )
}
