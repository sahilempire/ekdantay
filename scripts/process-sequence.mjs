/**
 * Turn the generated source images into the scroll sequence's assets.
 *
 *   in:  public/images/sequence/src-*.png   (black background, generated)
 *   out: public/images/sequence/*.webp      (transparent, trimmed, optimised)
 *
 * Two jobs:
 *
 * 1. Key out the black background to alpha. The images were generated on flat
 *    black precisely so this is a threshold rather than a matting problem -
 *    any glow or gradient behind the subject would bleed grey fringing here.
 *
 * 2. Cut the exploded tooth into its separate parts. The parts are stacked
 *    vertically with clear black gaps between them, so scanning for rows that
 *    are entirely transparent finds the seams without any hand-authored
 *    coordinates. That is what lets the sequence show and move each layer
 *    independently.
 */

import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import { resolve, basename } from 'node:path'

const DIR = resolve('public/images/sequence')

/** Below this luminance a pixel is background, not subject. */
const BLACK_CUTOFF = 34
/** A row with fewer opaque pixels than this counts as empty. */
const EMPTY_ROW_PIXELS = 6

/**
 * Replace near-black with transparency.
 *
 * Alpha ramps across a small range above the cutoff rather than switching
 * hard, which keeps edges soft instead of aliased.
 */
async function keyOut(file) {
  const img = sharp(file).ensureAlpha()
  const { width, height } = await img.metadata()
  const raw = await img.raw().toBuffer()

  for (let i = 0; i < raw.length; i += 4) {
    const luma = 0.299 * raw[i] + 0.587 * raw[i + 1] + 0.114 * raw[i + 2]
    if (luma <= BLACK_CUTOFF) {
      raw[i + 3] = 0
    } else if (luma < BLACK_CUTOFF * 2.4) {
      // Soft shoulder so the silhouette does not stair-step.
      raw[i + 3] = Math.round(((luma - BLACK_CUTOFF) / (BLACK_CUTOFF * 1.4)) * 255)
    }
  }

  return { raw, width, height }
}

/**
 * Label connected components of opaque pixels, returning a bounding box each.
 *
 * This replaces scanning for empty rows, which cannot separate the pulp from
 * the roots: the nerve fibres trail down between the roots so no row is ever
 * empty, and the pulp itself forks into two prongs so counting runs per row
 * fires in the wrong place. Connectivity is the property that actually
 * distinguishes them - the pulp's prongs are joined at the top, the roots are
 * separate objects.
 *
 * Iterative flood fill; the images are ~1.5 megapixels so recursion would
 * overflow the stack.
 */
function components(raw, width, height, minPixels) {
  const seen = new Uint8Array(width * height)
  const labelled = new Int32Array(width * height).fill(0)
  const out = []
  const stack = new Int32Array(width * height)

  const opaque = (i) => raw[i * 4 + 3] > 24

  for (let start = 0; start < width * height; start++) {
    if (seen[start] || !opaque(start)) continue

    let top = 0
    stack[top++] = start
    seen[start] = 1

    let minX = width, maxX = -1, minY = height, maxY = -1, count = 0

    while (top > 0) {
      const i = stack[--top]
      labelled[i] = -1
      const x = i % width
      const y = (i / width) | 0
      count++
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y

      // 8-connected, so a one-pixel diagonal thread still holds a part together.
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const ni = ny * width + nx
          if (seen[ni] || !opaque(ni)) continue
          seen[ni] = 1
          stack[top++] = ni
        }
      }
    }

    if (count >= minPixels) {
      // Keep the label so each part can be masked to its OWN pixels. Bounding
      // boxes overlap - the pulp's nerve fibres hang past the top of the roots -
      // so cropping by box alone leaves one part's geometry inside another's
      // image.
      out.push({ minX, maxX, minY, maxY, count, label: out.length + 1 })
      for (let k = 0; k < labelled.length; k++) if (labelled[k] === -1) labelled[k] = out.length
    }
  }

  return { parts: out.sort((a, b) => a.minY - b.minY), labelled }
}

/**
 * Group components that share a vertical range into one layer.
 *
 * The two roots are separate objects at the same height and belong together.
 */
function groupByRow(comps, tolerance) {
  const groups = []
  for (const c of comps) {
    const near = groups.find(
      (g) => Math.abs((c.minY + c.maxY) / 2 - (g.minY + g.maxY) / 2) < tolerance,
    )
    if (near) {
      near.labels.push(c.label)
      near.minX = Math.min(near.minX, c.minX)
      near.maxX = Math.max(near.maxX, c.maxX)
      near.minY = Math.min(near.minY, c.minY)
      near.maxY = Math.max(near.maxY, c.maxY)
    } else {
      groups.push({ ...c, labels: [c.label] })
    }
  }
  return groups.sort((a, b) => a.minY - b.minY)
}

