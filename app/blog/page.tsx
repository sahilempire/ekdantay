import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '@/components/sections/PageHero'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { posts } from '@/content/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes and updates from Ekdantay Dental Clinic in Sawai Madhopur.',
}

export default function BlogPage() {
  return (
    <main id="main">
      <PageHero title="Read Our Blog" crumb="Blog" />
      <Container className="py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.06} as="article">
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-sunk">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, 30vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-xs text-muted">
                  {new Date(post.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}{' '}
                  · {post.author} · {post.comments} comments
                </p>
                <h2 className="mt-2 line-clamp-2 text-lg transition-colors group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  )
}
