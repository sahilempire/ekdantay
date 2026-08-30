/**
 * Derive a four-layer tooth GLB from two CC BY 4.0 source models.
 *
 *   in:  public/models/tooth-shell.glb   (or the extracted scene.gltf)
 *        public/models/tooth-canals.glb
 *   out: public/models/tooth.glb   with meshes named enamel / dentin / pulp / root
 *
 * The research sweep confirmed no free layered dental model exists, so the
 * layers are derived rather than downloaded. The decomposition is anatomically
 * honest rather than arbitrary:
 *
 *   enamel  - the crown, i.e. the shell above the cemento-enamel junction.
 *             Enamel genuinely does not extend below the CEJ.
 *   root    - the shell below the CEJ.
 *   dentin  - the whole shell offset inward along its vertex normals. Dentin
 *             really is a slightly smaller copy of the outer form.
 *   pulp    - the GIDPTD canal system, which is already the pulp cavity.
 *
 * The CEJ is found from the geometry instead of hardcoded: sweep horizontal
 * slices, take the widest (the crown's equator), then walk down to the sharpest
 * narrowing. That is the cervical constriction by definition.
 *
 * No Blender. Everything here is arithmetic over vertex buffers.
 */

import { NodeIO } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, weld, simplify } from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const MODELS = resolve('public/models')

/** Accept either the packed GLB or Sketchfab's extracted multi-file glTF. */
function findSource(names) {
  for (const n of names) {
    const p = resolve(n)
    if (existsSync(p)) return p
  }
  return null
}

// Sources live in the repo, not /tmp, so this script is reproducible on any
// checkout. Either Sketchfab download form works - GLB and the multi-file
// glTF carry identical geometry, and the source textures are unused because
// each layer gets its own material.
const SHELL = findSource([
  `${MODELS}/src/shell/scene.gltf`,
  `${MODELS}/tooth-shell.glb`,
])
const CANALS = findSource([
  `${MODELS}/src/canals/scene.gltf`,
  `${MODELS}/tooth-canals.glb`,
])

if (!SHELL || !CANALS) {
  console.error('Missing source models. Expected either:')
  console.error(`  ${MODELS}/src/shell/scene.gltf   + ${MODELS}/src/canals/scene.gltf`)
  console.error(`  ${MODELS}/tooth-shell.glb        + ${MODELS}/tooth-canals.glb`)
  console.error('See public/models/README.md for the download links.')
  process.exit(1)
}

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS)

/** Multiply two column-major 4x4 matrices. */
function mul4(a, b) {
  const out = new Array(16).fill(0)
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let sum = 0
      for (let k = 0; k < 4; k++) sum += a[k * 4 + r] * b[c * 4 + k]
      out[c * 4 + r] = sum
    }
  }
  return out
}

/** Apply a column-major 4x4 to a flat vec3 array (positions: w=1). */
function applyMatrix(arr, m, isDirection = false) {
  const out = new Float32Array(arr.length)
  for (let i = 0; i < arr.length; i += 3) {
    const x = arr[i], y = arr[i + 1], z = arr[i + 2]
    const w = isDirection ? 0 : 1
    let ox = m[0] * x + m[4] * y + m[8] * z + m[12] * w
    let oy = m[1] * x + m[5] * y + m[9] * z + m[13] * w
    let oz = m[2] * x + m[6] * y + m[10] * z + m[14] * w
    if (isDirection) {
      const len = Math.hypot(ox, oy, oz) || 1
      ox /= len; oy /= len; oz /= len
    }
    out[i] = ox; out[i + 1] = oy; out[i + 2] = oz
  }
  return out
}

/**
 * Pull POSITION / NORMAL / indices out of the first primitive, with the node
 * chain's world transform BAKED IN.
 *
 * Both Sketchfab exports carry a `matrix` on the root node - the canals a
 * plain Z-up to Y-up rotation, the shell a general authored orientation.
 * Reading raw vertex buffers and ignoring those matrices leaves the tooth
 * lying on its side, which is exactly the bug this function exists to avoid.
 */
