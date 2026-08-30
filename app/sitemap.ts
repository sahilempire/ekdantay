import type { MetadataRoute } from 'next'
import { posts } from '@/content/posts'

const BASE = 'https://www.ekdantay.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/services', '/doctors', '/blog', '/contact'].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const articles = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  return [...routes, ...articles]
}
