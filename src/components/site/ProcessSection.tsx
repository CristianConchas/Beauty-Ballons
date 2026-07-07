import type { ProcessStep } from '@/types/content.types'
import type { SectionLabel } from '@/types/site.types'

interface ProcessSectionProps {
  steps: ProcessStep[]
  label: SectionLabel | null
}

const STEP_SVG = [
  <svg key="chat" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  <svg key="doc" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  <svg key="art" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>,
  <svg key="truck" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
]

export function ProcessSection({ steps, label }: ProcessSectionProps) {
  if (!steps.length) return null

  return (
    <>
      <div className="section-divider" />
      <section className="section-base" style={{ padding: 'var(--section-py) 1.25rem' }}>
        <div className="mx-auto max-w-xl">
          <div className="mb-10 text-center reveal">
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--color-primary)' }}>
              Así de fácil
            </p>
            <h2 className="font-heading leading-tight" style={{ fontSize: 'clamp(1.9rem,4.5vw,3rem)', fontWeight: 300, color: 'var(--text-primary)' }}>
              {label?.title ? (
                <>Así de <em className="italic" style={{ color: 'var(--color-primary)' }}>{label.title}</em></>
              ) : (
                <>Así de <em className="italic" style={{ color: 'var(--color-primary)' }}>sencillo</em></>
              )}
            </h2>
          </div>

          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-[1.125rem] top-5 bottom-5 w-px" aria-hidden="true"
              style={{ background: 'linear-gradient(to bottom, var(--color-primary), rgba(155,111,212,.3), transparent)' }} />

            <ol className="flex flex-col gap-7">
              {steps.map((step, i) => (
                <li key={step.id} className={`flex gap-5 items-start reveal reveal-delay-${Math.min(i+1,4)}`}>
                  {/* Número */}
                  <div
                    className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                      boxShadow: '0 3px 14px rgba(200,81,122,.32)',
                    }}
                    aria-hidden="true"
                  >
                    {STEP_SVG[i % STEP_SVG.length]}
                  </div>
                  <div className="pt-1">
                    <p className="font-heading text-[1.15rem] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {step.title}
                    </p>
                    <p className="mt-1 text-[0.875rem] font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
