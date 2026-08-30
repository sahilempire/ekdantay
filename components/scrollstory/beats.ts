/**
 * The scroll sequence — now the whole top of the page, not one section.
 *
 * Modelled on oryzo.ai: a single continuous 3D scene the camera flies through,
 * each beat pairing a camera position with a copy block, a technical readout,
 * and a ground colour. The difference is that every beat here is an actual
 * anatomical layer of the same tooth, so the sequence explains a real thing
 * rather than decorating a fictional one.
 *
 * `at` is normalised scroll progress (0-1) across the pinned section.
 */
export interface Beat {
  id: string
  at: number
  eyebrow: string
  title: string
  body: string
  /** Small technical card, the way Oryzo shows "FRICTION COEFFICIENT: 0.80". */
  readout?: { label: string; value: string }
  /** Camera target for this beat. */
  camera: { x: number; y: number; z: number }
  /** How far the tooth's parts separate. 0 = whole, 1 = fully exploded. */
  explode: number
  /** Which layer glows to draw the eye. */
  focus?: 'enamel' | 'dentin' | 'pulp' | 'root' | null
  /**
   * Ground colour for this beat, as a CSS value. The page darkens through the
   * middle of the sequence and resolves back to paper — the shifting ground is
   * most of why a scroll sequence reads as cinematic rather than as a long page.
   */
  bg: string
  /** Ink colour that stays legible on `bg`. */
  ink: string
  /** True when `bg` is dark, so chrome above the stage can invert. */
  dark?: boolean
  /** Which side the copy sits on, so the composition is not static. */
  side?: 'left' | 'right'
  /** Marks the opening beat, which renders the hero rather than body copy. */
  kind?: 'hero' | 'layer' | 'cta'
}

export const BEATS: Beat[] = [
  {
    id: 'hero',
    kind: 'hero',
    at: 0,
    eyebrow: 'Sawai Madhopur, Rajasthan',
    title: 'Modern Dentistry in a Calm and Relaxed Environment',
    body: 'Gentle, unhurried dental care — from routine cleanings to implants and orthodontics.',
    camera: { x: 0, y: 0, z: 7.6 },
    explode: 0,
    focus: null,
    bg: 'var(--paper)',
    ink: 'var(--ink)',
    side: 'left',
  },
  {
    id: 'intro',
    at: 0.14,
    eyebrow: 'Start here',
    title: 'Your tooth, explained',
    body: 'Most people have never seen what a dentist actually does. Scroll, and we will show you — layer by layer.',
    camera: { x: -0.9, y: 0.2, z: 5.6 },
    explode: 0,
    focus: null,
    bg: 'var(--surface)',
    ink: 'var(--ink)',
    side: 'right',
  },
  {
    id: 'enamel',
    at: 0.28,
    eyebrow: 'The outer shell',
    title: 'Enamel',
    body: 'The hardest tissue in your body — and the part that stains. Professional whitening lifts years of tea and tobacco without touching what is underneath.',
    readout: { label: 'Whitening', value: '₹3,500 / session' },
    camera: { x: 1.5, y: 0.9, z: 7.4 },
    explode: 0.3,
    focus: 'enamel',
    bg: 'var(--surface-sunk)',
    ink: 'var(--ink)',
    side: 'left',
  },
  {
    id: 'dentin',
    at: 0.42,
    eyebrow: 'Beneath the surface',
    title: 'Dentin',
    body: 'Softer, and full of microscopic tubules. Once decay reaches here it moves fast — which is why a cleaning and a filling now costs a fraction of what waiting costs.',
    readout: { label: 'Checkup & clean', value: '₹800 / visit' },
    camera: { x: -1.7, y: 0.2, z: 8.2 },
    explode: 0.55,
    focus: 'dentin',
    bg: '#2A2620',
    ink: '#F2ECE2',
    dark: true,
    side: 'right',
  },
  {
    id: 'pulp',
    at: 0.56,
    eyebrow: 'The living core',
    title: 'Pulp',
    body: 'Nerves and blood vessels. This is where toothache comes from, and where a root canal goes. Modern anaesthesia means you feel pressure, not pain.',
    readout: { label: 'Pain-free treatment', value: 'Same day' },
    camera: { x: 1.2, y: -0.3, z: 8.8 },
    explode: 0.78,
    focus: 'pulp',
    bg: '#1C1815',
    ink: '#F2ECE2',
    dark: true,
    side: 'left',
  },
  {
    id: 'root',
    at: 0.7,
    eyebrow: 'The anchor',
    title: 'Root',
    body: 'Set into the jaw. When a tooth cannot be saved, an implant replaces the root itself — so the replacement bites, and lasts, like the original.',
    readout: { label: 'Dental implant', value: '₹25,000 / tooth' },
    camera: { x: -1.3, y: -1.1, z: 9.2 },
    explode: 1,
    focus: 'root',
    bg: '#22201C',
    ink: '#F2ECE2',
    dark: true,
    side: 'right',
  },
  {
    id: 'straighten',
    at: 0.84,
    eyebrow: 'Position matters',
    title: 'Alignment',
    body: 'Crowded teeth trap what a brush cannot reach. Straightening is not only cosmetic — it is the cheapest long-term way to keep the layers above intact.',
    readout: { label: 'Orthodontics', value: '₹45,000 / treatment' },
    camera: { x: 0.6, y: 0.6, z: 7.0 },
    explode: 0.35,
    focus: 'enamel',
    bg: 'var(--surface)',
    ink: 'var(--ink)',
    side: 'left',
  },
  {
    id: 'whole',
    kind: 'cta',
    at: 1,
    eyebrow: 'Put back together',
    title: 'Book a visit',
    body: 'Ten minutes in the chair is usually all it takes to know where you stand. No obligation, no lecture.',
    camera: { x: 0, y: 0, z: 6.6 },
    explode: 0,
    focus: null,
    bg: 'var(--paper)',
    ink: 'var(--ink)',
    side: 'left',
  },
]

/** The beat that owns a given scroll progress. */
export function resolveBeat(p: number): Beat {
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
