import { Check } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import type { PricingTier } from '@/content/types'

export function PricingTable({
  tiers,
  title = 'Our Best Pricing',
  blurb,
}: {
  tiers: PricingTier[]
  title?: string
  blurb?: string
}) {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Pricing" title={title} blurb={blurb} />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <Reveal
              key={tier.title}
              delay={i * 0.06}
              className="flex flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-accent"
            >
              <h3 className="text-lg">{tier.title}</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold tabular text-accent">
                  {tier.amount}
                </span>
                <span className="text-sm text-muted">{tier.unit}</span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-ink-soft">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={15} className="mt-1 shrink-0 text-accent" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/contact" variant="outline" className="mt-7 w-full">
                Book Now
              </ButtonLink>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
