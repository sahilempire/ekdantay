import { NodeIO } from '@gltf-transform/core'
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions'

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS)

async function analyse(path, label) {
  const doc = await io.read(path)
  console.log(`\n=== ${label} ===`)
  for (const mesh of doc.getRoot().listMeshes()) {
    const prim = mesh.listPrimitives()[0]
    const idx = prim.getIndices()
    const pos = prim.getAttribute('POSITION').getArray()
    if (!idx) { console.log(`  ${mesh.getName()}: UNINDEXED`); continue }
    const index = idx.getArray()

    // Weld by quantised position so coincident duplicate verts count as one.
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
    let boundary = 0, nonManifold = 0
    for (const c of edge.values()) {
      if (c === 1) boundary++
      else if (c > 2) nonManifold++
    }
    const tris = index.length / 3
    console.log(`  ${mesh.getName().padEnd(8)} tris=${String(tris).padStart(6)}  welded verts=${String(key.size).padStart(6)}  BOUNDARY edges=${String(boundary).padStart(5)}  non-manifold=${nonManifold}`)
  }
}

await analyse('public/models/tooth.glb', 'DERIVED tooth.glb')
await analyse('public/models/src/shell/scene.gltf', 'SOURCE shell')
