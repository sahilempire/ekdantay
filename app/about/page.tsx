import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { Achievements } from '@/components/sections/Achievements'
import { Testimonials } from '@/components/sections/Testimonials'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { statsInner } from '@/content/stats'
import { clinic } from '@/content/clinic'

export const metadata: Metadata = {
  title: 'About Us',
  description: `About ${clinic.name} — a dental practice in Sawai Madhopur, Rajasthan, offering unhurried care in a calm environment.`,
}

const PILLARS = [
  { title: 'Experienced Dentists', body: 'Our team of qualified dentists brings years of experience and expertise to provide the best dental care.' },
  { title: 'Modern Technology', body: 'State-of-the-art dental equipment and advanced treatment techniques for superior results.' },
  { title: 'Comfortable Environment', body: 'A calm, welcoming clinic designed to put nervous patients at ease from the moment they arrive.' },
]

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero title="About Us" crumb="About" />
      <Container className="py-20">
        <SectionHeading
          eyebrow="Who we are"
          title="Ekdantay with a personal touch"
          blurb="Providing exceptional dental care with a focus on patient comfort and satisfaction."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07} className="rounded-2xl border border-line bg-surface p-7">
              <h3 className="text-lg">{p.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
      <Achievements stats={statsInner} />
      <Testimonials />
    </main>
  )
}
