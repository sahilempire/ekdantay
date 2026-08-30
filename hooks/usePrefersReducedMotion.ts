'use client'

import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Tracks the OS reduced-motion setting.
 *
 * Starts `true` so the first render is always the calm one - on a clinic site
 * the failure mode we want is "animation missing", never "animation fires at
 * someone who asked for none". It settles to the real value after mount.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * True only on devices with a precise pointer and a wide viewport.
 * Gates the expensive surfaces - smooth scroll and the 3D scene - off phones,
 * which is where they cost the most and help the least (spec 4.6).
 */
export function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    setDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return desktop
}
