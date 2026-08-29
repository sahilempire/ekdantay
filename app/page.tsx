import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { HeroCanvas } from '@/components/hero/HeroCanvas'
import { Reveal } from '@/components/motion/Reveal'
import { clinic } from '@/content/clinic'

export default function Home() {
  return (
    <main id="main">
      <Container className="py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Sawai Madhopur, Rajasthan
            </p>
            <h1 className="text-4xl sm:text-5xl">{clinic.tagline}</h1>
            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Gentle, unhurried dental care — from routine cleanings to implants and
              orthodontics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="lg">Book Appointment</ButtonLink>
              <ButtonLink href={clinic.phone.tel} variant="outline" size="lg">
                {clinic.phone.display}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <HeroCanvas />
          </Reveal>
        </div>
      </Container>
    </main>
  )
}
