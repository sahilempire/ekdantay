import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { ArticleFaq } from '@/components/blog/ArticleFaq'
import { PostCard } from '@/components/blog/PostCard'
import { JsonLd, clinicNode, websiteNode, breadcrumbNode } from '@/components/JsonLd'
import { posts, getPost, readingMinutes, relatedPosts } from '@/content/posts'
import { clinic } from '@/content/clinic'
import { absolute, pageUrl, ID } from '@/lib/seo'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Post not found' }

  const path = `/blog/${post.slug}`

  return {
    // seoTitle when the search-facing headline differs from the on-page h1:
    // an h1 can afford to be conversational, a <title> has about 60 useful
    // characters and has to lead with the words people actually type.
    title: post.seoTitle ?? post.title,
    description: post.description,
    ...pageUrl(path),
    openGraph: {
      type: 'article',
      url: absolute(path),
      title: post.seoTitle ?? post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      section: post.category,
      /*
        No `images` here on purpose. The colocated opengraph-image.tsx
        generates a 1200x630 card carrying this article's own headline, and an
        explicit images array would override the file convention and put a
        generic stock photo in its place. The generated card is what makes a
        forwarded WhatsApp link look like an article rather than spam.
      */
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle ?? post.title,
      description: post.description,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const path = `/blog/${post.slug}`
  const related = relatedPosts(post)

  const published = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main id="main">
      <JsonLd
        nodes={[
          clinicNode(),
          websiteNode(),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
          ]),
          {
            '@type': 'BlogPosting',
            '@id': `${absolute(path)}#article`,
            headline: post.seoTitle ?? post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            /* A named clinician rather than the business. Health content is
               held to a higher bar by Google, and an identifiable author with
               relevant credentials is a large part of clearing it. */
            author: { '@type': 'Person', name: post.author, jobTitle: 'Dentist' },
            publisher: { '@id': ID.clinic },
            image: absolute(post.image),
            articleSection: post.category,
            inLanguage: 'en-IN',
            wordCount: readingMinutes(post) * 200,
            mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(path) },
            ...(post.sources?.length
              ? { citation: post.sources.map((s) => s.url) }
              : {}),
          },
          /* The FAQ is emitted from the same array the page renders, so the
             two can never describe different answers. */
          ...(post.faq?.length
            ? [
                {
                  '@type': 'FAQPage',
                  '@id': `${absolute(path)}#faq`,
                  mainEntity: post.faq.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                  })),
                },
              ]
            : []),
        ]}
      />

      <Container className="pt-14 pb-20">
        <article className="mx-auto max-w-2xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <Link href="/blog" className="transition-colors hover:text-accent">
              Blog
            </Link>
            <span className="mx-2" aria-hidden>
              /
            </span>
            <span className="text-ink-soft">{post.category}</span>
          </nav>

          <header className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {post.category}
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">{post.title}</h1>
            <p className="mt-6 text-lg text-ink-soft">{post.excerpt}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-5 text-sm text-muted">
              <span className="text-ink-soft">{post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{published}</time>
              <span aria-hidden>·</span>
              <span>{readingMinutes(post)} min read</span>
              {post.updated && post.updated !== post.date && (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    Reviewed{' '}
                    <time dateTime={post.updated}>
                      {new Date(post.updated).toLocaleDateString('en-IN', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </span>
                </>
              )}
            </div>
          </header>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-surface-sunk">
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              sizes="(max-width: 768px) 90vw, 42rem"
              className="object-cover"
              priority
            />
          </div>

          <ArticleBody blocks={post.body} />

          {post.faq && post.faq.length > 0 && <ArticleFaq items={post.faq} />}

          {post.sources && post.sources.length > 0 && (
            <section aria-labelledby="sources-heading" className="mt-16 border-t border-line pt-10">
              <h2 id="sources-heading" className="text-xl">
                References
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {post.sources.map((s) => (
                  <li key={s.url} className="text-sm text-ink-soft">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      <span>{s.label}</span>
                      <ExternalLink size={13} className="mt-1 shrink-0" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* General information, not a diagnosis. This belongs on every
              clinical page for the reader's sake as much as for liability. */}
          <p className="mt-12 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            This article is general information about dental health and is not a diagnosis or a
            substitute for an examination. Symptoms that look alike can have very different
            causes. If something in your own mouth is worrying you, book a visit or call us on{' '}
            <a href={clinic.phone.tel} className="text-accent underline underline-offset-4">
              {clinic.phone.display}
            </a>
            .
          </p>

          <section
            aria-label="Book an appointment"
            className="mt-10 rounded-2xl border border-line bg-accent-wash/50 p-8 text-center"
          >
            <h2 className="text-2xl">Have a question about your own teeth?</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">
              Ten minutes in the chair is usually all it takes to know where you stand. No
              obligation, no lecture.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact" size="lg">
                Book an appointment
              </ButtonLink>
              <ButtonLink href={clinic.phone.tel} variant="outline" size="lg">
                {clinic.phone.display}
              </ButtonLink>
            </div>
          </section>
        </article>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-surface py-20">
          <Container>
            <h2 id="related-heading" className="text-2xl sm:text-3xl">
              Read next
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {related.map((p, i) => (
                <PostCard key={p.slug} post={p} delay={i * 0.06} headingLevel={3} />
              ))}
            </div>
            <p className="mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-hover"
              >
                <ArrowLeft size={15} aria-hidden />
                All articles
              </Link>
            </p>
          </Container>
        </section>
      )}
    </main>
  )
}
