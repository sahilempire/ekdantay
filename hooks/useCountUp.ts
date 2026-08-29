'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface Options {
  /** Milliseconds. */
  duration?: number
}

/** Ease-out cubic - fast start, gentle landing, so the final value settles. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Counts from 0 to `target` once, when the element scrolls into view.
 *
 * Replaces jquery.animateNumber + jquery.waypoints. Under reduced motion it
 * returns the target immediately and never observes or animates anything.
 */
export function useCountUp(target: number, { duration = 1600 }: Options = {}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }

    const el = ref.current
    if (!el || done.current) return

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return
        done.current = true
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          setValue(Math.round(easeOut(progress) * target))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration, reduced])

  return { value, ref }
}
