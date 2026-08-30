'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, ContactShadows } from '@react-three/drei'
import type { Group, Mesh } from 'three'

/**
 * Procedural hero geometry - no model files (spec 14.1).
 *
 * The direction is "abstract warm 3D", not a literal tooth: a rendered molar
 * is exactly the clinical imagery the reference research found works *against*
 * an anxious patient. This is a cluster of soft enamel-like forms under warm
 * studio light instead - calm and tactile, but with the depth the direction
 * asks for.
 *
 * Quality comes from material and light, not polygon count. The main form uses
 * a physical material with clearcoat and a little transmission, because that
 * is what actually reads as enamel: glossy surface over a soft translucent
 * body. Segment counts stay modest so this is cheap on mid-range hardware.
 */

/** Camera framing. Half-extent visible at z=0 is CAM_Z * tan(FOV/2). */
const CAM_Z = 6
const FOV = 42
/** = 6 * tan(21deg) = 2.30. Nothing may be placed beyond this or it clips. */
const HALF_EXTENT = CAM_Z * Math.tan((FOV / 2) * (Math.PI / 180))
const SAFE = HALF_EXTENT * 0.78

function EnamelForm() {
  const mesh = useRef<Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    // Very slow drift. Fast rotation on a clinic site reads as a gimmick.
    mesh.current.rotation.y = state.clock.elapsedTime * 0.1
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.18) * 0.05
  })

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[1.3, 96, 96]} />
      <MeshDistortMaterial
        color="#F7F2EA"
        distort={0.34}
        speed={0.9}
        roughness={0.18}
        metalness={0}
        clearcoat={0.9}
        clearcoatRoughness={0.25}
        transmission={0.12}
        thickness={1.4}
        ior={1.45}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

function Satellite({
  position,
  scale,
  color,
  speed,
  roughness = 0.3,
}: {
  position: [number, number, number]
  scale: number
  color: string
  speed: number
  roughness?: number
}) {
  return (
    <Float speed={speed} rotationIntensity={0.45} floatIntensity={0.7}>
      <mesh position={position} scale={scale} castShadow>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhysicalMaterial
          color={color}
          roughness={roughness}
          metalness={0}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </mesh>
    </Float>
  )
}

function Rig() {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    // Gentle parallax toward the pointer, clamped hard so it never feels like
    // the page is being dragged around.
    const { x, y } = state.pointer
    group.current.rotation.y += (x * 0.16 - group.current.rotation.y) * 0.035
    group.current.rotation.x += (-y * 0.1 - group.current.rotation.x) * 0.035
  })

  return (
    <group ref={group}>
      <EnamelForm />
      {/* All satellites sit inside SAFE so nothing clips the canvas edge. */}
      <Satellite position={[-SAFE, SAFE * 0.52, -0.8]} scale={0.3} color="#CFE3D9" speed={1.3} />
      <Satellite position={[SAFE * 0.94, -SAFE * 0.58, -0.5]} scale={0.24} color="#E8A94E" speed={1.8} roughness={0.42} />
      <Satellite position={[SAFE * 0.82, SAFE * 0.7, -1.4]} scale={0.16} color="#DDEAE4" speed={2.2} />
      <Satellite position={[-SAFE * 0.72, -SAFE * 0.78, -1.1]} scale={0.13} color="#F0DCC0" speed={2.6} />
    </group>
  )
}

export default function Scene() {
  // Lights are explicit rather than drei's <Environment preset>, which fetches
  // an HDR from a third-party CDN - both a network dependency and a CSP
  // problem, for a scene this simple.
  const lights = useMemo(
    () => (
      <>
        <ambientLight intensity={0.5} />
        {/* warm key, upper left - matches the fallback's light direction */}
        <directionalLight
          position={[-4, 5, 4]}
          intensity={2.4}
          color="#FFE7C2"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* cool fill from the right, keeps the shadow side from going muddy */}
        <directionalLight position={[5, -1, 3]} intensity={0.7} color="#CFE6DC" />
        {/* jade bounce from below, ties the form to the brand accent */}
        <pointLight position={[0, -3.5, 2]} intensity={0.7} color="#0F6B5C" />
        {/* rim light picks out the silhouette against the paper ground */}
        <pointLight position={[0, 2, -4]} intensity={1.1} color="#FFFFFF" />
      </>
    ),
    [],
  )

  return (
    <Canvas
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      {lights}
      <Rig />
      {/* Grounds the composition so the forms sit in a space rather than float. */}
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.32}
        scale={7}
        blur={2.6}
        far={4}
        color="#2A2018"
      />
    </Canvas>
  )
}
