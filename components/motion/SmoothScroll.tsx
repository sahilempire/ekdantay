'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/usePrefersReducedMotion'

/**
 * Lenis momentum scrolling, desktop only.
 *
 * Deliberately never mounts on touch devices (spec 4.6). Smooth-scroll
 * libraries are exactly where desktop-designed sites fall apart on mid-range
 * Android, and native momentum scrolling is already good on phones - so this
 * is a desktop enhancement, not a baseline.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion()
  const desktop = useIsDesktop()

  useEffect(() => {
    if (reduced || !desktop) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let frame = 0

    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced, desktop])

  return null
}
