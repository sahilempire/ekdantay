import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import Link from 'next/link'

interface Props {
  title: string
  crumb: string
  /**
   * Drops the banner heading to an h2. Use on pages that carry their own h1
   * further down - a blog post's title is the real h1, and two h1s on one
   * page is both an SEO problem and a screen-reader one.
   */
  headingLevel?: 1 | 2
}

/**
 * Static page header for the six inner routes.
 *
 * The legacy site wrapped this in Owl Carousel markup on every page, but the
 * "carousel" held exactly one slide everywhere except the homepage - 42KB of
 * JavaScript animating nothing. It is plain markup here.
 */
export function PageHero({ title, crumb, headingLevel = 1 }: Props) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
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
            <Heading className="text-4xl sm:text-5xl">{title}</Heading>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
