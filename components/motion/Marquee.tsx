'use client'

import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Infinite horizontal ticker.
 *
 * The track holds two identical copies and translates exactly -50%, so the
 * loop point lands on the seam and the motion reads as continuous rather than
 * snapping. Under reduced motion it becomes a static, scrollable row.
 */
export function Marquee({
  items,
  speed = 26,
  reverse = false,
}: {
  items: string[]
  speed?: number
  reverse?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const track = [...items, ...items]

  const Row = (
    <>
      {track.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-6 sm:gap-10">
          <span className="font-display text-2xl sm:text-4xl">{item}</span>
          <span className="text-accent" aria-hidden>&#10022;</span>
        </span>
      ))}
    </>
  )

  if (reduced) {
    return (
      <div className="flex gap-6 overflow-x-auto py-6 sm:gap-10" role="list">
        {items.map((i) => (
          <span key={i} className="shrink-0 font-display text-2xl sm:text-4xl">{i}</span>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden py-6" aria-hidden>
      <motion.div
        className="flex w-max gap-6 sm:gap-10"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {Row}
      </motion.div>
    </div>
  )
}
