import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PostCard } from '@/components/blog/PostCard'
import { posts } from '@/content/posts'

export function RecentPosts({ limit = 3 }: { limit?: number }) {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Journal"
          title="Dental health, explained"
          blurb="What is actually happening inside a tooth, and what the evidence says about treating it."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, limit).map((post, i) => (
            <PostCard key={post.slug} post={post} delay={i * 0.06} headingLevel={3} />
          ))}
        </div>
        <p className="mt-12">
          <Link
            href="/blog"
            className="text-sm text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
          >
            Read all articles
          </Link>
        </p>
      </Container>
    </section>
  )
}
