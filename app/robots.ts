import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Next's build artefacts and Vercel's analytics endpoint. Neither is
        // a page, and both otherwise show up as crawl errors in Search Console.
        disallow: ['/_next/', '/_vercel/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
