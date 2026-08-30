import type { MetadataRoute } from 'next'
import { posts } from '@/content/posts'
import { SITE_URL } from '@/lib/seo'

/**
 * When the static pages last meaningfully changed.
 *
 * This was `new Date()`, which stamped every route as modified at build time.
 * Redeploying to fix a typo therefore told Google that all seven pages had
 * changed, and a lastModified that is always "now" carries no information, so
 * crawlers learn to ignore it. A hand-maintained constant is honest: bump it
 * when the content actually changes.
 */
const CONTENT_UPDATED = '2026-08-30'

const ROUTES: Array<{ path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }> = [
  { path: '', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/doctors', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency,
    priority,
  }))

  // Articles carry their own review date, which is real per-URL information
  // and the one case where lastModified genuinely helps a crawler.
  const articles = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updated ?? p.date,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  return [...pages, ...articles]
}
