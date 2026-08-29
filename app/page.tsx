import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { clinic } from '@/content/clinic'

export default function Home() {
  return (
    <main id="main">
      <Container className="py-24">
        <h1 className="text-4xl sm:text-5xl">{clinic.tagline}</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          Scaffold checkpoint — sections land in Task 8.
        </p>
      </Container>
      <Container className="py-16">
        <SectionHeading eyebrow="Checkpoint" title="Layout renders" blurb="Header, footer and tokens are live." />
      </Container>
    </main>
  )
}
