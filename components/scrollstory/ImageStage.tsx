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
  intro: { image: '/images/sequence/jaw.webp', scale: 1.2, alt: 'Lower jaw with a full arch of teeth' },
  // The whitening image IS the enamel story - staining sits in the enamel -
  // so one beat carries both rather than repeating the same price twice.
  enamel: { image: '/images/sequence/whitening.webp', scale: 1, alt: 'A tooth stained on one side and whitened on the other' },
  // The decay cross-section, not the layer stack: this beat's copy is about
  // decay reaching the dentin, and the image shows exactly that.
  dentin: { image: '/images/sequence/decay.webp', scale: 1.05, alt: 'Cross-section of a tooth with decay reaching the dentin' },
  pulp: { layered: true, spread: 0.85, focus: 'pulp', scale: 1.1, alt: 'Tooth layers, pulp and nerve highlighted' },
  root: { layered: true, spread: 1, focus: 'root', scale: 1.05, alt: 'Tooth layers, roots highlighted' },
  straighten: { image: '/images/sequence/braces.webp', scale: 1, alt: 'Lower arch fitted with orthodontic braces' },
  emergency: { image: '/images/sequence/cracked.webp', scale: 1, alt: 'A molar with a visible crack running down the crown' },
  whole: { image: '/images/sequence/final.webp', scale: 1, alt: 'A whole, intact molar tooth' },
}

/**
 * Vertical position of a layer for a given spread, as a fraction of the frame.
 *
 * At spread 0 the parts nest toward the centre into a whole tooth; at 1 they
 * sit in the arrangement the source image was generated with.
 */
function placeTop(layer: { top: number; height: number }, spread: number) {
  const fromMiddle = layer.top + layer.height / 2 - 0.5
  return 0.5 + fromMiddle * (0.35 + spread * 0.65) - layer.height / 2
}

/** Aspect ratio of the source frame, so the layers keep their arrangement. */
const FRAME_RATIO = layers.frame.width / layers.frame.height

export function ImageStage({ progressRef }: { progressRef: React.RefObject<number> }) {
  const [beatId, setBeatId] = useState('hero')
  const [isNarrow, setIsNarrow] = useState(false)
  const raf = useRef(0)

  // The stage has a whole half to itself on desktop and can push in hard; on a
  // phone it sits behind the copy, where a big zoom would just crowd the text.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsNarrow(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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

  /**
   * Where the focused layer sits once `spread` has been applied, and how far
   * the frame must move to centre it. Mirrors the placement maths below, so
   * the two cannot drift apart.
   */
  const focused = scene.focus
    ? layers.layers.find((l) => l.name === scene.focus)
    : undefined
  const focusZoom = focused ? (isNarrow ? 1.2 : 1.85) : 1
  const focusShiftY = focused
    ? -(placeTop(focused, scene.spread ?? 0) + focused.height / 2 - 0.5) * 100
    : 0

  // The copy sits on one side; the subject takes the other. Giving it its own
  // half makes the separation structural rather than a tuned nudge that has to
  // be re-guessed for every viewport width.
  const copyOnLeft = beat.side !== 'right'

  return (
    <div
      className="stage-area pointer-events-none absolute flex items-center justify-center overflow-hidden transition-[left,right] duration-[1200ms] ease-out"
      style={
        {
          /*
            The half opposite the copy, with the subject CENTRED in it. The
            custom properties are consumed only above the md breakpoint - on a
            phone .stage-area goes full bleed, because splitting a 320px
            viewport in half leaves two unusable columns.
          */
          '--stage-left': copyOnLeft ? '47%' : '8%',
          '--stage-right': copyOnLeft ? '8%' : '47%',
        } as React.CSSProperties
      }
    >
      <div
        className="relative h-full max-h-full transition-transform duration-[1200ms] ease-out md:h-[74%] md:max-h-[74vh]"
        style={{
          aspectRatio: FRAME_RATIO,
          /*
            Zoom onto the layer this beat is about.

            The stack is shifted so the focused layer sits at the centre of the
            frame, then scaled in. Without the shift, scaling just magnifies the
            middle of the assembly and pushes the part being described off
            screen - the camera has to follow the subject, not the object.
          */
          transform: [
            `translateY(${focusShiftY}%)`,
            `scale(${scene.scale * focusZoom})`,
          ].join(' '),
        }}
      >
        {/* Full-frame scenes: skull, jaw, braces, whole tooth. */}
        {(['hero', 'intro', 'enamel', 'dentin', 'straighten', 'emergency', 'whole'] as const).map((id) => {
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
          const top = placeTop(layer, scene.spread ?? 0)

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
