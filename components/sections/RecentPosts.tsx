import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/motion/Reveal'
import { posts } from '@/content/posts'

export function RecentPosts({ limit = 3 }: { limit?: number }) {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Journal" title="From Our Blog" />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, limit).map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06} as="article">
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
                  · {post.author}
                </p>
                <h3 className="mt-2 line-clamp-2 text-lg transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
