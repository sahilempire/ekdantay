'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { resolveBeat } from './beats'
import { SCENES, FULL_FRAME, FRAME_RATIO, LAYERS, placeTop } from './scenes'

/**
 * The scroll stage, driven by pre-rendered images rather than real-time 3D.
 *
 * Apple's product scrolls work this way - the AirPods page is a frame
 * sequence, not WebGL - and the reasons apply here exactly. The whole set is
 * about 1.2 MB against 2,957 KB for the GLB plus the three.js chunk, it needs
 * no WebGL so it behaves identically on low-end Android, and every artifact
 * the derived geometry suffered from (torn seams, open rims, scattering parts)
 * simply cannot occur in an image.
 *
 * What each beat shows lives in scenes.ts. Layer positions come from
 * layers.json, emitted by the processing script, so the exploded arrangement
 * is rebuilt from where the parts actually sat in the source rather than from
 * hand-typed coordinates that would rot the moment the images are regenerated.
 */
export function ImageStage({ progressRef }: { progressRef: React.RefObject<number> }) {
  const [beatId, setBeatId] = useState('hero')
  const [isNarrow, setIsNarrow] = useState(false)
  const raf = useRef(0)

  // The stage has a whole half to itself on desktop and can push in hard; on a
  // phone it sits above the copy, where a big zoom would just crowd the text.
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
   * the frame must move to centre it. Uses the same placeTop as the layer
   * positioning below, so the camera and the subject cannot drift apart.
   */
  const focused = scene.focus ? LAYERS.find((l) => l.name === scene.focus) : undefined
  /*
    Phones need a harder push than the ratio suggests. The stage band is 46% of
    a portrait viewport, so the frame is height-constrained and a tall exploded
    stack ends up small inside it, with the layer beats reading as emptier than
    the treatment beats beside them. Parts that leave the band are clipped,
    which is the point: this is a close-up of one layer.
  */
  const focusZoom = focused ? (isNarrow ? 1.55 : 1.85) : 1
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
            The half opposite the copy, with the subject CENTRED in it. These
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
        {/* Full-frame scenes: skull, jaw, cross-section, and every treatment. */}
        {FULL_FRAME.map((id) => {
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

          `spread` scales each layer's distance from the centre of the stack.
          It climbs across the four layer beats, so the tooth opens gradually
          as you scroll rather than snapping apart at one of them.
        */}
        {LAYERS.map((layer) => {
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
