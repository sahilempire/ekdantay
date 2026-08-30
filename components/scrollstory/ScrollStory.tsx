'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { BEATS } from './beats'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

/**
 * The scroll sequence: one pinned 3D scene the camera flies through, with a
 * copy beat and a technical readout per stop. Modelled on oryzo.ai.
 *
 * Two decisions worth naming:
 *
 * Scroll progress is written to a *ref*, not state. React state here would
 * re-render the tree on every scroll event; the ref feeds useFrame directly
 * and the canvas never re-renders at all.
 *
 * It runs on phones. The 2026 scrollytelling guidance is explicit that
 * desktop-only scroll experiences are obsolete, and the correct pattern is
 * device-tier detection serving a lighter scene - not switching it off. Phones
 * get a lower pixel ratio and no shadows, and reduced-motion gets a static
 * stacked layout with all the same copy.
 */
export function ScrollStory() {
  const wrap = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    setReady(true)
    return scrollYProgress.on('change', (v) => {
      progress.current = v
      // Only the copy layer is React-driven, and only when the beat changes.
      let next = 0
      BEATS.forEach((b, i) => {
        if (v >= b.at - 0.001) next = i
      })
      setActive((prev) => (prev === next ? prev : next))
    })
  }, [scrollYProgress])

  // Reduced motion: the same content, stacked and static.
  if (reduced) {
    return (
      <section className="border-y border-line bg-surface py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2">
            {BEATS.map((b) => (
              <div key={b.id} className="rounded-2xl border border-line bg-paper p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {b.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl">{b.title}</h2>
                <p className="mt-3 text-sm text-ink-soft">{b.body}</p>
                {b.readout && (
                  <p className="mt-5 border-t border-line pt-4 text-sm">
                    <span className="text-muted">{b.readout.label}</span>{' '}
                    <span className="tabular text-accent">{b.readout.value}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  const beat = BEATS[active]

  return (
    <section
      ref={wrap}
      aria-label="How a tooth works"
      // Each beat gets a viewport of scroll to breathe in.
      style={{ height: `${BEATS.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* the 3D stage, full bleed */}
        <div className="absolute inset-0">{ready && <Scene progressRef={progress} />}</div>

        {/* vignette keeps type legible over the scene without a flat scrim */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 70% 50%, transparent 30%, var(--paper) 100%)',
          }}
        />

        {/* copy layer */}
        <Container className="pointer-events-none relative flex h-screen items-center">
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {beat.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl">{beat.title}</h2>
            <p className="mt-5 text-ink-soft">{beat.body}</p>

            {beat.readout && (
              <div className="mt-8 inline-flex items-baseline gap-4 rounded-xl border border-line bg-surface/80 px-5 py-3 backdrop-blur-sm">
                <span className="text-xs uppercase tracking-[0.12em] text-muted">
                  {beat.readout.label}
                </span>
                <span className="tabular font-display text-lg text-accent">
                  {beat.readout.value}
                </span>
              </div>
            )}

            {beat.id === 'whole' && (
              <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact" size="lg">Book Appointment</ButtonLink>
                <ButtonLink href="/services" variant="outline" size="lg">See all treatments</ButtonLink>
              </div>
            )}
          </motion.div>
        </Container>

        {/* beat rail - shows where you are in the sequence */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {BEATS.map((b, i) => (
            <span
              key={b.id}
              className={`h-6 w-px transition-colors duration-500 ${
                i === active ? 'bg-accent' : 'bg-line'
              }`}
            />
          ))}
        </div>

        {/* scroll affordance, only on the first beat */}
        <motion.div
          animate={{ opacity: active === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted"
        >
          <ChevronDown size={15} className="animate-bounce" aria-hidden />
          Scroll to continue
        </motion.div>
      </div>
    </section>
  )
}
