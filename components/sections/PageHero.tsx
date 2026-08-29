import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import Link from 'next/link'

interface Props {
  title: string
  crumb: string
}

/**
 * Static page header for the six inner routes.
 *
 * The legacy site wrapped this in Owl Carousel markup on every page, but the
 * "carousel" held exactly one slide everywhere except the homepage - 42KB of
 * JavaScript animating nothing. It is plain markup here.
 */
export function PageHero({ title, crumb }: Props) {
  return (
    <section className="border-b border-line bg-surface">
      <Container>
        <div className="py-16 sm:py-20">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
              <Link href="/" className="transition-colors hover:text-accent">
                Home
              </Link>
              <span className="mx-2" aria-hidden>/</span>
              <span className="text-ink-soft">{crumb}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl">{title}</h1>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
