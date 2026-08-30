import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/sections/PageHero'
import { Container } from '@/components/ui/Container'
import { posts, getPost } from '@/content/posts'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Post not found' }
  return { title: post.title, description: post.excerpt }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <main id="main">
      <PageHero title="Blog" crumb="Blog" headingLevel={2} />
      <Container className="py-20">
        <article className="mx-auto max-w-2xl">
          <p className="text-xs text-muted">
            {new Date(post.date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}{' '}
            · {post.author}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl">{post.title}</h1>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-surface-sunk">
            <Image src={post.image} alt="" fill sizes="(max-width: 768px) 90vw, 42rem" className="object-cover" />
          </div>
          <p className="mt-8 text-ink-soft">{post.body}</p>
        </article>
      </Container>
    </main>
  )
}
