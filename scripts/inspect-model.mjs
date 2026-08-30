/**
 * Report a GLB's mesh structure: names, triangle counts, materials, and
 * watertightness per mesh.
 *
 * Run this on any candidate model BEFORE wiring it in. Material count on the
 * Sketchfab page only hints at internal structure; this says definitively
 * whether the parts are separate meshes we can show and hide independently.
 *
 *   node scripts/inspect-model.mjs public/models/inside-tooth.glb
 */
import { NodeIO } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'

const path = process.argv[2]
if (!path) {
  console.error('usage: node scripts/inspect-model.mjs <file.glb>')
  process.exit(1)
}

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS)
const doc = await io.read(path)
const root = doc.getRoot()

function boundary(pos, index) {
  if (!index) return 'unindexed'
  const key = new Map()
  const remap = new Int32Array(pos.length / 3)
  for (let i = 0; i < pos.length / 3; i++) {
    const k = `${Math.round(pos[i*3]*1e4)}_${Math.round(pos[i*3+1]*1e4)}_${Math.round(pos[i*3+2]*1e4)}`
    if (!key.has(k)) key.set(k, key.size)
    remap[i] = key.get(k)
  }
  const edge = new Map()
  for (let t = 0; t < index.length; t += 3) {
    const v = [remap[index[t]], remap[index[t+1]], remap[index[t+2]]]
    for (let e = 0; e < 3; e++) {
      const a = v[e], b = v[(e+1)%3]
      const k = a < b ? `${a}_${b}` : `${b}_${a}`
      edge.set(k, (edge.get(k) ?? 0) + 1)
    }
  }
  let b = 0
  for (const c of edge.values()) if (c === 1) b++
  return b
}

console.log(`\n${path}`)
console.log(`  meshes: ${root.listMeshes().length}   materials: ${root.listMaterials().length}   textures: ${root.listTextures().length}`)
console.log('')

for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION').getArray()
    const idx = prim.getIndices()?.getArray()
    const mat = prim.getMaterial()
    const tris = idx ? idx.length / 3 : pos.length / 9
    console.log(`  ${(mesh.getName() || '(unnamed)').padEnd(28)} tris=${String(tris).padStart(7)}  material=${mat?.getName() ?? '-'}  boundary=${boundary(pos, idx)}`)
  }
}

console.log('\n  node names in the scene graph:')
for (const node of root.listNodes()) {
  if (node.getMesh()) console.log(`    ${node.getName() || '(unnamed)'}`)
}
console.log('')