/** Rows that contain almost no opaque pixels — the gaps between parts. */
function findBands(raw, width, height) {
  const occupied = new Array(height).fill(0)
  for (let y = 0; y < height; y++) {
    let n = 0
    for (let x = 0; x < width; x++) {
      if (raw[(y * width + x) * 4 + 3] > 24) n++
    }
    occupied[y] = n
  }

  const bands = []
  let start = null
  for (let y = 0; y < height; y++) {
    const filled = occupied[y] >= EMPTY_ROW_PIXELS
    if (filled && start === null) start = y
    if (!filled && start !== null) {
      if (y - start > height * 0.02) bands.push([start, y])
      start = null
    }
  }
  if (start !== null) bands.push([start, height])
  return bands
}

async function writeWebp(raw, width, height, region, out) {
  const { left, top, w, h } = region
  await sharp(raw, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: w, height: h })
    .webp({ quality: 88, alphaQuality: 90, effort: 6 })
    .toFile(out)
  return out
}

/** Tight bounding box of everything opaque, with a small margin. */
function contentBox(raw, width, height, y0 = 0, y1 = height) {
  let minX = width, maxX = -1, minY = y1, maxY = -1
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < width; x++) {
      if (raw[(y * width + x) * 4 + 3] > 24) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return null
  const pad = 6
  const left = Math.max(0, minX - pad)
  const top = Math.max(0, minY - pad)
  return {
    left,
    top,
    w: Math.min(width - left, maxX - minX + pad * 2),
    h: Math.min(height - top, maxY - minY + pad * 2),
  }
}

// ---------------------------------------------------------------------------

const files = (await readdir(DIR)).filter((f) => f.startsWith('src-') && f.endsWith('.png'))
if (!files.length) {
  console.error(`No src-*.png in ${DIR}`)
  process.exit(1)
}

console.log('Keying out black and trimming...\n')

for (const file of files.sort()) {
  const name = basename(file, '.png').replace(/^src-/, '')
  const { raw, width, height } = await keyOut(resolve(DIR, file))

  if (name === 'exploded') {
    const minPixels = Math.round(width * height * 0.0009)
    const { parts: comps, labelled } = components(raw, width, height, minPixels)
    // Roots sit side by side; anything within this vertical distance is one layer.
    const groups = groupByRow(comps, height * 0.12)

    console.log(`  exploded: ${comps.length} components -> ${groups.length} layers`)

    const LAYERS = ['enamel', 'dentin', 'pulp', 'root']
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i]
      const pad = 6
      const left = Math.max(0, g.minX - pad)
      const top = Math.max(0, g.minY - pad)
      const box = {
        left,
        top,
        w: Math.min(width - left, g.maxX - g.minX + pad * 2),
        h: Math.min(height - top, g.maxY - g.minY + pad * 2),
      }
      // Mask to this group's own components before cropping.
      const own = Buffer.from(raw)
      const keep = new Set(g.labels)
      for (let k = 0; k < width * height; k++) {
        if (own[k * 4 + 3] > 0 && !keep.has(labelled[k])) own[k * 4 + 3] = 0
      }

      const layer = LAYERS[i] ?? `part-${i + 1}`
      await writeWebp(own, width, height, box, resolve(DIR, `layer-${layer}.webp`))
      console.log(`    ${layer.padEnd(8)} y ${String(g.minY).padStart(4)}-${String(g.maxY).padStart(4)}  ${box.w}x${box.h}`)
    }

    const full = contentBox(raw, width, height)
    if (full) await writeWebp(raw, width, height, full, resolve(DIR, 'exploded.webp'))
  } else {
    const box = contentBox(raw, width, height)
    if (!box) { console.log(`  ${name}: empty after key-out, skipped`); continue }
    await writeWebp(raw, width, height, box, resolve(DIR, `${name}.webp`))
    console.log(`  ${name.padEnd(12)} ${box.w}x${box.h}`)
  }
}

console.log('\nOutput:')
const out = (await readdir(DIR)).filter((f) => f.endsWith('.webp')).sort()
let total = 0
const { statSync } = await import('node:fs')
for (const f of out) {
  const kb = statSync(resolve(DIR, f)).size / 1024
  total += kb
  console.log(`  ${f.padEnd(26)} ${kb.toFixed(0).padStart(5)} KB`)
}
console.log(`  ${''.padEnd(26)} ${'-----'}`)
console.log(`  ${'total'.padEnd(26)} ${total.toFixed(0).padStart(5)} KB`)