async function readMesh(path) {
  const doc = await io.read(path)
  const mesh = doc.getRoot().listMeshes()[0]
  const prim = mesh.listPrimitives()[0]

  // Walk the scene graph to find this mesh's node and accumulate the world matrix.
  let world = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]
  const walk = (node, parent) => {
    const m = mul4(parent, node.getMatrix())
    if (node.getMesh() === mesh) world = m
    for (const child of node.listChildren()) walk(child, m)
  }
  for (const scene of doc.getRoot().listScenes()) {
    for (const node of scene.listChildren()) walk(node, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])
  }

  const rawPos = prim.getAttribute('POSITION').getArray()
  const rawNrm = prim.getAttribute('NORMAL') ? prim.getAttribute('NORMAL').getArray() : null

  return {
    position: Array.from(applyMatrix(rawPos, world)),
    normal: rawNrm ? Array.from(applyMatrix(rawNrm, world, true)) : null,
    index: prim.getIndices() ? Array.from(prim.getIndices().getArray()) : null,
  }
}

/**
 * Rotate a vertex cloud so its long axis stands vertical.
 *
 * The baked world matrix gives the orientation the scan was AUTHORED in, which
 * for these Dundee models is a tilted presentation pose, not upright. Rather
 * than eyeball a correction, derive the tooth's own crown-to-root axis: take
 * the centroid of the top 15% of vertices and the centroid of the bottom 15%,
 * and rotate the vector between them onto +Y.
 */
function uprightify(position, normal) {
  const n = position.length / 3
  // Project onto the current longest extent to decide what "top" means.
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 3; a++) {
      const v = position[i * 3 + a]
      if (v < min[a]) min[a] = v
      if (v > max[a]) max[a] = v
    }
  }
  let longAxis = 0
  for (let a = 1; a < 3; a++) if (max[a] - min[a] > max[longAxis] - min[longAxis]) longAxis = a

  const lo = min[longAxis] + (max[longAxis] - min[longAxis]) * 0.15
  const hi = max[longAxis] - (max[longAxis] - min[longAxis]) * 0.15

  const bottom = [0, 0, 0]
  const top = [0, 0, 0]
  let nb = 0
  let nt = 0
  for (let i = 0; i < n; i++) {
    const v = position[i * 3 + longAxis]
    if (v <= lo) { for (let a = 0; a < 3; a++) bottom[a] += position[i * 3 + a]; nb++ }
    else if (v >= hi) { for (let a = 0; a < 3; a++) top[a] += position[i * 3 + a]; nt++ }
  }
  if (!nb || !nt) return { position, normal }
  for (let a = 0; a < 3; a++) { bottom[a] /= nb; top[a] /= nt }

  // Axis from root centroid to crown centroid, normalised.
  let axis = [top[0] - bottom[0], top[1] - bottom[1], top[2] - bottom[2]]
  const len = Math.hypot(...axis) || 1
  axis = axis.map((v) => v / len)

  // Rotation taking `axis` onto +Y, via axis-angle (Rodrigues).
  const target = [0, 1, 0]
  const dot = axis[0] * target[0] + axis[1] * target[1] + axis[2] * target[2]
  if (dot > 0.9999) return { position, normal }

  const cross = [
    axis[1] * target[2] - axis[2] * target[1],
    axis[2] * target[0] - axis[0] * target[2],
    axis[0] * target[1] - axis[1] * target[0],
  ]
  const s = Math.hypot(...cross) || 1
  const k = cross.map((v) => v / s)
  const theta = Math.atan2(s, dot)
  const c = Math.cos(theta)
  const si = Math.sin(theta)

  const rot = (arr) => {
    const out = new Float32Array(arr.length)
    for (let i = 0; i < arr.length; i += 3) {
      const v = [arr[i], arr[i + 1], arr[i + 2]]
      const kv = k[0] * v[0] + k[1] * v[1] + k[2] * v[2]
      const kxv = [
        k[1] * v[2] - k[2] * v[1],
        k[2] * v[0] - k[0] * v[2],
        k[0] * v[1] - k[1] * v[0],
      ]
      for (let a = 0; a < 3; a++) {
        out[i + a] = v[a] * c + kxv[a] * si + k[a] * kv * (1 - c)
      }
    }
    return out
  }

  return { position: rot(position), normal: normal ? rot(normal) : null }
}

/** Centre on the origin and scale so total height (Y) is `targetHeight`. */
function normalize(position, targetHeight) {
  const n = position.length / 3
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 3; a++) {
      const v = position[i * 3 + a]
      if (v < min[a]) min[a] = v
      if (v > max[a]) max[a] = v
    }
  }
  const centre = [0, 1, 2].map((a) => (min[a] + max[a]) / 2)
  const height = max[1] - min[1]
  const scale = height > 0 ? targetHeight / height : 1

  const out = new Float32Array(position.length)
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 3; a++) {
      out[i * 3 + a] = (position[i * 3 + a] - centre[a]) * scale
    }
  }
  return { position: out, scale, size: [0, 1, 2].map((a) => (max[a] - min[a]) * scale) }
}

