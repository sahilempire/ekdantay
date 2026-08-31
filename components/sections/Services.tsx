import Link from 'next/link'
import * as Icons from 'lucide-react'
import { ArrowRight, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { services } from '@/content/services'
import { posts } from '@/content/posts'
import { clinic } from '@/content/clinic'
import type { Service } from '@/content/types'

/**
 * The article that explains a given service, if one exists.
 *
 * The article names the service rather than the service naming the article,
 * so writing a new explainer wires up this link by itself and deleting one
 * cannot leave a dead reference behind.
 *
 * These links are the point of having a blog at all: they pass relevance from
 * the page someone lands on to the page that answers what they actually wanted
 * to know, and back again, which is most of what internal linking buys.
 */
function explainer(slug: string) {
  return posts.find((p) => p.service === slug)
}

/** Resolve a lucide icon by the name stored in content, with a safe default. */
function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Stethoscope
  return <Cmp size={size} aria-hidden />
}

/**
 * How wide each tile sits on a four-column grid.
 *
 * Widths only, no row spans. A bento built from row spans looks correct until
 * one blurb wraps to an extra line, at which point the whole thing develops
 * holes; letting rows size themselves and varying only the width survives
 * content changes. The spans total twelve, so the grid fills exactly three
 * rows with no gaps.
 *
 * Below `lg` this collapses: two columns on a tablet, one on a phone, and the
 * spans stop applying. Six equal cards is the right answer on a narrow screen.
 */
const SPAN: Record<string, string> = {
  'teeth-whitening': 'lg:col-span-2',
  'teeth-cleaning': 'lg:col-span-1',
  'orthodontics': 'lg:col-span-1',
  'pain-free-treatment': 'lg:col-span-1',
  'dental-implants': 'lg:col-span-3',
  'emergency-care': 'lg:col-span-4 sm:col-span-2',
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

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((s, i) =>
            /* Emergency is the one thing on this page somebody might need
               right now rather than next week, so it gets the full width, the
               inverted ground and a number to press instead of an article to
               read. */
            s.slug === 'emergency-care' ? (
              <EmergencyTile key={s.slug} service={s} delay={i * 0.05} />
            ) : (
              <ServiceTile key={s.slug} service={s} delay={i * 0.05} />
            ),
          )}
        </div>
      </Container>
    </section>
  )
}

function ServiceTile({ service: s, delay }: { service: Service; delay: number }) {
  const article = explainer(s.slug)
  // Wide tiles can carry the price and the link on one line. A single-column
  // tile cannot: they collide and wrap mid-phrase, which is what "Same day"
  // butted against "How this works" looked like.
  const span = SPAN[s.slug] ?? ''
  const wide = span.includes('col-span-3')
  const roomy = wide || span.includes('col-span-2')

  return (
    <Reveal
      delay={delay}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors duration-300 hover:border-accent ${span}`}
    >
      {/* A warm wash rising on hover. Sits under the content and is purely
          decorative, so it never intercepts a click. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-accent-wash to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex flex-1 flex-col">
        <span className="inline-flex self-start rounded-xl bg-accent-wash p-3 text-accent transition-transform duration-300 group-hover:-translate-y-0.5">
          <Icon name={s.icon} size={wide ? 26 : 22} />
        </span>

        <h3 className={`mt-5 ${wide ? 'text-2xl' : 'text-lg'}`}>{s.title}</h3>
        <p className={`mt-2.5 text-ink-soft ${wide ? 'max-w-md' : 'text-sm'}`}>{s.blurb}</p>

        <div
          className={`mt-auto pt-6 ${
            roomy
              ? 'flex flex-wrap items-center justify-between gap-3'
              : 'flex flex-col items-start gap-2'
          }`}
        >
          <span className="tabular font-display text-accent">{s.price}</span>
          {article && (
            <Link
              href={`/blog/${article.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-hover"
            >
              How this works
              <ArrowRight
                size={14}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
              <span className="sr-only">: {article.title}</span>
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  )
}

function EmergencyTile({ service: s, delay }: { service: Service; delay: number }) {
  const article = explainer(s.slug)

  return (
    <Reveal
      delay={delay}
      className={`group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl p-8 sm:flex-row sm:items-center ${SPAN[s.slug]}`}
      /* Inverted rather than another surface card. It echoes the dark ground
         the scroll story uses for its own emergency beat, and it stops three
         rows of identical tiles ending on a flat note. */
      style={{ backgroundColor: '#241C1A', color: '#F2ECE2' }}
    >
      <div className="flex items-start gap-5">
        <span className="inline-flex shrink-0 rounded-xl bg-white/10 p-3 text-glow">
          <Icon name={s.icon} size={24} />
        </span>
        <div>
          <h3 className="text-2xl">{s.title}</h3>
          <p className="mt-2 max-w-lg text-sm opacity-75">{s.blurb}</p>
          {article && (
            <Link
              href={`/blog/${article.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-glow transition-opacity hover:opacity-80"
            >
              What to do first
              <ArrowRight size={14} aria-hidden />
              <span className="sr-only">: {article.title}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
        <span className="font-display text-3xl">{s.price}</span>
        <a
          href={clinic.phone.tel}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm transition-colors hover:bg-white/20"
        >
          <Phone size={15} aria-hidden />
          <span className="tabular">{clinic.phone.display}</span>
        </a>
      </div>
    </Reveal>
  )
}
