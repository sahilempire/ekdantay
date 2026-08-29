'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import type { Group, Mesh } from 'three'

/**
 * Procedural hero geometry - no model files (spec 14.1).
 *
 * The direction is "abstract warm 3D", not a literal tooth: a rendered molar
 * is the clinical imagery the reference research found works *against* an
 * anxious patient. Instead this is a cluster of soft enamel-like forms under
 * warm studio light, which reads as calm and tactile while still carrying the
 * depth the direction asks for.
 *
 * Quality here comes from lighting and material, not polygon count. Segment
 * counts are deliberately modest so this stays cheap on mid-range hardware.
 */

function EnamelForm() {
  const mesh = useRef<Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    // Very slow drift. Fast rotation on a clinic site reads as a gimmick.
    mesh.current.rotation.y = state.clock.elapsedTime * 0.12
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.06
  })

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[1.15, 64, 64]} />
      <MeshDistortMaterial
        color="#F6F1E9"
        distort={0.28}
        speed={1.1}
        roughness={0.28}
        metalness={0.05}
        envMapIntensity={0.6}
      />
    </mesh>
  )
}

function Satellite({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number]
  scale: number
  color: string
  speed: number
}) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh position={position} scale={scale} castShadow>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.08} />
      </mesh>
    </Float>
  )
}

function Rig() {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    // Gentle parallax toward the pointer. Clamped hard so it never feels
    // like the page is being dragged around.
    const { x, y } = state.pointer
    group.current.rotation.y += (x * 0.18 - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-y * 0.12 - group.current.rotation.x) * 0.04
  })

  return (
    <group ref={group}>
      <EnamelForm />
      <Satellite position={[-1.85, 0.95, -0.6]} scale={0.3} color="#DDEAE4" speed={1.4} />
      <Satellite position={[1.7, -0.85, -0.4]} scale={0.22} color="#E8A94E" speed={1.9} />
      <Satellite position={[1.5, 1.25, -1.2]} scale={0.16} color="#C9DED5" speed={2.3} />
    </group>
  )
}

export default function Scene() {
  // Lights are explicit rather than drei's <Environment preset>, which fetches
  // an HDR from a third-party CDN - that would be both a network dependency
  // and a CSP problem, for a scene this simple.
  const lights = useMemo(
    () => (
      <>
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[-4, 5, 4]}
          intensity={2.1}
          color="#FFE7C2"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[5, -2, 3]} intensity={0.6} color="#CFE6DC" />
        <pointLight position={[0, -3, 2]} intensity={0.5} color="#0F6B5C" />
      </>
    ),
    [],
  )

  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      {lights}
      <Rig />
    </Canvas>
  )
}
