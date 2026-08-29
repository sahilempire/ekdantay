import type { Testimonial } from './types'

/**
 * Ported verbatim from legacy/about.html (spec 4.2).
 *
 * These are DentaCare template placeholders: all five are attributed to
 * "Dennis Green" with job titles that are not dental patients. The homepage
 * had already commented its copy out; the About page had not. Kept as-is by
 * decision, isolated here so removing them is deleting this array.
 */
const LOREM_A =
  'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.'

const LOREM_B =
  'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.'

export const testimonials: Testimonial[] = [
  { name: 'Dennis Green', role: 'Marketing Manager', image: '/images/person_1.jpg', quote: LOREM_A },
  { name: 'Dennis Green', role: 'Interface Designer', image: '/images/person_2.jpg', quote: LOREM_B },
  { name: 'Dennis Green', role: 'UI Designer',        image: '/images/person_3.jpg', quote: LOREM_B },
  { name: 'Dennis Green', role: 'Web Developer',      image: '/images/person_1.jpg', quote: LOREM_B },
  { name: 'Dennis Green', role: 'System Analytics',   image: '/images/person_2.jpg', quote: LOREM_B },
]
