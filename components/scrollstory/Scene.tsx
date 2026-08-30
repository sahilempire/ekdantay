'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Tooth } from './Tooth'
import { ToothModel } from './ToothModel'
import { BEATS, type Beat } from './beats'

/**
 * Set to a path under /public once we have a licensed anatomical model, e.g.
 * '/models/tooth.glb'. Null keeps the procedural fallback.
 */
const MODEL_SRC: string | null = null

/** Which beat a given scroll progress belongs to, and the blend toward the next. */
function resolveBeat(p: number): Beat {
  let current = BEATS[0]
  for (const b of BEATS) if (p >= b.at - 0.001) current = b
  return current
}

function Rig({ progressRef }: { progressRef: React.RefObject<number> }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 7.5))

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0
    const beat = resolveBeat(p)
    target.current.set(beat.camera.x, beat.camera.y, beat.camera.z)
    // Critically damped follow - the camera arrives without overshooting,
    // which keeps a scroll-driven move from feeling springy or seasick.
    camera.position.lerp(target.current, Math.min(delta * 2.4, 1))
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene({ progressRef }: { progressRef: React.RefObject<number> }) {
  // Device-tier detection: phones get the scene, just a cheaper one. Shadows
  // and the extra fill lights are what actually cost on mobile GPUs.
  const isPhone =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px), (pointer: coarse)').matches

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 40 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows={!isPhone}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[-4, 6, 5]} intensity={2.6} color="#FFE9C8" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[5, 0, 3]} intensity={0.8} color="#CFE6DC" />
      <pointLight position={[0, -4, 3]} intensity={0.9} color="#0F6B5C" />
      {!isPhone && <pointLight position={[0, 3, -5]} intensity={1.4} color="#FFFFFF" />}

      <Rig progressRef={progressRef} />
      {/* A real GLB takes over the moment one is dropped in; until then the
          procedural tooth keeps the sequence working. Swapping is a one-line
          change, not a rewrite, because both take the same progressRef. */}
      {MODEL_SRC ? (
        <Suspense fallback={<Tooth progressRef={progressRef} />}>
          <ToothModel src={MODEL_SRC} progressRef={progressRef} />
        </Suspense>
      ) : (
        <Tooth progressRef={progressRef} />
      )}

      {!isPhone && (
        <ContactShadows position={[0, -2.6, 0]} opacity={0.3} scale={9} blur={2.8} far={5} color="#2A2018" />
      )}
    </Canvas>
  )
}
