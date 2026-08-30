/**
 * The scroll sequence.
 *
 * Modelled on oryzo.ai: one continuous 3D scene with the camera flying
 * through it, each beat pairing a camera position with a copy block and a
 * technical readout. The difference is that every beat here is an actual
 * anatomical layer of the same tooth, so the sequence explains a real thing
 * rather than decorating a fake one.
 *
 * `at` is normalised scroll progress (0-1) for the pinned section.
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
  /** How far the tooth's parts separate, 0 = whole, 1 = fully exploded. */
  explode: number
  /** Which part glows to draw the eye. */
  focus?: 'enamel' | 'dentin' | 'pulp' | 'root' | null
}

export const BEATS: Beat[] = [
  {
    id: 'intro',
    at: 0,
    eyebrow: 'Sawai Madhopur, Rajasthan',
    title: 'Your tooth, explained',
    body: 'Most people have never seen what a dentist actually does. Scroll, and we will show you — layer by layer.',
    camera: { x: 0, y: 0, z: 7.2 },
    explode: 0,
    focus: null,
  },
  {
    id: 'enamel',
    at: 0.2,
    eyebrow: 'The outer shell',
    title: 'Enamel',
    body: 'The hardest tissue in your body — and the part that stains. Professional whitening lifts years of tea and tobacco without touching what is underneath.',
    readout: { label: 'Whitening', value: '₹3,500 / session' },
    camera: { x: 1.5, y: 0.9, z: 7.6 },
    explode: 0.3,
    focus: 'enamel',
  },
  {
    id: 'dentin',
    at: 0.4,
    eyebrow: 'Beneath the surface',
    title: 'Dentin',
    body: 'Softer, and full of microscopic tubules. Once decay reaches here it moves fast — which is why a cleaning and a filling now costs a fraction of what waiting costs.',
    readout: { label: 'Checkup & clean', value: '₹800 / visit' },
    camera: { x: -1.7, y: 0.2, z: 8.4 },
    explode: 0.55,
    focus: 'dentin',
  },
  {
    id: 'pulp',
    at: 0.6,
    eyebrow: 'The living core',
    title: 'Pulp',
    body: 'Nerves and blood vessels. This is where toothache comes from, and where a root canal goes. Modern anaesthesia means you feel pressure, not pain.',
    readout: { label: 'Pain-free treatment', value: 'Same day' },
    camera: { x: 1.2, y: -0.3, z: 9.0 },
    explode: 0.78,
    focus: 'pulp',
  },
  {
    id: 'root',
    at: 0.8,
    eyebrow: 'The anchor',
    title: 'Root',
    body: 'Set into the jaw. When a tooth cannot be saved, an implant replaces the root itself — so the replacement bites, and lasts, like the original.',
    readout: { label: 'Dental implant', value: '₹25,000 / tooth' },
    camera: { x: -1.3, y: -1.1, z: 9.4 },
    explode: 1,
    focus: 'root',
  },
  {
    id: 'whole',
    at: 1,
    eyebrow: 'Put back together',
    title: 'Book a visit',
    body: 'Ten minutes in the chair is usually all it takes to know where you stand. No obligation, no lecture.',
    camera: { x: 0, y: 0, z: 6.8 },
    explode: 0,
    focus: null,
  },
]
