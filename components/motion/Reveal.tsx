'use client'

import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface RevealProps {
  children: React.ReactNode
  /** Seconds. Stagger siblings by passing 0.06, 0.12, ... */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}

/**
 * Scroll-triggered reveal. Replaces the 169 `.ftco-animate` elements that
 * jquery.waypoints drove on the legacy site.
 *
 * Under reduced motion it renders a plain element with no motion wrapper at
 * all, rather than an animation with duration zero - so there is nothing to
 * mis-fire and no transform left on the element.
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const Tag = as

  if (reduced) return <Tag className={className}>{children}</Tag>

  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
