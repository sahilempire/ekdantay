import { describe, it, expect } from 'vitest'
import { BEATS, TOTAL_HOLD, resolveBeat, resolveBeatIndex } from '@/components/scrollstory/beats'
import { SCENES, FULL_FRAME, LAYERS } from '@/components/scrollstory/scenes'

describe('beats', () => {
  it('runs two acts: anatomy with no prices, then treatment with them', () => {
    const anatomy = BEATS.slice(0, BEATS.findIndex((b) => b.id === 'whitening'))
    const treatment = BEATS.slice(
      BEATS.findIndex((b) => b.id === 'whitening'),
      BEATS.length - 1,
    )

    // Act one sells nothing. Interleaving the two is what previously put a
    // whitening price on the enamel beat and a treatment photo where the
    // enamel layer should have been.
    expect(anatomy.every((b) => !b.readout)).toBe(true)
    expect(treatment.every((b) => Boolean(b.readout))).toBe(true)
  })

  it('shows all four layers as layers, not just two of them', () => {
    for (const id of ['enamel', 'dentin', 'pulp', 'root']) {
      expect(SCENES[id].layered, `${id} is not a layered scene`).toBe(true)
      expect(SCENES[id].focus).toBe(id)
    }
  })

  it('opens the tooth progressively across the four layer beats', () => {
    const spreads = ['enamel', 'dentin', 'pulp', 'root'].map((id) => SCENES[id].spread ?? 0)
    for (let i = 1; i < spreads.length; i++) {
      expect(spreads[i]).toBeGreaterThan(spreads[i - 1])
    }
    expect(spreads.at(-1)).toBe(1)
  })

  it('places every beat in order and never at the very end', () => {
    // A beat authored at at:1.0 owns a zero-width range and flashes past in a
    // single frame. That happened once to the closing call to action, which is
    // why `at` is now derived rather than typed.
    for (let i = 1; i < BEATS.length; i++) {
      expect(BEATS[i].at).toBeGreaterThan(BEATS[i - 1].at)
    }
    expect(BEATS[0].at).toBe(0)
    expect(BEATS.at(-1)!.at).toBeLessThan(1)
  })

  it('gives every beat a scroll range wide enough to read', () => {
    const ends = BEATS.map((b, i) => (BEATS[i + 1]?.at ?? 1) - b.at)
    for (const [i, width] of ends.entries()) {
      expect(width, `${BEATS[i].id} is too narrow`).toBeGreaterThan(0.03)
    }
  })

  it('resolves progress to the right beat at both ends', () => {
    expect(resolveBeat(0).id).toBe('hero')
    expect(resolveBeat(1).id).toBe(BEATS.at(-1)!.id)
    expect(resolveBeatIndex(0)).toBe(0)
    expect(resolveBeatIndex(1)).toBe(BEATS.length - 1)
  })

  it('resolves every beat from a point inside its own range', () => {
    BEATS.forEach((b, i) => {
      const next = BEATS[i + 1]?.at ?? 1
      expect(resolveBeat((b.at + next) / 2).id).toBe(b.id)
    })
  })

  it('holds the sequence near its previous length despite five more beats', () => {
    // Nine beats at one screen each was 900vh. Fourteen beats counted the same
    // way would be 1400vh for no extra content.
    expect(BEATS).toHaveLength(14)
    expect(TOTAL_HOLD * 100).toBeGreaterThan(1000)
    expect(TOTAL_HOLD * 100).toBeLessThan(1250)
  })

  it('gives every beat a unique id, title and readout', () => {
    expect(new Set(BEATS.map((b) => b.id)).size).toBe(BEATS.length)
    expect(new Set(BEATS.map((b) => b.title)).size).toBe(BEATS.length)
    const readouts = BEATS.map((b) => b.readout?.value).filter(Boolean)
    expect(new Set(readouts).size).toBe(readouts.length)
  })

  it('keeps the copy on one side throughout', () => {
    // Sides alternated unpredictably before, which reads as drift rather than
    // rhythm. Copy left, subject right, every beat.
    expect(BEATS.every((b) => b.side === 'left')).toBe(true)
  })

  it('opens and closes on a light ground with a dark passage inside the tooth', () => {
    expect(BEATS[0].dark).toBeFalsy()
    expect(BEATS.at(-1)!.dark).toBeFalsy()
    for (const id of ['enamel', 'dentin', 'pulp', 'root']) {
      expect(BEATS.find((b) => b.id === id)!.dark).toBe(true)
    }
  })

  it('uses no em dashes, as the client asked', () => {
    expect(JSON.stringify(BEATS)).not.toMatch(/[—–]/)
  })
})

describe('scenes', () => {
  it('gives every beat a scene', () => {
    // The failure this guards against is silent: a beat id with no scene
    // renders a blank stage with no error anywhere.
    for (const b of BEATS) {
      expect(SCENES[b.id], `no scene for beat "${b.id}"`).toBeDefined()
    }
  })

  it('defines no scene that no beat uses', () => {
    const ids = new Set(BEATS.map((b) => b.id))
    for (const key of Object.keys(SCENES)) {
      expect(ids.has(key), `scene "${key}" is orphaned`).toBe(true)
    }
  })

  it('makes every scene either a full-frame image or a layered view', () => {
    for (const [id, s] of Object.entries(SCENES)) {
      expect(Boolean(s.image) !== Boolean(s.layered), `${id} is neither or both`).toBe(true)
      if (s.layered) expect(s.focus, `${id} is layered with no focus`).toBeDefined()
      if (s.image) expect(s.image).toMatch(/^\/images\/sequence\/.+\.webp$/)
      expect(s.alt.length).toBeGreaterThan(10)
      expect(s.scale).toBeGreaterThan(0)
    }
  })

  it('lists exactly the image scenes as full frame', () => {
    expect(FULL_FRAME.every((id) => Boolean(SCENES[id].image))).toBe(true)
    expect(FULL_FRAME).toHaveLength(Object.values(SCENES).filter((s) => s.image).length)
  })

  it('focuses only layers the manifest actually contains', () => {
    const names = new Set(LAYERS.map((l) => l.name))
    expect(names.size).toBe(4)
    for (const s of Object.values(SCENES)) {
      if (s.focus) expect(names.has(s.focus)).toBe(true)
    }
  })

  it('gives every treatment beat its own image, borrowing none', () => {
    const images = Object.values(SCENES).map((s) => s.image).filter(Boolean)
    expect(new Set(images).size).toBe(images.length)
  })
})
