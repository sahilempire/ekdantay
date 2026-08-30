'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { resolveBeat } from './beats'

type LayerName = 'enamel' | 'dentin' | 'pulp' | 'root'
import layers from '@/public/images/sequence/layers.json'

/**
 * The scroll stage, driven by pre-rendered images instead of real-time 3D.
 *
 * Apple's product scrolls work this way - the AirPods page is a frame
 * sequence, not WebGL - and the reasons apply here exactly. The whole set is
 * 832 KB against 2,957 KB for the GLB plus the three.js chunk, it needs no
 * WebGL so it works identically on low-end Android, and every artifact we
 * fought in the derived geometry (torn seams, open rims, scattering parts)
 * simply cannot occur in an image.
 *
 * The sequence moves through SCALE rather than rotating one object: skull, to
 * jaw, to a single tooth, to that tooth opening layer by layer. Zooming tells
 * a story in a way that turning something does not.
 *
 * Layer positions come from layers.json, emitted by the processing script, so
 * the exploded arrangement is rebuilt from where the parts actually sat in the
 * source rather than from hand-typed coordinates that would rot the moment the
 * images are regenerated.
 */

interface Scene {
  /** Full-frame image for beats that are not the layered tooth. */
  image?: string
  /** Show the four cut layers instead. */
  layered?: boolean
  /** How far the layers separate, 0 = assembled, 1 = fully apart. */
  spread?: number
  /** Which layer is emphasised. */
  focus?: LayerName | null
  /** Scale applied to the whole scene, for the zoom journey. */
  scale: number
  alt: string
}

const SCENES: Record<string, Scene> = {
  hero: { image: '/images/sequence/skull.webp', scale: 1, alt: 'Human skull showing the teeth' },
  intro: { image: '/images/sequence/jaw.webp', scale: 1.15, alt: 'Lower jaw with a full arch of teeth' },
  enamel: { layered: true, spread: 0.15, focus: 'enamel', scale: 1.1, alt: 'Tooth layers, enamel highlighted' },
  dentin: { layered: true, spread: 0.55, focus: 'dentin', scale: 1.1, alt: 'Tooth layers, dentin highlighted' },
  pulp: { layered: true, spread: 0.85, focus: 'pulp', scale: 1.1, alt: 'Tooth layers, pulp and nerve highlighted' },
  root: { layered: true, spread: 1, focus: 'root', scale: 1.05, alt: 'Tooth layers, roots highlighted' },
  straighten: { image: '/images/sequence/braces.webp', scale: 1, alt: 'Lower arch fitted with orthodontic braces' },
  whole: { image: '/images/sequence/whole.webp', scale: 1, alt: 'A whole, intact molar tooth' },
}

/** Aspect ratio of the source frame, so the layers keep their arrangement. */
const FRAME_RATIO = layers.frame.width / layers.frame.height

export function ImageStage({ progressRef }: { progressRef: React.RefObject<number> }) {
  const [beatId, setBeatId] = useState('hero')
  const raf = useRef(0)

  // Poll the ref rather than subscribing to state upstream: the parent already
  // writes scroll progress to a ref precisely so nothing re-renders per frame,
  // and this only sets state when the beat actually changes.
  useEffect(() => {
    const tick = () => {
      raf.current = requestAnimationFrame(tick)
      const next = resolveBeat(progressRef.current ?? 0).id
      setBeatId((prev) => (prev === next ? prev : next))
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [progressRef])

  const beat = resolveBeat(progressRef.current ?? 0)
  const scene = SCENES[beatId] ?? SCENES.hero

  // Beats already declare which side the copy sits on and how far the subject
  // should move; reuse that so the image never lands under the text.
  const shiftX = (beat.offset?.x ?? 0) * 9

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="relative h-[78%] transition-transform duration-[1200ms] ease-out"
        style={{
          aspectRatio: FRAME_RATIO,
          transform: `translateX(${shiftX}%) scale(${scene.scale})`,
        }}
      >
        {/* Full-frame scenes: skull, jaw, braces, whole tooth. */}
        {(['hero', 'intro', 'straighten', 'whole'] as const).map((id) => {
          const s = SCENES[id]
          if (!s.image) return null
          const active = beatId === id
          return (
            <div
              key={id}
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ opacity: active ? 1 : 0 }}
            >
              <Image
                src={s.image}
                alt={active ? s.alt : ''}
                fill
                sizes="(max-width: 768px) 80vw, 45vw"
                className="object-contain"
                priority={id === 'hero'}
              />
            </div>
          )
        })}

        {/*
          The cut layers, positioned where they sat in the source frame.

          `spread` scales each layer's distance from the centre of the stack,
          so at 0 they nest into a whole tooth and at 1 they sit fully apart -
          the same exploded arrangement the image was generated with.
        */}
        {layers.layers.map((layer) => {
          const centre = layer.top + layer.height / 2
          const fromMiddle = centre - 0.5
          const spread = scene.spread ?? 0
          const top = 0.5 + fromMiddle * (0.35 + spread * 0.65) - layer.height / 2

          const isFocus = scene.focus === layer.name
          const shown = scene.layered ?? false

          return (
            <div
              key={layer.name}
              className="absolute transition-all duration-[900ms] ease-out"
              style={{
                left: `${layer.left * 100}%`,
                top: `${top * 100}%`,
                width: `${layer.width * 100}%`,
                height: `${layer.height * 100}%`,
                opacity: shown ? (isFocus ? 1 : 0.42) : 0,
                transform: `scale(${isFocus ? 1.06 : 1})`,
                zIndex: isFocus ? 2 : 1,
              }}
            >
              <Image
                src={layer.src}
                alt={isFocus ? `${layer.name} layer of a tooth` : ''}
                fill
                sizes="(max-width: 768px) 40vw, 22vw"
                className="object-contain"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
