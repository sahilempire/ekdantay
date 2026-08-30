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

export type LayerKey = 'whole' | 'enamel' | 'dentin' | 'pulp' | 'root'

/**
 * Substrings matched (case-insensitively) against mesh names in the GLB.
 * Real dental models name their parts inconsistently, so each layer carries
 * several aliases. First match wins, checked in array order.
 */
export const NODE_MATCHERS: Record<LayerKey, string[]> = {
  // Checked in order, so `whole` must precede the parts it would also match.
  whole: ['whole'],
  enamel: ['enamel', 'crown', 'schmelz', 'outer'],
  dentin: ['dentin', 'dentine', 'dentil', 'body', 'inner'],
  pulp: ['pulp', 'nerve', 'canal', 'cavity', 'core'],
  root: ['root', 'radix', 'wurzel', 'apex'],
}

/** Per-layer surface treatment. Enamel is glossy and slightly translucent. */
const LOOK: Record<LayerKey, { color: string; roughness: number; clearcoat: number }> = {
  whole: { color: '#FAF6EF', roughness: 0.13, clearcoat: 1 },
  enamel: { color: '#FAF6EF', roughness: 0.13, clearcoat: 1 },
  dentin: { color: '#E6D2B4', roughness: 0.58, clearcoat: 0.25 },
  pulp: { color: '#C4635A', roughness: 0.72, clearcoat: 0 },
  // Close to enamel on purpose: a real crown/root colour break is subtle,
  // and a strong one reads as the tooth being split rather than shaded.
  root: { color: '#F6F1E8', roughness: 0.42, clearcoat: 0.45 },
}

const GLOW: Record<LayerKey, string> = {
  whole: '#E8A94E',
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

    const found: { mesh: THREE.Mesh; layer: LayerKey }[] = []
    clone.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      o.castShadow = true
      o.receiveShadow = true

      const layer = classify(o.name)

      if (layer) {
        /**
         * Replace the GLB's material outright rather than cloning it.
         *
         * glTF materials load as MeshStandardMaterial, which has no
         * `transmission` - so driving enamel transparency against it silently
         * did nothing. MeshPhysicalMaterial is what actually carries
         * transmission and clearcoat, which are the two properties that make
         * enamel read as enamel rather than as white plastic.
         */
        o.material = new THREE.MeshPhysicalMaterial({
          color: LOOK[layer].color,
          roughness: LOOK[layer].roughness,
          metalness: 0,
          clearcoat: LOOK[layer].clearcoat,
          clearcoatRoughness: 0.2,
          emissive: new THREE.Color(GLOW[layer]),
          emissiveIntensity: 0,
          side: layer === 'pulp' ? THREE.DoubleSide : THREE.FrontSide,
        })
        found.push({ mesh: o, layer })
      } else {
        if (Array.isArray(o.material)) o.material = o.material.map((m) => m.clone())
        else o.material = o.material.clone()
      }
    })

    return { root: clone, parts: found }
  }, [scene])

  const LAYERS: LayerKey[] = ['whole', 'enamel', 'dentin', 'pulp', 'root']

  const anim = useRef({
    spin: 0,
    offsetX: 0,
    offsetY: 0,
    // The hero opens on the whole tooth, so it starts fully visible.
    opacity: { whole: 1, enamel: 0, dentin: 0, pulp: 0, root: 0 } as Record<LayerKey, number>,
    glow: { whole: 0, enamel: 0, dentin: 0, pulp: 0, root: 0 } as Record<LayerKey, number>,
  })

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
    const k = Math.min(delta * 2.6, 1)
    const a = anim.current

    for (const key of LAYERS) {
      const target = beat.show.includes(key) ? 1 : 0
      a.opacity[key] += (target - a.opacity[key]) * k
      a.glow[key] += ((beat.focus === key ? 1 : 0) - a.glow[key]) * k
    }

    if (group.current) {
      /**
       * A slow constant turn so the scene is alive while the page is still.
       * Scroll-only rotation leaves it frozen until someone moves, which reads
       * as a static render rather than a live object.
       */
      a.spin += delta * 0.2
      group.current.rotation.y = a.spin + progress * Math.PI * 1.1
      group.current.rotation.z = Math.sin(progress * Math.PI) * 0.1

      const off = beat.offset ?? { x: 0, y: 0 }
      a.offsetX += (off.x - a.offsetX) * k
      a.offsetY += (off.y - a.offsetY) * k
      group.current.position.x = a.offsetX
      group.current.position.y = a.offsetY
    }

    /**
     * Crossfade between layers instead of separating them.
     *
     * Every previous attempt pulled an assembled tooth apart, and derived
     * shells always read as scattering debris however carefully the geometry
     * was built - open rims, coincident surfaces, pieces drifting out of
     * frame. Showing one layer at a time sidesteps all of it: each frame is a
     * single clean closed solid, and the transition is a dissolve rather than
     * an explosion.
     */
    for (const { mesh, layer } of parts) {
      const o = a.opacity[layer]
      const mat = mesh.material as THREE.MeshPhysicalMaterial

      mesh.visible = o > 0.004
      mat.transparent = o < 0.995
      mat.opacity = o
      // Depth-write off while fading stops a half-faded shell from occluding
      // the layer emerging behind it.
      mat.depthWrite = o > 0.9

      if ('emissiveIntensity' in mat) {
        mat.emissiveIntensity = ((layer === 'pulp' ? 0.15 : 0) + a.glow[layer] * 0.4) * o
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
