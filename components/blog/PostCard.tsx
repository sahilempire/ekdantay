import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/motion/Reveal'
import { readingMinutes } from '@/content/posts'
import type { Post } from '@/content/types'

/**
 * One article card.
 *
 * Extracted because the blog index, the homepage strip and the related-posts
 * grid rendered three near-identical copies of this markup, which is how the
 * three of them ended up with different alt-text handling.
 */
export function PostCard({
  post,
  delay = 0,
  headingLevel = 2,
  showCategory = true,
}: {
  post: Post
  delay?: number
  /** Cards under a section h2 must be h3s, or the outline breaks. */
  headingLevel?: 2 | 3
  /** Off inside a category section, where the heading already says it. */
  showCategory?: boolean
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <Reveal delay={delay} as="article">
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-sunk">
          <Image
            src={post.image}
            /* Empty by design: the card's link text is the headline right
               below it, so describing the photo again only adds noise for a
               screen reader. The article page gives the same image real alt
               text, where it is content rather than decoration. */
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          {showCategory && (
            <>
              <span className="font-semibold uppercase tracking-[0.12em] text-accent">
                {post.category}
              </span>
              <span aria-hidden>·</span>
            </>
          )}
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
          <span aria-hidden>·</span>
          <span>{readingMinutes(post)} min read</span>
        </p>

        <Heading className="mt-2 text-lg transition-colors group-hover:text-accent">
          {post.title}
        </Heading>
        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{post.excerpt}</p>
      </Link>
    </Reveal>
  )
}
