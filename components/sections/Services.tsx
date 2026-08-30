import * as Icons from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { services } from '@/content/services'

/** Resolve a lucide icon by the name stored in content, with a safe default. */
function Icon({ name }: { name: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Stethoscope
  return <Cmp size={22} aria-hidden />
}

export function Services({ limit }: { limit?: number }) {
  const shown = limit ? services.slice(0, limit) : services

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Our Services Keep You Smiling"
          blurb="Comprehensive dental care services designed to maintain and enhance your oral health."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s, i) => (
            <Reveal
              key={s.slug}
              delay={i * 0.06}
              className="group rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-accent"
            >
              <span className="inline-flex rounded-xl bg-accent-wash p-3 text-accent">
                <Icon name={s.icon} />
              </span>
              <h3 className="mt-5 text-lg">{s.title}</h3>
              <p className="mt-2.5 text-sm text-ink-soft">{s.blurb}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
