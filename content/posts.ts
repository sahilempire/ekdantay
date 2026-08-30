import type { Block, Post } from './types'

import { howACavityForms } from './articles/how-a-cavity-forms'
import { rootCanalWhatHappens } from './articles/root-canal-what-happens'
import { toothSensitivityExplained } from './articles/tooth-sensitivity-explained'
import { bleedingGumsAndGumDisease } from './articles/bleeding-gums-and-gum-disease'
import { replacingAMissingTooth } from './articles/replacing-a-missing-tooth'
import { teethWhiteningWhatWorks } from './articles/teeth-whitening-what-works'
import { bracesOrAligners } from './articles/braces-or-aligners'
import { knockedOutToothFirstAid } from './articles/knocked-out-tooth-first-aid'
import { wisdomTeethWhenToRemove } from './articles/wisdom-teeth-when-to-remove'
import { brushingWhatTheEvidenceSupports } from './articles/brushing-what-the-evidence-supports'
import { childrensTeethFirstVisit } from './articles/childrens-teeth-first-visit'
import { whatHappensAtACheckup } from './articles/what-happens-at-a-checkup'

/**
 * The blog.
 *
 * This replaces the eleven entries ported from legacy/blog.html, which were
 * eleven copies of the same lorem paragraph under the same title, dated 2018.
 * That was not merely useless, it was actively harmful: eleven URLs of
 * identical text is textbook duplicate content, and it was sitting in the
 * sitemap asking to be crawled.
 *
 * Every article here is a real treatment explainer, because that is what earns
 * a single-location clinic its search traffic. Somebody in Sawai Madhopur
 * searching "root canal kitna painful hai" is a patient; somebody searching
 * the clinic's name already knows about us.
 *
 * One article per file. A clinic blog is meant to grow, and a thousand-line
 * module that everything imports from is where growth stops being pleasant.
 *
 * IMPORTANT: every clinical claim traces to a `sources` entry, and the byline
 * is a named clinician. Dr. Divya Bharti needs to read these before they are
 * treated as her words. See docs/blog-review.md.
 */
export const posts: Post[] = [
  whatHappensAtACheckup,
  childrensTeethFirstVisit,
  brushingWhatTheEvidenceSupports,
  wisdomTeethWhenToRemove,
  knockedOutToothFirstAid,
  bracesOrAligners,
  teethWhiteningWhatWorks,
  replacingAMissingTooth,
  bleedingGumsAndGumDisease,
  toothSensitivityExplained,
  rootCanalWhatHappens,
  howACavityForms,
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

/** Every distinct category, in the order the posts introduce them. */
export function categories(): string[] {
  return [...new Set(posts.map((p) => p.category))]
}

/** The plain text of a block, for word counts and excerpt fallbacks. */
function blockText(b: Block): string {
  switch (b.kind) {
    case 'p':
    case 'h2':
    case 'h3':
      return b.text
    case 'ul':
    case 'ol':
      return b.items.join(' ')
    case 'note':
      return `${b.title} ${b.text}`
    case 'figure':
      return `${b.value} ${b.label}`
  }
}

export function wordCount(post: Post): number {
  return post.body.map(blockText).join(' ').split(/\s+/).filter(Boolean).length
}

/**
 * Reading time, computed rather than typed into each article.
 *
 * 200 words per minute is the conventional figure for general prose. Deriving
 * it means it cannot drift out of date when an article is edited, which a
 * hand-written number silently would.
 */
export function readingMinutes(post: Post): number {
  return Math.max(1, Math.round(wordCount(post) / 200))
}

/**
 * The posts this one links to, resolved and filtered.
 *
 * A dangling slug in `related` would otherwise render a broken card, so
 * unknown slugs are dropped here and asserted against in the content tests.
 */
export function relatedPosts(post: Post, limit = 2): Post[] {
  const explicit = (post.related ?? [])
    .map(getPost)
    .filter((p): p is Post => Boolean(p) && p!.slug !== post.slug)

  if (explicit.length >= limit) return explicit.slice(0, limit)

  // Backfill from the same category, then anything, so a card grid is never
  // left half empty when an article has only one hand-picked relation.
  const seen = new Set([post.slug, ...explicit.map((p) => p.slug)])
  const fallback = [
    ...posts.filter((p) => p.category === post.category && !seen.has(p.slug)),
    ...posts.filter((p) => !seen.has(p.slug)),
  ]

  const out = [...explicit]
  for (const p of fallback) {
    if (out.length >= limit) break
    if (out.some((q) => q.slug === p.slug)) continue
    out.push(p)
  }
  return out
}
