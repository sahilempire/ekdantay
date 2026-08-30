import type { Post } from './types'

/**
 * The eleven blog entries from legacy/blog.html, ported verbatim (spec 4.2).
 *
 * Every one carries the same lorem title and body, dated Sep. 20 2018, authored
 * by "Admin". None is a real article. They are kept because the Blog stays in
 * the nav; replacing them with genuine treatment explainers is the highest-value
 * piece of the deferred content work, since that is what earns local search
 * traffic for a clinic.
 */
const TITLE = 'Even the all-powerful Pointing has no control about the blind texts'

const EXCERPT =
  'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.'

const BODY =
  'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.'

const IMAGES = [
  'image_1.webp', 'image_2.webp', 'image_3.webp', 'image_4.webp', 'image_5.webp', 'image_6.webp',
]

export const posts: Post[] = Array.from({ length: 11 }, (_, i) => ({
  slug: `post-${i + 1}`,
  title: TITLE,
  date: '2018-09-20',
  author: 'Admin',
  comments: 3,
  image: `/images/${IMAGES[i % IMAGES.length]}`,
  excerpt: EXCERPT,
  body: BODY,
}))

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
