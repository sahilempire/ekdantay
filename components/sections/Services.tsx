import Link from 'next/link'
import * as Icons from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { services } from '@/content/services'
import { posts } from '@/content/posts'

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
          {shown.map((s, i) => {
            const article = explainer(s.slug)
            return (
              <Reveal
                key={s.slug}
                delay={i * 0.06}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-accent"
              >
                <span className="inline-flex rounded-xl bg-accent-wash p-3 text-accent">
                  <Icon name={s.icon} />
                </span>
                <h3 className="mt-5 text-lg">{s.title}</h3>
                <p className="mt-2.5 text-sm text-ink-soft">{s.blurb}</p>

                {article && (
                  <Link
                    href={`/blog/${article.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 self-start text-sm text-accent transition-colors hover:text-accent-hover"
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
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
