'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { resolveBeat } from './beats'

/**
 * A procedurally generated molar, built as four separable anatomical layers.
 *
 * No model file (spec 14.1) - the crown profile is a lathe curve and the roots
 * are tapered tubes, so the whole thing is arithmetic. That suits a tooth
 * unusually well: enamel is a translucent shell over a denser core, which is
 * exactly what transmission and clearcoat render convincingly, and the organic
 * silhouette hides a low geometry budget.
 *
 * Everything animates through refs inside useFrame. Driving it from React
 * state would re-render the tree every frame; scroll-linked 3D belongs on the
 * render loop, not in the reconciler.
 */

/**
 * Half-profile of a molar crown, revolved to make the shell.
 *
 * Proportioned from real anatomy rather than eyeballed: a molar crown is
 * WIDER than it is tall (~11mm across, ~7.5mm high), has a broad flattish
 * occlusal surface rather than a dome, bulges at the equator, then pinches
 * into a distinct neck at the gumline. Getting the neck in is what stops it
 * reading as a mushroom.
 */
function crownProfile(scale: number): THREE.Vector2[] {
  // Width 1.7 against height 0.92 - a molar crown really is wider than tall.
  // The dip at the centre is the fissure between cusps.
  const curve: [number, number][] = [
    [0.00, 0.72],  // centre of the occlusal surface
    [0.18, 0.745],
    [0.36, 0.765], // cusp
    [0.54, 0.715], // fissure between cusps
    [0.70, 0.645], // second cusp
    [0.80, 0.52],
    [0.85, 0.32],  // equator, the widest point
    [0.82, 0.12],
    [0.70, -0.02],
    [0.56, -0.14], // neck
    [0.50, -0.20],
  ]
  return curve.map(([x, y]) => new THREE.Vector2(Math.max(x * scale, 0.001), y * scale))
}

/**
 * Lathe the crown profile into a shell.
 *
 * The raw profile is only ten points, and LatheGeometry builds one band per
 * consecutive pair - which shows up as visible polygon banding across the
 * crown. Resampling the profile through a Catmull-Rom spline first gives the
 * lathe enough rings to shade smoothly, at no meaningful cost.
 */
function useLathe(scale: number, segments = 96) {
  return useMemo(() => {
    const raw = crownProfile(scale)
    const spline = new THREE.SplineCurve(raw)
    const smooth = spline.getPoints(72).map(
      (p) => new THREE.Vector2(Math.max(p.x, 0.001), p.y),
    )
    const g = new THREE.LatheGeometry(smooth, segments)
    g.computeVertexNormals()
    return g
  }, [scale, segments])
}

/**
 * One root: a narrow tapered cone, placed off-axis and splayed outward.
 *
 * The previous two attempts both failed for geometry reasons worth recording.
 * TubeGeometry has a constant radius, so it produced cylinders. Lathing a
 * tapered profile and shearing it produced full-width cones of revolution
 * centred on the axis - two of those, sheared opposite ways, overlap into an
 * X-shaped shell. A root is simply a thin cone standing beside the axis, so
 * that is what this builds.
 */
function useRoot() {
  return useMemo(() => {
    // radiusTop, radiusBottom, height - tapering almost to a point at the apex.
    const g = new THREE.CylinderGeometry(0.26, 0.04, 1.28, 24, 6)
    g.translate(0, -0.64, 0)
    return g
  }, [])
}

type LayerKey = 'enamel' | 'dentin' | 'pulp' | 'root'
const LAYERS: LayerKey[] = ['enamel', 'dentin', 'pulp', 'root']

export function Tooth({ progressRef }: { progressRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const enamel = useRef<THREE.Mesh>(null)
  const dentin = useRef<THREE.Mesh>(null)
  const pulp = useRef<THREE.Mesh>(null)
  const roots = useRef<THREE.Group>(null)

  const enamelGeo = useLathe(1.0)
  const dentinGeo = useLathe(0.82)
  const pulpGeo = useLathe(0.44)
  const rootGeo = useRoot()

  // Smoothed toward each beat's target so transitions ease rather than snap.
  const anim = useRef({
    explode: 0,
    glow: { enamel: 0, dentin: 0, pulp: 0, root: 0 } as Record<LayerKey, number>,
  })

  useFrame((_, delta) => {
    const progress = progressRef.current ?? 0
    const beat = resolveBeat(progress)
    const k = Math.min(delta * 3, 1)
    const a = anim.current

    a.explode += (beat.explode - a.explode) * k
    for (const key of LAYERS) {
      a.glow[key] += ((beat.focus === key ? 1 : 0) - a.glow[key]) * k
    }
    const e = a.explode

    if (group.current) {
      group.current.rotation.y = progress * Math.PI * 1.35
      group.current.rotation.z = Math.sin(progress * Math.PI) * 0.12
    }

    // Layers separate along y so the cross-section reads as an exploded view.
    if (enamel.current) enamel.current.position.y = e * 0.95
    if (dentin.current) dentin.current.position.y = e * 0.34
    if (pulp.current) pulp.current.position.y = -e * 0.05
    if (roots.current) roots.current.position.y = -e * 0.8

    const setGlow = (mesh: THREE.Mesh | null, key: LayerKey, base = 0, mul = 0.45) => {
      if (!mesh) return
      const m = mesh.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = base + a.glow[key] * mul
    }
    setGlow(enamel.current, 'enamel')
    setGlow(dentin.current, 'dentin')
    setGlow(pulp.current, 'pulp', 0.15, 0.7)
    roots.current?.children.forEach((c) => setGlow(c as THREE.Mesh, 'root'))

    if (enamel.current) {
      const m = enamel.current.material as THREE.MeshPhysicalMaterial
      // Enamel clarifies as the layers part, so you can see what is inside.
      m.transmission = 0.22 + e * 0.62
      m.opacity = 1 - e * 0.3
    }
  })

  return (
    <group ref={group} position={[0, 0.35, 0]} scale={1.45}>
      <mesh ref={enamel} geometry={enamelGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#FBF7F0"
          roughness={0.14}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.12}
          transmission={0.22}
          thickness={1.1}
          ior={1.6}
          transparent
          side={THREE.DoubleSide}
          emissive="#E8A94E"
          emissiveIntensity={0}
        />
      </mesh>

      <mesh ref={dentin} geometry={dentinGeo} castShadow>
        <meshPhysicalMaterial
          color="#EBD9BE"
          roughness={0.55}
          metalness={0}
          clearcoat={0.3}
          emissive="#E8A94E"
          emissiveIntensity={0}
        />
      </mesh>

      <mesh ref={pulp} geometry={pulpGeo}>
        <meshStandardMaterial
          color="#C4635A"
          roughness={0.7}
          emissive="#C4635A"
          emissiveIntensity={0.15}
        />
      </mesh>

      <group ref={roots} position={[0, -0.16, 0]}>
        {/* splayed apart and tilted outward, the way a molar's roots sit */}
        <mesh geometry={rootGeo} castShadow position={[-0.26, 0, 0]} rotation={[0, 0, -0.17]}>
          <meshStandardMaterial color="#F0E4D0" roughness={0.62} emissive="#E8A94E" emissiveIntensity={0} />
        </mesh>
        <mesh geometry={rootGeo} castShadow position={[0.26, 0, 0]} rotation={[0, 0, 0.17]}>
          <meshStandardMaterial color="#F0E4D0" roughness={0.62} emissive="#E8A94E" emissiveIntensity={0} />
        </mesh>
      </group>
    </group>
  )
}