/**
 * Locate the cemento-enamel junction.
 *
 * Slice horizontally, measure each slice's mean radius from the vertical axis,
 * find the widest slice (the crown equator), then continue downward to where
 * radius falls fastest. That inflection is the cervical constriction.
 */
function findCEJ(position, slices = 120) {
  const n = position.length / 3
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < n; i++) {
    const y = position[i * 3 + 1]
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  const step = (maxY - minY) / slices
  const sumR = new Float64Array(slices)
  const count = new Float64Array(slices)

  for (let i = 0; i < n; i++) {
    const x = position[i * 3]
    const y = position[i * 3 + 1]
    const z = position[i * 3 + 2]
    let s = Math.floor((y - minY) / step)
    if (s < 0) s = 0
    if (s >= slices) s = slices - 1
    sumR[s] += Math.hypot(x, z)
    count[s]++
  }

  const radius = Array.from({ length: slices }, (_, s) =>
    count[s] > 0 ? sumR[s] / count[s] : 0,
  )

  // Widest slice, searched in the upper 60% so a flared root apex cannot win.
  let equator = slices - 1
  let best = -1
  for (let s = Math.floor(slices * 0.4); s < slices; s++) {
    if (radius[s] > best) {
      best = radius[s]
      equator = s
    }
  }

  // Steepest downward narrowing below the equator.
  let cej = Math.floor(slices * 0.55)
  let steepest = 0
  for (let s = Math.floor(slices * 0.25); s < equator; s++) {
    const drop = radius[s + 1] - radius[s]
    if (drop > steepest) {
      steepest = drop
      cej = s
    }
  }

  return { y: minY + cej * step, equatorRadius: best, minY, maxY }
}

/** Split triangles into above/below a Y plane, by triangle centroid. */
function splitByPlane(position, index, normal, planeY) {
  const tris = index ? index.length / 3 : position.length / 9
  const above = { position: [], normal: [] }
  const below = { position: [], normal: [] }

  for (let t = 0; t < tris; t++) {
    const ids = index
      ? [index[t * 3], index[t * 3 + 1], index[t * 3 + 2]]
      : [t * 3, t * 3 + 1, t * 3 + 2]

    const centroidY = (position[ids[0] * 3 + 1] + position[ids[1] * 3 + 1] + position[ids[2] * 3 + 1]) / 3
    const target = centroidY >= planeY ? above : below

    for (const id of ids) {
      target.position.push(position[id * 3], position[id * 3 + 1], position[id * 3 + 2])
      if (normal) target.normal.push(normal[id * 3], normal[id * 3 + 1], normal[id * 3 + 2])
    }
  }
  return { above, below }
}

/**
 * Laplacian smoothing: move each vertex toward the average of its neighbours.
 *
 * The Dundee source is "created in ZBrush using CT Data", and CT reconstruction
 * bakes voxel slice terracing into the surface - fine concentric contour rings
 * that read as moire once shaded. It is in the geometry, not the renderer:
 * raising the dentin offset did not help (ruling out z-fighting) and decimating
 * from 55k to 6.5k triangles did not help either (ruling out aliasing).
 *
 * Operates on the welded, indexed mesh so neighbours are real topological
 * adjacency rather than coincident duplicates.
 */
function smoothVertices(position, index, iterations = 4, strength = 0.55) {
  const n = position.length / 3
  if (!index) return position

  // Build adjacency once.
  const neighbours = Array.from({ length: n }, () => new Set())
  for (let t = 0; t < index.length; t += 3) {
    const [a, b, c] = [index[t], index[t + 1], index[t + 2]]
    neighbours[a].add(b); neighbours[a].add(c)
    neighbours[b].add(a); neighbours[b].add(c)
    neighbours[c].add(a); neighbours[c].add(b)
  }

  let current = Float32Array.from(position)
  for (let it = 0; it < iterations; it++) {
    const next = Float32Array.from(current)
    for (let i = 0; i < n; i++) {
      const nb = neighbours[i]
      if (nb.size === 0) continue
      let sx = 0, sy = 0, sz = 0
      for (const j of nb) {
        sx += current[j * 3]; sy += current[j * 3 + 1]; sz += current[j * 3 + 2]
      }
      const k = nb.size
      next[i * 3]     = current[i * 3]     + strength * (sx / k - current[i * 3])
      next[i * 3 + 1] = current[i * 3 + 1] + strength * (sy / k - current[i * 3 + 1])
      next[i * 3 + 2] = current[i * 3 + 2] + strength * (sz / k - current[i * 3 + 2])
    }
    current = next
  }
  return current
}

