import type { ProcessStep } from '@/types/content.types'
import type { SectionLabel } from '@/types/site.types'

interface ProcessSectionProps {
  steps: ProcessStep[]
  label: SectionLabel | null
}

const STEP_ICONS = [
  // Chat
  <svg key="chat" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    <circle cx="9" cy="10" r=".75" fill="currentColor"/><circle cx="12" cy="10" r=".75" fill="currentColor"/><circle cx="15" cy="10" r=".75" fill="currentColor"/>
  </svg>,
  // Documento
  <svg key="doc" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
  </svg>,
  // Pincel
  <svg key="brush" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="13.5" cy="6.5" r="4.5"/><path d="M8.35 11.65L2 22h20l-6.35-10.35"/>
  </svg>,
  // Camión
  <svg key="truck" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>,
]

export function ProcessSection({ steps, label }: ProcessSectionProps) {
  if (!steps.length) return null

  return (
    <>
      <div className="section-divider" />
      <section
        className="section-base"
        style={{ padding: 'var(--section-py) 1.25rem' }}
        aria-labelledby="proc-title"
      >
        <div className="mx-auto max-w-xl">
          {/* Header */}
          <div className="mb-10 text-center reveal">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--color-primary)' }}>
              Cómo trabajamos
            </p>
            <h2
              id="proc-title"
              className="font-heading leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', fontWeight: 300, color: 'var(--text-primary)' }}
            >
              Así de{' '}
              <em className="italic" style={{ color: 'var(--color-primary)' }}>
                {label?.title ?? 'sencillo'}
              </em>
            </h2>
          </div>

          {/* Pasos */}
          <div className="relative">
            {/* Línea vertical */}
            <div
              className="absolute left-[1.1rem] top-6 bottom-8 w-px"
              style={{
                background: `linear-gradient(to bottom, var(--color-primary), rgba(155,111,212,.4), transparent)`,
              }}
              aria-hidden="true"
            />

            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className={`flex gap-5 items-start reveal reveal-delay-${Math.min(i + 1, 4)}`}
                >
                  {/* Número / icono */}
                  <div
                    className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                      boxShadow: '0 3px 12px rgba(200,81,122,0.32)',
                    }}
                    aria-hidden="true"
                  >
                    {STEP_ICONS[i % STEP_ICONS.length]}
                  </div>

                  {/* Texto */}
                  <div className="pt-1.5">
                    <p
                      className="font-heading text-[1.15rem] font-semibold leading-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="mt-1.5 text-[0.85rem] leading-relaxed font-light"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
