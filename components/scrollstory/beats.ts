/**
 * The scroll sequence: the whole top of the page, not one section.
 *
 * Two acts.
 *
 * Act one is anatomy. Skull, to jaw, to a cross-section, and then the tooth
 * comes apart one layer at a time. No prices here, nothing being sold: the
 * reader is being shown what is inside their own tooth.
 *
 * Act two is treatment, one beat per service, each with its price.
 *
 * The split matters. These were previously interleaved, so an "enamel" beat
 * carried a whitening price and showed a before-and-after photo instead of the
 * enamel layer. The sequence promised to explain a tooth layer by layer and
 * then showed two layers out of four. Separating the acts lets all four layers
 * use the exploded animation, and lets each service have its own image rather
 * than borrowing an anatomical one.
 *
 * Modelled on oryzo.ai: one continuous scene the camera flies through, each
 * beat pairing a view with a copy block, a readout and a ground colour. The
 * difference is that the subject here is a real thing rather than a fiction.
 */
import { servicePrice } from '@/content/services'

export interface Beat {
  id: string
  eyebrow: string
  title: string
  body: string
  /** Small technical card, the way Oryzo shows "FRICTION COEFFICIENT: 0.80". */
  readout?: { label: string; value: string }
  /**
   * How much scroll this beat holds, relative to the others.
   *
   * The four layer beats are one continuous movement with little to read, so
   * they get less; the hero and the closing call to action have buttons to
   * aim at, so they get more. Without this, growing from nine beats to
   * fourteen would have made the sequence 55% longer for no extra content.
   */
  hold?: number
  /**
   * Ground colour for this beat, as a CSS value. The page darkens as the
   * sequence goes inside the tooth and returns to light for the treatments.
   * That shifting ground is most of why a scroll sequence reads as cinematic
   * rather than as a long page.
   */
  bg: string
  /** Ink colour that stays legible on `bg`. */
  ink: string
  /** True when `bg` is dark, so chrome above the stage can invert. */
  dark?: boolean
  /** Which side the copy sits on. Uniformly left; see ImageStage. */
  side?: 'left' | 'right'
  /** Marks the opening beat and the closing one, which render buttons. */
  kind?: 'hero' | 'cta'
}

/** A beat with its resolved scroll position. */
export type PlacedBeat = Beat & { at: number }