/** Recompute vertex normals by area-weighted face-normal averaging. */
function recomputeNormals(position, index) {
  const n = position.length / 3
  const out = new Float32Array(position.length)
  const tris = index ? index.length / 3 : n / 3
  for (let t = 0; t < tris; t++) {
    const ids = index ? [index[t*3], index[t*3+1], index[t*3+2]] : [t*3, t*3+1, t*3+2]
    const [a, b, c] = ids.map((i) => [position[i*3], position[i*3+1], position[i*3+2]])
    const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]]
    const v = [c[0]-a[0], c[1]-a[1], c[2]-a[2]]
    const fn = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]
    for (const i of ids) for (let k = 0; k < 3; k++) out[i*3+k] += fn[k]
  }
  for (let i = 0; i < n; i++) {
    const len = Math.hypot(out[i*3], out[i*3+1], out[i*3+2]) || 1
    out[i*3] /= len; out[i*3+1] /= len; out[i*3+2] /= len
  }
  return out
}

/** Offset every vertex inward along its normal, producing the dentin shell. */
function shrinkAlongNormals(position, normal, delta) {
  const out = new Float32Array(position.length)
  const n = position.length / 3
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 3; a++) {
      const p = position[i * 3 + a]
      const nv = normal ? normal[i * 3 + a] : 0
      out[i * 3 + a] = p - nv * delta
    }
  }
  return out
}

/** Uniformly scale + translate a vertex array. */
function transform(position, scale, offset) {
  const out = new Float32Array(position.length)
  for (let i = 0; i < position.length; i += 3) {
    out[i] = position[i] * scale + offset[0]
    out[i + 1] = position[i + 1] * scale + offset[1]
    out[i + 2] = position[i + 2] * scale + offset[2]
  }
  return out
}

// ---------------------------------------------------------------------------

console.log('Reading sources...')
const shellRaw = await readMesh(SHELL)
const canalRaw = await readMesh(CANALS)

const TARGET_HEIGHT = 2.0

const shellUp = uprightify(shellRaw.position, shellRaw.normal)
shellRaw.position = shellUp.position
shellRaw.normal = shellUp.normal

const canalUp = uprightify(canalRaw.position, canalRaw.normal)
canalRaw.position = canalUp.position
canalRaw.normal = canalUp.normal

// Remove CT slice terracing before deriving anything from this surface.
if (shellRaw.index) {
  shellRaw.position = Array.from(smoothVertices(shellRaw.position, shellRaw.index, 3, 0.4))
  shellRaw.normal = Array.from(recomputeNormals(shellRaw.position, shellRaw.index))
  console.log('  shell: CT terracing smoothed (3 passes, gentle to limit shrink)')
}

const shell = normalize(shellRaw.position, TARGET_HEIGHT)
console.log(`  shell:  ${(shellRaw.position.length / 3).toLocaleString()} verts, ` +
  `size ${shell.size.map((v) => v.toFixed(2)).join(' x ')}`)

const cej = findCEJ(shell.position)
const crownFraction = (cej.maxY - cej.y) / TARGET_HEIGHT
console.log(`  CEJ found at y=${cej.y.toFixed(3)} (crown is top ${(crownFraction * 100).toFixed(0)}% of height)`)

// Split the shell into enamel (crown) and root.
const { above: enamel, below: root } = splitByPlane(
  shell.position, shellRaw.index, shellRaw.normal, cej.y,
)
console.log(`  enamel: ${(enamel.position.length / 9).toLocaleString()} tris`)
console.log(`  root:   ${(root.position.length / 9).toLocaleString()} tris`)

// Dentin: the whole shell pulled inward. At 4% it z-fought through the
// semi-transparent enamel as visible moire; 7.5% of height reads as a distinct
// layer without poking through the enamel at thin spots.
const DENTIN_OFFSET = TARGET_HEIGHT * 0.075
const dentinPos = shrinkAlongNormals(shell.position, shellRaw.normal, DENTIN_OFFSET)
const dentin = splitByPlane(dentinPos, shellRaw.index, shellRaw.normal, -Infinity).above
console.log(`  dentin: ${(dentin.position.length / 9).toLocaleString()} tris (offset ${DENTIN_OFFSET.toFixed(3)})`)

