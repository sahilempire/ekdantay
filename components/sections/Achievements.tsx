'use client'

import { useCountUp } from '@/hooks/useCountUp'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import type { StatSet } from '@/content/types'

function Stat({ label, value, delay }: StatSet & { delay: number }) {
  const { value: shown, ref } = useCountUp(value)
  return (
    <Reveal delay={delay} className="text-center">
      <span ref={ref} className="block font-display text-4xl font-semibold tabular text-accent sm:text-5xl">
        {shown.toLocaleString('en-IN')}
      </span>
      <span className="mt-2 block text-sm text-ink-soft">{label}</span>
    </Reveal>
  )
}

export function Achievements({ stats }: { stats: StatSet[] }) {
  return (
    <section className="border-y border-line bg-surface py-16">
      <Container>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} delay={i * 0.08} />
          ))}
        </div>
      </Container>
    </section>
  )
}
