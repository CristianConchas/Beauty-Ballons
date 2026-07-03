'use client'

import { useEffect } from 'react'

/**
 * Activa animaciones .reveal cuando los elementos entran al viewport.
 * Usa MutationObserver para detectar elementos añadidos dinámicamente
 * (ej: carrusel de testimonios que se duplica en JS).
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    )

    // Observar elementos ya presentes
    function observeAll() {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el))
    }
    observeAll()

    // Observar elementos añadidos dinámicamente (ej: carrusel)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.classList.contains('reveal')) io.observe(node)
          node.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
