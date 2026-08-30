'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/usePrefersReducedMotion'
import { HeroFallback } from './HeroFallback'

/**
 * Lazy boundary for the 3D scene.
 *
 * Three.js and R3F are code-split into their own chunk and never enter the
 * entry bundle, so the page reaches interactive with them still unloaded
 * (spec 11). The scene mounts only when all of these hold:
 *
 *   - the user has not asked for reduced motion
 *   - the device has a precise pointer and a wide viewport
 *   - the hero is actually on screen
 *
 * Everyone else gets HeroFallback, which is a designed state rather than a
 * placeholder. On the mid-range Android hardware most of this clinic's
 * patients use, a WebGL scene is the difference between a site that opens and
 * one that does not - so phones are excluded by design, not by accident.
 */
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  loading: () => <HeroFallback />,
})

export function HeroCanvas() {
  const reduced = usePrefersReducedMotion()
  const desktop = useIsDesktop()
  const [visible, setVisible] = useState(false)
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!node || reduced || !desktop) return

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, reduced, desktop])

  const show3D = visible && !reduced && desktop

  return (
    <div ref={setNode} className="relative aspect-square w-full">
      {show3D ? (
        <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
          <Scene />
        </div>
      ) : (
        <HeroFallback />
      )}
    </div>
  )
}
