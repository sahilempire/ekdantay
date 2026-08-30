'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll } from 'motion/react'
import { ChevronDown, Phone } from 'lucide-react'
import { BEATS, resolveBeat, resolveBeatIndex } from './beats'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { SplitText } from '@/components/motion/SplitText'
import { Magnetic } from '@/components/motion/Magnetic'
import { clinic } from '@/content/clinic'
import { hoursSummary } from '@/lib/hours'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

/**
 * The whole top of the page: one pinned 3D scene the camera flies through,
 * with the hero as its opening beat rather than a separate section.
 *
 * Three decisions worth naming:
 *
 * Scroll progress is written to a REF, not state. React state here would
 * reconcile the tree on every scroll event; the ref feeds useFrame directly
 * and the canvas never re-renders. Only the copy layer is state-driven, and
 * only when the beat index actually changes.
 *
 * The ground colour transitions per beat. That shifting ground is most of why
 * a scroll sequence reads as cinematic rather than as a long page, and it is
 * cheap - one animated background on the sticky container.
 *
 * It runs on phones. The 2026 guidance is explicit that desktop-only scroll
 * experiences are obsolete and the right pattern is device-tier detection
 * serving a lighter scene, which is what Scene does.
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
      const next = resolveBeatIndex(v)
      setActive((prev) => (prev === next ? prev : next))
      // Publish the ground's darkness so fixed chrome above the stage - the
      // sticky header - can invert with it, instead of sitting in light mode
      // over a dark beat.
      document.documentElement.dataset.stageDark = BEATS[next].dark ? 'true' : 'false'
    })
  }, [scrollYProgress])

  // Clear it on unmount so other routes never inherit a dark header.
  useEffect(
    () => () => {
      delete document.documentElement.dataset.stageDark
    },
    [],
  )

  // Reduced motion: same content, stacked and static, no canvas at all.
  if (reduced) {
    return (
      <section className="py-20">
        <Container>
          <div className="mb-16 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {BEATS[0].eyebrow}
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl">{BEATS[0].title}</h1>
            <p className="mt-5 text-lg text-ink-soft">{BEATS[0].body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="lg">Book Appointment</ButtonLink>
              <ButtonLink href={clinic.phone.tel} variant="outline" size="lg">
                {clinic.phone.display}
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {BEATS.filter((b) => !b.kind).map((b) => (
              <div key={b.id} className="rounded-2xl border border-line bg-surface p-8">
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
  const alignRight = beat.side === 'right'

  return (
    <section
      ref={wrap}
      aria-label="Modern dentistry, explained"
      style={{ height: `${BEATS.length * 100}vh` }}
      className="relative"
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        animate={{ backgroundColor: beat.bg }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0">{ready && <Scene progressRef={progress} />}</div>

        {/*
          Directional scrim on the copy side.

          Zooming the camera in on each layer is what makes the sequence read
          as a product demo rather than a wide shot - but it also pushes the
          model straight under the text. A gradient anchored to whichever side
          the copy sits on keeps type legible without flattening the whole
          scene behind a uniform overlay.
        */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: alignRight
              ? `linear-gradient(270deg, ${beat.bg} 0%, ${beat.bg} 22%, transparent 62%)`
              : `linear-gradient(90deg, ${beat.bg} 0%, ${beat.bg} 22%, transparent 62%)`,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        <Container className="pointer-events-none relative flex h-screen items-center">
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: beat.ink }}
            className={`max-w-md ${alignRight ? 'ml-auto text-right' : ''}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {beat.eyebrow}
            </p>

            {beat.kind === 'hero' ? (
              <SplitText as="h1" className="mt-4 text-4xl sm:text-5xl" delay={0.2}>
                {beat.title}
              </SplitText>
            ) : (
              <h2 className="mt-4 text-4xl sm:text-5xl">{beat.title}</h2>
            )}

            <p className="mt-5 opacity-80">{beat.body}</p>

            {beat.readout && (
              <div
                className={`mt-8 inline-flex items-baseline gap-4 rounded-xl border px-5 py-3 backdrop-blur-sm ${
                  alignRight ? 'flex-row-reverse' : ''
                }`}
                style={{ borderColor: 'color-mix(in srgb, currentColor 22%, transparent)' }}
              >
                <span className="text-xs uppercase tracking-[0.12em] opacity-60">
                  {beat.readout.label}
                </span>
                <span className="tabular font-display text-lg text-accent">
                  {beat.readout.value}
                </span>
              </div>
            )}

            {(beat.kind === 'hero' || beat.kind === 'cta') && (
              <div
                className={`pointer-events-auto mt-8 flex flex-wrap gap-3 ${
                  alignRight ? 'justify-end' : ''
                }`}
              >
                <Magnetic>
                  <ButtonLink href="/contact" size="lg">Book Appointment</ButtonLink>
                </Magnetic>
                <ButtonLink href={clinic.phone.tel} variant="outline" size="lg">
                  <Phone size={16} aria-hidden />
                  {clinic.phone.display}
                </ButtonLink>
              </div>
            )}

            {beat.kind === 'hero' && (
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-8 text-sm opacity-80"
                  style={{ borderColor: 'color-mix(in srgb, currentColor 18%, transparent)' }}>
                {hoursSummary().map(({ label, value }) => (
                  <div key={label}>
                    <dt className="opacity-60">{label}</dt>
                    <dd className="tabular">{value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="opacity-60">Emergency</dt>
                  <dd>24/7</dd>
                </div>
              </dl>
            )}
          </motion.div>
        </Container>

        {/* Beat rail — where you are in the sequence. */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {BEATS.map((b, i) => (
            <motion.span
              key={b.id}
              className="w-px"
              animate={{
                height: i === active ? 28 : 14,
                backgroundColor: i === active ? 'var(--accent)' : beat.ink,
                opacity: i === active ? 1 : 0.3,
              }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>

        <motion.div
          animate={{ opacity: active === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ color: beat.ink }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.14em] opacity-60"
        >
          <ChevronDown size={15} className="animate-bounce" aria-hidden />
          Scroll to continue
        </motion.div>
      </motion.div>
    </section>
  )
}