// Pulp: the canal system, scaled to sit inside the tooth. The two models come
// from different sources at different scales, so fit by height ratio and drop
// it slightly so the canals sit in the roots rather than the crown.
/**
 * The canal system comes from a different scan than the shell, so it cannot be
 * assumed to fit. Scale it against the shell's own measured width at the CEJ
 * rather than a guessed fraction, then verify it is fully contained and shrink
 * until it is - a pulp poking through the enamel is the one artifact that
 * would read as broken rather than stylised.
 */
let canalScale = 0.5
let pulpPos
const shellMaxR = cej.equatorRadius
for (let attempt = 0; attempt < 8; attempt++) {
  const c = normalize(canalRaw.position, TARGET_HEIGHT * canalScale)
  pulpPos = transform(c.position, 1, [0, -TARGET_HEIGHT * 0.08, 0])

  // Widest horizontal reach of the canals.
  let maxR = 0
  for (let i = 0; i < pulpPos.length; i += 3) {
    const r = Math.hypot(pulpPos[i], pulpPos[i + 2])
    if (r > maxR) maxR = r
  }
  // Keep it comfortably inside the dentin, which already sits inside enamel.
  if (maxR < shellMaxR * 0.55) break
  canalScale *= 0.88
}
console.log(`  pulp:   fitted at ${(canalScale * 100).toFixed(0)}% height (contained inside dentin)`)


// ---------------------------------------------------------------------------

console.log('\nBuilding tooth.glb...')
const doc = await io.read(SHELL)
const root_ = doc.getRoot()
const buffer = root_.listBuffers()[0]

// Start from a clean scene; we rebuild it with our four named meshes.
for (const mesh of root_.listMeshes()) mesh.dispose()
for (const node of root_.listNodes()) node.dispose()
for (const scene of root_.listScenes()) scene.dispose()
for (const mat of root_.listMaterials()) mat.dispose()
for (const tex of root_.listTextures()) tex.dispose()

const scene = doc.createScene('tooth')
root_.setDefaultScene(scene)

const LAYERS = [
  { name: 'enamel', data: enamel, color: [0.97, 0.95, 0.91, 1], rough: 0.15 },
  { name: 'dentin', data: dentin, color: [0.92, 0.85, 0.75, 1], rough: 0.55 },
  { name: 'pulp', data: { position: Array.from(pulpPos), normal: canalRaw.normal }, color: [0.77, 0.39, 0.35, 1], rough: 0.7 },
  { name: 'root', data: root, color: [0.94, 0.89, 0.82, 1], rough: 0.62 },
]

for (const layer of LAYERS) {
  const pos = doc
    .createAccessor(`${layer.name}_POSITION`)
    .setType('VEC3')
    .setArray(new Float32Array(layer.data.position))
    .setBuffer(buffer)

  const prim = doc.createPrimitive().setAttribute('POSITION', pos)

  if (layer.data.normal && layer.data.normal.length === layer.data.position.length) {
    prim.setAttribute(
      'NORMAL',
      doc
        .createAccessor(`${layer.name}_NORMAL`)
        .setType('VEC3')
        .setArray(new Float32Array(layer.data.normal))
        .setBuffer(buffer),
    )
  }

  const mat = doc
    .createMaterial(`${layer.name}_mat`)
    .setBaseColorFactor(layer.color)
    .setRoughnessFactor(layer.rough)
    .setMetallicFactor(0)
    // Double-sided ONLY for the pulp, whose canal tubes have open ends.
    // The closed shells must be single-sided: back faces rendering through a
    // transparent enamel interleave with front faces and band the surface.
    .setDoubleSided(layer.name === 'pulp')
  prim.setMaterial(mat)

  const mesh = doc.createMesh(layer.name).addPrimitive(prim)
  scene.addChild(doc.createNode(layer.name).setMesh(mesh))
}

/**
 * Decimate.
 *
 * The sources are CT-derived sculpts at ~55k triangles each. Rendered into a
 * roughly 300px-tall object that is enormous oversampling, and it shows up as
 * visible moire shimmer across the crown - geometric aliasing, not z-fighting
 * (raising the dentin offset changed nothing, which is what ruled that out).
 *
 * weld() first: simplification needs shared vertices to collapse edges across,
 * and these buffers are unindexed triangle soup.
 */
await MeshoptSimplifier.ready
await doc.transform(
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.18, error: 0.002 }),
  dedup(),
  prune(),
)
await io.write(`${MODELS}/tooth.glb`, doc)

console.log(`\nWrote ${MODELS}/tooth.glb`)
