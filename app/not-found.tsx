import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'

/** The legacy site had no 404 page, and 12 links pointed at a file that never existed. */
export default function NotFound() {
  return (
    <main id="main">
      <Container className="py-28 text-center">
        <p className="font-display text-6xl font-semibold text-accent">404</p>
        <h1 className="mt-4 text-3xl">We couldn&rsquo;t find that page</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          The page may have moved. You can head back to the homepage, or get in touch and
          we&rsquo;ll point you the right way.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg">Back to Home</ButtonLink>
          <ButtonLink href="/contact" variant="outline" size="lg">Contact Us</ButtonLink>
        </div>
      </Container>
    </main>
  )
}
