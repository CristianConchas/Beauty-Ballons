'use client'

import { useEffect, useRef } from 'react'
import type { SiteConfig } from '@/types/site.types'

interface TrustBarProps {
  config: Pick<SiteConfig,
    | 'metric_1_value' | 'metric_1_label'
    | 'metric_2_value' | 'metric_2_label'
    | 'metric_3_value' | 'metric_3_label'
    | 'trust_bar_visible'
  >
}

function AnimatedNumber({ value }: { value: string }) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    // Extraer número y prefijo/sufijo
    const match = value.match(/^([+\-]?)(\d+)(.*)$/)
    if (!match) return

    const prefix = match[1]
    const target = parseInt(match[2], 10)
    const suffix = match[3]

    if (isNaN(target)) return

    const ro = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return
        animated.current = true
        ro.disconnect()

        const duration = 1400
        const start = performance.now()

        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          // ease-out cúbico
          const eased = 1 - Math.pow(1 - progress, 3)
          el.textContent = prefix + Math.floor(eased * target) + suffix
          if (progress < 1) requestAnimationFrame(tick)
          else el.textContent = value
        }

        el.textContent = prefix + '0' + suffix
        requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [value])

  return (
    <span
      ref={spanRef}
      className="block font-heading text-[1.85rem] font-bold leading-none"
      style={{
        background: 'linear-gradient(130deg, var(--color-primary), var(--color-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {value}
    </span>
  )
}

export function TrustBar({ config }: TrustBarProps) {
  if (!config.trust_bar_visible) return null

  const metrics = [
    { value: config.metric_1_value, label: config.metric_1_label },
    { value: config.metric_2_value, label: config.metric_2_label },
    { value: config.metric_3_value, label: config.metric_3_label },
  ]

  return (
    <>
      <div className="section-divider" />
      <section
        aria-label="Métricas del negocio"
        className="bg-[var(--bg-surface)]"
      >
        <div className="mx-auto flex max-w-2xl items-stretch divide-x divide-[var(--border-light)]">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 py-5 text-center"
            >
              <AnimatedNumber value={m.value} />
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.05em] text-[var(--text-muted)]">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className="section-divider" />
    </>
  )
}
