import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { HeroCanvas } from '@/components/hero/HeroCanvas'
import { ScrollStory } from '@/components/scrollstory/ScrollStory'
import { Reveal } from '@/components/motion/Reveal'
import { SplitText } from '@/components/motion/SplitText'
import { Magnetic } from '@/components/motion/Magnetic'
import { Marquee } from '@/components/motion/Marquee'
import { Services } from '@/components/sections/Services'
import { Achievements } from '@/components/sections/Achievements'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { PricingTable } from '@/components/sections/PricingTable'
import { RecentPosts } from '@/components/sections/RecentPosts'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { clinic } from '@/content/clinic'
import { services } from '@/content/services'
import { statsHome } from '@/content/stats'
import { pricingINR } from '@/content/pricing'
import { hoursSummary } from '@/lib/hours'

export default function Home() {
  return (
    <main id="main">
      <Container className="py-14 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Sawai Madhopur, Rajasthan
            </p>
            <SplitText as="h1" className="text-4xl sm:text-5xl" delay={0.15}>
              {clinic.tagline}
            </SplitText>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Gentle, unhurried dental care — from routine cleanings to implants and
              orthodontics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <ButtonLink href="/contact" size="lg">Book Appointment</ButtonLink>
              </Magnetic>
              <ButtonLink href={clinic.phone.tel} variant="outline" size="lg">
                {clinic.phone.display}
              </ButtonLink>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-8 text-sm">
              {hoursSummary().map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-muted">{label}</dt>
                  <dd className="tabular text-ink">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-muted">Emergency</dt>
                <dd className="text-ink">24/7</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <HeroCanvas />
          </Reveal>
        </div>
      </Container>

      <ScrollStory />

      <section aria-hidden className="border-y border-line bg-surface">
        <Marquee items={services.map((s) => s.title)} />
      </section>

      <Services limit={6} />
      <Achievements stats={statsHome} />
      <TeamGrid limit={4} />
      <PricingTable tiers={pricingINR} blurb="Clear, upfront pricing for our most common treatments." />
      <RecentPosts limit={3} />

      <section aria-label="Clinic location" className="border-t border-line">
        <MapEmbed height={420} />
      </section>
    </main>
  )
}
