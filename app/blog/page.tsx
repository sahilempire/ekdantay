import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { Container } from '@/components/ui/Container'
import { PostCard } from '@/components/blog/PostCard'
import { JsonLd, clinicNode, websiteNode, breadcrumbNode } from '@/components/JsonLd'
import { posts, categories } from '@/content/posts'
import { absolute, pageUrl, ID } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Dental Health Articles',
  description:
    'Plain explanations of how teeth actually work and what dental treatment involves, written by the dentists at Ekdantay in Sawai Madhopur. Decay, gum disease, root canals, implants, braces and emergencies.',
  ...pageUrl('/blog'),
  openGraph: {
    type: 'website',
    title: 'Dental Health Articles',
    description:
      'Plain explanations of how teeth actually work and what dental treatment involves, from the dentists at Ekdantay in Sawai Madhopur.',
  },
}

export default function BlogPage() {
  const groups = categories().map((category) => ({
    category,
    items: posts.filter((p) => p.category === category),
  }))

  return (
    <main id="main">
      <JsonLd
        nodes={[
          clinicNode(),
          websiteNode(),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
          {
            '@type': 'Blog',
            '@id': `${absolute('/blog')}#blog`,
            name: 'Ekdantay Dental Health Articles',
            description:
              'Treatment explainers and dental health guides from Ekdantay Dental Clinic, Sawai Madhopur.',
            publisher: { '@id': ID.clinic },
            inLanguage: 'en-IN',
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              '@id': `${absolute(`/blog/${p.slug}`)}#article`,
              headline: p.seoTitle ?? p.title,
              url: absolute(`/blog/${p.slug}`),
              datePublished: p.date,
              author: { '@type': 'Person', name: p.author },
            })),
          },
        ]}
      />

      <PageHero title="Dental health, explained" crumb="Blog" />

      <Container className="py-20">
        <p className="max-w-2xl text-lg text-ink-soft">
          Most dental advice is delivered as a list of rules with the reasoning left out. These
          are the explanations underneath: what is actually happening inside a tooth, what the
          research supports, and what it means for the decision in front of you.
        </p>

        {/* Grouped rather than a flat reverse-chronological wall. A clinic
            blog is a reference library, not a news feed: someone arriving on
            "bleeding gums" should see the rest of prevention next to it. */}
        <div className="mt-16 flex flex-col gap-20">
          {groups.map(({ category, items }) => (
            <section key={category} aria-labelledby={`cat-${category.toLowerCase()}`}>
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <h2
                  id={`cat-${category.toLowerCase()}`}
                  className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-accent"
                >
                  {category}
                </h2>
                <span className="tabular text-xs text-muted">
                  {items.length} {items.length === 1 ? 'article' : 'articles'}
                </span>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((post, i) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    delay={(i % 3) * 0.06}
                    headingLevel={3}
                    showCategory={false}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