const AUTHORED: Beat[] = [
  // ---- Act one: anatomy -------------------------------------------------
  {
    id: 'hero',
    kind: 'hero',
    hold: 1,
    eyebrow: 'Sawai Madhopur, Rajasthan',
    title: 'Modern Dentistry in a Calm and Relaxed Environment',
    body: 'Gentle, unhurried dental care, from routine cleanings to implants and orthodontics.',
    bg: 'var(--paper)',
    ink: 'var(--ink)',
  },
  {
    id: 'jaw',
    hold: 0.7,
    eyebrow: 'Start here',
    title: 'Your tooth, explained',
    body: 'Most people have never seen what a dentist actually does. Scroll, and we will show you, layer by layer.',
    bg: 'var(--surface)',
    ink: 'var(--ink)',
  },
  {
    id: 'section',
    hold: 0.8,
    eyebrow: 'What is inside',
    title: 'One tooth, four layers',
    body: 'A tooth is not a solid lump of bone. It is four distinct tissues, each doing a different job, and almost everything that goes wrong goes wrong in one of them.',
    bg: 'var(--surface-sunk)',
    ink: 'var(--ink)',
  },
  {
    id: 'enamel',
    hold: 0.6,
    eyebrow: 'The outer shell',
    title: 'Enamel',
    body: 'The hardest tissue in your body, and the only one that cannot rebuild itself once it is truly gone. It has no nerves, which is why damage here is painless until it reaches what is underneath.',
    bg: '#2A2620',
    ink: '#F2ECE2',
    dark: true,
  },
  {
    id: 'dentin',
    hold: 0.6,
    eyebrow: 'Beneath the surface',
    title: 'Dentin',
    body: 'Softer, and threaded with microscopic tubules running toward the nerve. This is why cold water hurts once it is exposed, and why decay moves so much faster once it gets this far.',
    bg: '#241F1A',
    ink: '#F2ECE2',
    dark: true,
  },
  {
    id: 'pulp',
    hold: 0.6,
    eyebrow: 'The living core',
    title: 'Pulp',
    body: 'Nerves and blood vessels, sealed inside a rigid chamber that cannot swell. That single fact is why toothache is the particular kind of pain it is, and why it does not settle on its own.',
    bg: '#1C1815',
    ink: '#F2ECE2',
    dark: true,
  },
  {
    id: 'root',
    hold: 0.6,
    eyebrow: 'The anchor',
    title: 'Root',
    body: 'Set into the jaw and held by a ligament thinner than paper. The bone around it exists only because the root is there, which is why losing a tooth changes the jaw beneath it.',
    bg: '#22201C',
    ink: '#F2ECE2',
    dark: true,
  },

  // ---- Act two: treatment ----------------------------------------------
  {
    id: 'whitening',
    hold: 0.9,
    eyebrow: 'Treatment',
    title: 'Whitening',
    body: 'Years of tea, coffee and tobacco sit in the enamel, not under it. Bleaching lifts the stain out of that layer without touching the tooth beneath.',
    readout: { label: 'Whitening', value: servicePrice('teeth-whitening') },
    bg: 'var(--surface)',
    ink: 'var(--ink)',
  },
  {
    id: 'cleaning',
    hold: 0.9,
    eyebrow: 'Treatment',
    title: 'Checkups and cleaning',
    body: 'Decay is painless until it reaches the nerve. A checkup finds it while the answer is still a small filling, and a scale removes what a brush has stopped being able to reach.',
    readout: { label: 'Checkup & clean', value: servicePrice('teeth-cleaning') },
    bg: 'var(--surface-sunk)',
    ink: 'var(--ink)',
  },
  {
    id: 'rootcanal',
    hold: 0.9,
    eyebrow: 'Treatment',
    title: 'Root canal',
    body: 'The infected pulp comes out, the canals are cleaned and sealed, and the tooth stays in your jaw. The pain people associate with this is the pain it removes.',
    readout: { label: 'Pain-free treatment', value: servicePrice('pain-free-treatment') },
    bg: 'var(--surface)',
    ink: 'var(--ink)',
  },
  {
    id: 'implant',
    hold: 0.9,
    eyebrow: 'Treatment',
    title: 'Dental implant',
    body: 'A titanium root placed into the bone, with a crown on top. It stands on its own, so the healthy teeth either side are never cut down to carry it.',
    readout: { label: 'Dental implant', value: servicePrice('dental-implants') },
    bg: 'var(--surface-sunk)',
    ink: 'var(--ink)',
  },
  {
    id: 'braces',
    hold: 0.9,
    eyebrow: 'Treatment',
    title: 'Braces and aligners',
    body: 'Crowded teeth trap what a brush cannot reach. Straightening them is not only cosmetic, it is the cheapest long-term way to keep the layers above intact.',
    readout: { label: 'Orthodontics', value: servicePrice('orthodontics') },
    bg: 'var(--surface)',
    ink: 'var(--ink)',
  },
  {
    id: 'emergency',
    hold: 0.9,
    eyebrow: 'When it cannot wait',
    title: 'Emergency care',
    body: 'A crack or a sudden ache does not keep office hours. Call any time and we will see you, or talk you through what to do until we can.',
    readout: { label: 'Emergency', value: servicePrice('emergency-care') },
    bg: '#241C1A',
    ink: '#F2ECE2',
    dark: true,
  },
  {
    id: 'book',
    kind: 'cta',
    hold: 1.2,
    eyebrow: 'Put back together',
    title: 'Book a visit',
    body: 'Ten minutes in the chair is usually all it takes to know where you stand. No obligation, no lecture.',
    bg: 'var(--paper)',
    ink: 'var(--ink)',
  },
]

/** Total scroll weight, in beat-widths. Drives the section's height. */
export const TOTAL_HOLD = AUTHORED.reduce((n, b) => n + (b.hold ?? 1), 0)

/**
 * The beats, each with the scroll position it starts at.
 *
 * `at` is derived from the running total of `hold` rather than typed by hand.
 * Hand-typed values could not survive a restructure this size, and they had
 * already caused a real bug: a beat authored at `at: 1.0` owns a zero-width
 * range and flashes past in a single frame, which is what once happened to the
 * closing call to action. Deriving them makes that unrepresentable, because
 * the last beat necessarily starts before 1 and runs to the end.
 */
export const BEATS: PlacedBeat[] = (() => {
  let run = 0
  return AUTHORED.map((b) => {
    const at = run / TOTAL_HOLD
    run += b.hold ?? 1
    return { ...b, at, side: b.side ?? 'left' }
  })
})()

/** The beat that owns a given scroll progress. */
export function resolveBeat(p: number): PlacedBeat {
  let current = BEATS[0]
  for (const b of BEATS) if (p >= b.at - 0.001) current = b
  return current
}

/** Index of the beat that owns a given progress. */
export function resolveBeatIndex(p: number): number {
  let idx = 0
  BEATS.forEach((b, i) => {
    if (p >= b.at - 0.001) idx = i
  })
  return idx
}
