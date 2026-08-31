import layers from '@/public/images/sequence/layers.json'

/**
 * What the stage shows for each beat.
 *
 * Lives in its own module rather than inside ImageStage for one reason: beat
 * ids and scene keys have to agree, and when this map sat inside a 'use client'
 * component nothing could check that. A typo gave you a blank stage with no
 * error and no failing test. Here it is plain data, so a unit test asserts
 * every beat resolves to a scene and every layered scene names a focus.
 */

export type LayerName = 'enamel' | 'dentin' | 'pulp' | 'root'

export interface Scene {
  /** Full-frame image, for beats that are not the layered tooth. */
  image?: string
  /** Show the four cut layers instead. */
  layered?: boolean
  /** How far the layers separate. 0 = nested, 1 = the source arrangement. */
  spread?: number
  /** Which layer is emphasised and zoomed to. */
  focus?: LayerName
  /** Scale applied to the whole scene, for the zoom journey. */
  scale: number
  alt: string
}

const SEQ = '/images/sequence'

export const SCENES: Record<string, Scene> = {
  // ---- Act one: anatomy -------------------------------------------------
  // A zoom journey. Skull, to jaw, to one tooth opened up, and only then
  // does the tooth come apart. Scale tells that story; rotation would not.
  hero: {
    image: `${SEQ}/skull.webp`,
    scale: 1,
    alt: 'Human skull showing the teeth',
  },
  jaw: {
    image: `${SEQ}/jaw.webp`,
    scale: 1.2,
    alt: 'Lower jaw with a full arch of teeth',
  },
  /*
    The bridge into the exploded view.

    A cross-section rather than the whole tooth from outside, because this
    beat's job is to name the four layers, and a cross-section shows all four
    at once. The explosion that follows then pulls apart exactly what the
    reader was just looking at.

    This is a crossfade, not a morph: the layers were cut from a separate
    exploded render, so they cannot reassemble into this tooth.
  */
  section: {
    image: `${SEQ}/crosssection.webp`,
    scale: 1.05,
    alt: 'Cross-section of a molar showing enamel, dentin, pulp and roots',
  },

  /*
    The four layer beats.

    `spread` climbs across them, so the stack opens continuously as you scroll
    rather than snapping apart at one beat. Each beat also focuses its own
    layer, which shifts the frame to centre that part and zooms in. Previously
    only pulp and root did this and the other two showed treatment photos, so
    the sequence promised "layer by layer" and then delivered two of four.
  */
  enamel: {
    layered: true,
    spread: 0.25,
    focus: 'enamel',
    scale: 1,
    alt: 'Tooth layers separating, the enamel cap highlighted',
  },
  dentin: {
    layered: true,
    spread: 0.5,
    focus: 'dentin',
    scale: 1.05,
    alt: 'Tooth layers separating, the dentin core highlighted',
  },
  pulp: {
    layered: true,
    spread: 0.78,
    focus: 'pulp',
    scale: 1.1,
    alt: 'Tooth layers separated, the pulp and nerve highlighted',
  },
  root: {
    layered: true,
    spread: 1,
    focus: 'root',
    scale: 1.05,
    alt: 'Tooth layers fully separated, the roots highlighted',
  },

  // ---- Act two: treatment ----------------------------------------------
  whitening: {
    image: `${SEQ}/whitening.webp`,
    scale: 1,
    alt: 'A tooth stained on one side and whitened on the other',
  },
  cleaning: {
    image: `${SEQ}/decay.webp`,
    scale: 1.05,
    alt: 'Cross-section of a tooth with decay reaching the dentin',
  },
  rootcanal: {
    image: `${SEQ}/rootcanal.webp`,
    scale: 1.05,
    alt: 'Cross-section of a root-treated tooth, canals filled and the access cavity sealed',
  },
  implant: {
    image: `${SEQ}/implant.webp`,
    scale: 1,
    alt: 'A titanium implant in cross-sectioned jaw bone beside a natural tooth',
  },
  braces: {
    image: `${SEQ}/braces.webp`,
    scale: 1,
    alt: 'Lower arch fitted with orthodontic braces',
  },
  emergency: {
    image: `${SEQ}/cracked.webp`,
    scale: 1,
    alt: 'A molar with a visible crack running down the crown',
  },
  book: {
    image: `${SEQ}/final.webp`,
    scale: 1,
    alt: 'A whole, intact molar tooth',
  },
}

/** Beats whose scene is a full-frame image, in render order. */
export const FULL_FRAME = Object.entries(SCENES)
  .filter(([, s]) => Boolean(s.image))
  .map(([id]) => id)

/** Aspect ratio of the source frame, so the layers keep their arrangement. */
export const FRAME_RATIO = layers.frame.width / layers.frame.height

export const LAYERS = layers.layers

/**
 * Vertical position of a layer at a given spread, as a fraction of the frame.
 *
 * At spread 0 the parts nest toward the centre; at 1 they sit where the source
 * image put them. Exported so the focus maths in ImageStage and the placement
 * maths use one function and cannot drift apart.
 */
export function placeTop(layer: { top: number; height: number }, spread: number) {
  const fromMiddle = layer.top + layer.height / 2 - 0.5
  return 0.5 + fromMiddle * (0.35 + spread * 0.65) - layer.height / 2
}
