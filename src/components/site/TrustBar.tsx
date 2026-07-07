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
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const m = value.match(/^([+\-]?)(\d+)(.*)$/)
    if (!m) return
    const [, pre, num, suf] = m
    const target = parseInt(num, 10)
    if (isNaN(target)) return

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return
      done.current = true; io.disconnect()
      const dur = 1200; const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        el.textContent = pre + Math.floor(ease * target) + suf
        if (p < 1) requestAnimationFrame(tick); else el.textContent = value
      }
      el.textContent = pre + '0' + suf
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <span
      ref={ref}
      className="block font-heading text-[2rem] font-bold leading-none tracking-tight"
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
      <section aria-label="Métricas" className="bg-[var(--bg-surface)]">
        <div className="mx-auto flex max-w-xl items-stretch">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-5 text-center"
              style={{ borderRight: i < 2 ? '1px solid var(--border-light)' : 'none' }}
            >
              <AnimatedNumber value={m.value} />
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-muted)' }}>
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
