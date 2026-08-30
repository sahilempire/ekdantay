import type { Metadata } from 'next'
import { clinic } from '@/content/clinic'

/**
 * One definition of the site's origin.
 *
 * It was previously written out in four places: layout.tsx, sitemap.ts,
 * robots.ts and JsonLd.tsx. Three of them agreed. That is the kind of drift
 * that silently splits a domain's ranking between two hostnames.
 */
export const SITE_URL = 'https://www.ekdantay.com'

/** Absolute URL for a site-relative path. */
export function absolute(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

/**
 * Canonical + Open Graph URL for a page, as a Metadata fragment to spread.
 *
 * This exists because of a real defect. `alternates.canonical: '/'` was set on
 * the root layout, and Next inherits alternates down the tree, so every page
 * on the site shipped `<link rel="canonical" href="https://www.ekdantay.com">`.
 * That tells Google that /services, /about, /contact and every blog post are
 * duplicates of the homepage and should be dropped from the index. The site
 * was instructing search engines to de-index all of itself except one page.
 *
 * The root no longer declares one at all, which is deliberate: a page that
 * forgets to call this now ships NO canonical and Google self-canonicalises
 * harmlessly, instead of inheriting a WRONG one. Wrong is much worse than
 * missing here.
 */
export function pageUrl(path: string): Metadata {
  return {
    alternates: { canonical: path },
    openGraph: { url: absolute(path) },
  }
}

export interface Crumb {
  name: string
  path: string
}

/**
 * BreadcrumbList structured data.
 *
 * Google renders these as the path shown under a result instead of a raw URL,
 * which measurably helps click-through on inner pages. The visual breadcrumb
 * in PageHero and this markup are built from the same array by each page, so
 * they cannot describe different hierarchies.
 */
export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  }
}

/** Stable @id values so structured-data nodes can reference each other. */
export const ID = {
  clinic: `${SITE_URL}/#clinic`,
  website: `${SITE_URL}/#website`,
} as const

/**
 * Wraps nodes in a schema.org @graph and renders the script tag.
 *
 * A graph rather than separate scripts so that a BlogPosting can point its
 * publisher at the Dentist node by @id instead of repeating the whole
 * business record on every article.
 */
export function graphLd(nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

/** Shared Open Graph defaults, so every page gets a card. */
export const OG_LOCALE = 'en_IN'

export const SITE_NAME = clinic.name
