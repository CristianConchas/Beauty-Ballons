'use client'

import { useEffect } from 'react'

export function RevealObserver() {
  useEffect(() => {
    const SELECTORS = '.reveal, .reveal-left, .reveal-right, .reveal-scale'

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
    )

    function observeAll() {
      document.querySelectorAll(`${SELECTORS}:not(.visible)`).forEach(el => io.observe(el))
    }
    observeAll()

    const mo = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return
          const CLASSES = ['reveal', 'reveal-left', 'reveal-right', 'reveal-scale']
          if (CLASSES.some(c => node.classList.contains(c))) io.observe(node)
          node.querySelectorAll(`${SELECTORS}:not(.visible)`).forEach(el => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { io.disconnect(); mo.disconnect() }
  }, [])

  return null
}
