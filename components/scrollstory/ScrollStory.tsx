'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll } from 'motion/react'
import { Phone } from 'lucide-react'
import { BEATS, TOTAL_HOLD, resolveBeatIndex } from './beats'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { SplitText } from '@/components/motion/SplitText'
import { clinic } from '@/content/clinic'
import { hoursSummary } from '@/lib/hours'

const ImageStage = dynamic(
  () => import('./ImageStage').then((m) => m.ImageStage),
  { ssr: false },
)

/**
 * The whole top of the page: one pinned 3D scene the camera flies through,
 * with the hero as its opening beat rather than a separate section.
 *
 * Three decisions worth naming:
 *
 * Scroll progress is written to a REF, not state. React state here would
 * reconcile the tree on every scroll event; the ref feeds useFrame directly
 * and the stage never re-renders. Only the copy layer is state-driven, and
 * only when the beat index actually changes.
 *
 * The ground colour transitions per beat. That shifting ground is most of why
 * a scroll sequence reads as cinematic rather than as a long page, and it is
 * cheap - one animated background on the sticky container.
 *
 * It runs on phones. The stage is pre-rendered images rather than real-time
 * 3D, which is what lets it behave identically on low-end Android instead of
 * needing a device-tier fallback: there is no WebGL in the critical path.
 */
export function ScrollStory() {
  const wrap = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  // The stage sits beside the copy on wide screens and behind it on phones,
  // and the scrim has to follow.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsNarrow(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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
      /*
        Height comes from the summed `hold` weights, not the beat count. The
        four layer beats are one continuous movement with little to read, so
        they hold less scroll than a treatment beat with a price to take in.
        Counting beats instead would have made this 55% longer than the nine
        beats it replaced, for the same reading time.
      */
      style={{ height: `${Math.round(TOTAL_HOLD * 100)}vh` }}
      className="relative"
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        animate={{ backgroundColor: beat.bg }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0">{ready && <ImageStage progressRef={progress} />}</div>

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
            background: isNarrow
              ? // Phones stack the subject above the copy, so only a soft
                // fade where the two meet is needed - a heavy scrim here was
                // what made the layers disappear on the dark beats.
                `linear-gradient(180deg, transparent 0%, transparent 34%, ${beat.bg} 52%)`
              : alignRight
                ? `linear-gradient(270deg, ${beat.bg} 0%, ${beat.bg} 22%, transparent 62%)`
                : `linear-gradient(90deg, ${beat.bg} 0%, ${beat.bg} 22%, transparent 62%)`,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        <Container className="stage-copy-wrap pointer-events-none relative flex h-screen items-center">
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: beat.ink }}
            className={`stage-copy max-w-md ${alignRight ? 'md:ml-auto md:text-right' : ''}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {beat.eyebrow}
            </p>

            {beat.kind === 'hero' ? (
              <SplitText as="h1" className="mt-4 text-3xl sm:text-4xl lg:text-5xl" delay={0.2}>
                {beat.title}
              </SplitText>
            ) : (
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">{beat.title}</h2>
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
                className={`stage-actions pointer-events-auto mt-8 flex flex-wrap gap-3 ${
                  alignRight ? 'md:justify-end' : ''
                }`}
              >
                <ButtonLink href="/contact" size="lg">Book Appointment</ButtonLink>
                <ButtonLink href={clinic.phone.tel} variant="outline" size="lg">
                  <Phone size={16} aria-hidden />
                  {clinic.phone.display}
                </ButtonLink>
              </div>
            )}

            {beat.kind === 'hero' && (
              <dl className="mt-10 hidden flex-wrap gap-x-10 gap-y-4 border-t pt-8 text-sm opacity-80 sm:flex"
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

        {/*
          Scroll hint.

          Was a bouncing chevron over the words "Scroll to continue", which is
          the single most templated pairing on the web and read as generated
          rather than designed. A hairline with a highlight travelling down it
          says the same thing without the cliche, and without any copy to
          translate or get stale.
        */}
        <motion.div
          animate={{ opacity: active === 0 ? 0.5 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute bottom-10 left-1/2 hidden h-14 w-px -translate-x-1/2 overflow-hidden sm:block"
          style={{ backgroundColor: 'color-mix(in srgb, currentColor 20%, transparent)', color: beat.ink }}
          aria-hidden
        >
          <motion.span
            className="absolute inset-x-0 h-5 rounded-full"
            style={{ backgroundColor: beat.ink }}
            animate={{ top: ['-20px', '56px'] }}
            transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
