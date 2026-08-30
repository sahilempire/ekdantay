import { ImageResponse } from 'next/og'
import { posts, getPost } from '@/content/posts'
import { clinic } from '@/content/clinic'

export const alt = 'Article from Ekdantay Dental Clinic'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

/**
 * A per-article social card carrying the headline.
 *
 * Worth the twelve extra build-time images specifically for this audience:
 * most sharing here happens in WhatsApp, where a link with no preview is
 * indistinguishable from spam, and one showing the actual headline is what
 * makes a forwarded article get opened.
 */
export default async function ArticleOgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F3EFE8',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{ width: 44, height: 44, borderRadius: 12, background: '#0F6B5C', display: 'flex' }}
          />
          <div style={{ display: 'flex', gap: 0, fontSize: 30, color: '#1F1B16' }}>
            <span>Ekdan</span>
            <span style={{ color: '#0F6B5C' }}>tay</span>
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#786E62', marginLeft: 12 }}>
            {post?.category ?? 'Dental health'}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: post && post.title.length > 58 ? 56 : 66,
            color: '#1F1B16',
            lineHeight: 1.12,
            letterSpacing: -2,
          }}
        >
          {post?.title ?? 'Dental health, explained'}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '2px solid #DFD7CB',
            paddingTop: 28,
            fontSize: 24,
            color: '#4A4239',
          }}
        >
          <div style={{ display: 'flex' }}>{post?.author ?? clinic.name}</div>
          <div style={{ display: 'flex', color: '#0F6B5C' }}>Sawai Madhopur</div>
        </div>
      </div>
    ),
    size,
  )
}
