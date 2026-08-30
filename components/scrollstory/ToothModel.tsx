'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { resolveBeat } from './beats'

/**
 * Loads a real anatomical tooth model and drives the exploded-view sequence.
 *
 * Written before we had a model in hand, deliberately: the layer mapping is
 * data, not hardcoded node names, so whatever GLB we end up with only needs a
 * MAPPING entry rather than a rewrite. Anything the mapping does not match is
 * still rendered, just as a static part - so an unexpected node structure
 * degrades to "model shows but does not explode", never to a blank canvas.
 */

export type LayerKey = 'enamel' | 'dentin' | 'pulp' | 'root'

/**
 * Substrings matched (case-insensitively) against mesh names in the GLB.
 * Real dental models name their parts inconsistently, so each layer carries
 * several aliases. First match wins, checked in array order.
 */
export const NODE_MATCHERS: Record<LayerKey, string[]> = {
  enamel: ['enamel', 'crown', 'schmelz', 'outer'],
  dentin: ['dentin', 'dentine', 'dentil', 'body', 'inner'],
  pulp: ['pulp', 'nerve', 'canal', 'cavity', 'core'],
  root: ['root', 'radix', 'wurzel', 'apex'],
}

/** How far along y each layer travels at full explode. */
const TRAVEL: Record<LayerKey, number> = {
  enamel: 0.95,
  dentin: 0.34,
  pulp: -0.05,
  root: -0.8,
}

const GLOW: Record<LayerKey, string> = {
  enamel: '#E8A94E',
  dentin: '#E8A94E',
  pulp: '#C4635A',
  root: '#E8A94E',
}

function classify(name: string): LayerKey | null {
  const n = name.toLowerCase()
  for (const key of Object.keys(NODE_MATCHERS) as LayerKey[]) {
    if (NODE_MATCHERS[key].some((alias) => n.includes(alias))) return key
  }
  return null
}

interface Props {
  /** Path under /public, e.g. "/models/tooth.glb" */
  src: string
  progressRef: React.RefObject<number>
  /** Uniform scale applied after auto-centring. */
  scale?: number
}

export function ToothModel({ src, progressRef, scale = 1 }: Props) {
  const { scene } = useGLTF(src)
  const group = useRef<THREE.Group>(null)

  /**
   * Clone so multiple mounts (and React strict-mode double-invocation) never
   * share mutated transforms, then normalise: centre on the origin and scale
   * to a known height, so the camera framing in beats.ts holds regardless of
   * what units the artist modelled in.
   */
  const { root, parts } = useMemo(() => {
    const clone = scene.clone(true)

    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const centre = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(centre)

    const normalise = size.y > 0 ? 3.2 / size.y : 1
    clone.scale.setScalar(normalise)
    clone.position.sub(centre.multiplyScalar(normalise))

    const found: { mesh: THREE.Mesh; layer: LayerKey; home: THREE.Vector3 }[] = []
    clone.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      o.castShadow = true
      o.receiveShadow = true

      // Materials are shared across clones by default; give each mesh its own
      // so per-layer emissive changes do not bleed between them.
      if (Array.isArray(o.material)) o.material = o.material.map((m) => m.clone())
      else o.material = o.material.clone()

      const layer = classify(o.name)
      if (layer) {
        const mat = o.material as THREE.MeshStandardMaterial
        if ('emissive' in mat) mat.emissive = new THREE.Color(GLOW[layer])
        found.push({ mesh: o, layer, home: o.position.clone() })
      }
    })

    return { root: clone, parts: found }
  }, [scene])

  const anim = useRef({ explode: 0, glow: { enamel: 0, dentin: 0, pulp: 0, root: 0 } })

  useEffect(() => {
    if (parts.length === 0) {
      // Loud rather than silent: a model whose nodes match nothing still
      // renders, but the sequence will not animate, and that is worth knowing.
      console.warn(
        `[ToothModel] No layer nodes matched in ${src}. ` +
          `Add the model's mesh names to NODE_MATCHERS. Mesh names present: ` +
          `${(root.children ?? []).map((c) => c.name).join(', ')}`,
      )
    }
  }, [parts.length, src, root])

  useFrame((_, delta) => {
    const progress = progressRef.current ?? 0
    const beat = resolveBeat(progress)
    const k = Math.min(delta * 3, 1)
    const a = anim.current

    a.explode += (beat.explode - a.explode) * k
    for (const key of Object.keys(TRAVEL) as LayerKey[]) {
      a.glow[key] += ((beat.focus === key ? 1 : 0) - a.glow[key]) * k
    }

    if (group.current) {
      group.current.rotation.y = progress * Math.PI * 1.35
      group.current.rotation.z = Math.sin(progress * Math.PI) * 0.12
    }

    for (const { mesh, layer, home } of parts) {
      mesh.position.y = home.y + a.explode * TRAVEL[layer]
      const mat = mesh.material as THREE.MeshStandardMaterial
      if ('emissiveIntensity' in mat) {
        mat.emissiveIntensity = (layer === 'pulp' ? 0.15 : 0) + a.glow[layer] * 0.5
      }
    }
  })

  return (
    <group ref={group} scale={scale}>
      <primitive object={root} />
    </group>
  )
}

/** Warm the cache so the model is ready before the section scrolls into view. */
export function preloadTooth(src: string) {
  useGLTF.preload(src)
}
