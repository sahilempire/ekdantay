import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { team } from '@/content/team'

export function TeamGrid({
  title = 'Meet Our Experienced Dentists',
  limit,
}: {
  title?: string
  limit?: number
}) {
  const shown = limit ? team.slice(0, limit) : team

  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Our team" title={title} />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05} className="text-center">
              <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-surface-sunk">
                <Image
                  src={m.image}
                  alt={`${m.name}, ${m.role} at Ekdantay Dental Clinic`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 text-base">{m.name}</h3>
              <p className="mt-1 text-sm text-muted">{m.role}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
