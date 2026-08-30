'use client'

import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Props {
  children: string
  className?: string
  /** Seconds before the first word moves. */
  delay?: number
  /** Seconds between consecutive words. */
  stagger?: number
  as?: 'h1' | 'h2' | 'p' | 'span'
}

/**
 * Word-by-word mask reveal.
 *
 * Each word sits in an overflow-hidden box and slides up from below its own
 * baseline, so the line assembles rather than simply fading in. This is the
 * single highest-impact piece of motion on the page - it is the first thing
 * that happens and it sets the register for everything after.
 */
export function SplitText({
  children,
  className,
  delay = 0,
  stagger = 0.055,
  as = 'h1',
}: Props) {
  const reduced = usePrefersReducedMotion()
  const Tag = as

  if (reduced) return <Tag className={className}>{children}</Tag>

  const words = children.split(' ')

  return (
    <Tag className={className} aria-label={children}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotate: 4 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
