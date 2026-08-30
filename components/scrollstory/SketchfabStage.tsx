'use client'

import { useEffect, useRef, useState } from 'react'
import { BEATS, resolveBeat, type LayerName } from './beats'

/**
 * The scroll stage driven by an embedded Sketchfab model.
 *
 * A view-only model cannot be downloaded, but it can legitimately be embedded,
 * and the Viewer API exposes everything the sequence needs: show/hide per node,
 * setCameraLookAt for the fly-through, and setMaterial for fading. That gives
 * us a properly modelled four-layer tooth instead of layers derived by
 * offsetting one scan's surface, which is what produced every artifact so far.
 *
 * Camera positions are computed as an ORBIT around whatever the model's own
 * default framing is, rather than absolute coordinates. We do not know this
 * model's scale or origin, and reading its initial camera and working relative
 * to that is scale-independent - the same beat definitions would work against
 * a different model.
 */

const VIEWER = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js'
const MODEL_UID = '9cc281349c314cc4859e26af238f9cd5' // Ebers, "Tooth cross-section"

/**
 * Substrings matched against node names to decide which anatomical layer a
 * node belongs to. Checked in order. Anything unmatched stays visible at all
 * times, so an unexpected naming scheme degrades to "model shows but layers do
 * not toggle" rather than a blank frame.
 */
const MATCHERS: Record<LayerName, string[]> = {
  enamel: ['enamel', 'schmelz', 'crown'],
  dentin: ['dentin', 'dentine', 'ivory'],
  pulp: ['pulp', 'nerve', 'vascular', 'vessel', 'artery', 'vein', 'canal'],
  root: ['root', 'cementum', 'radix'],
}

function classify(name: string): LayerName | null {
  const n = (name || '').toLowerCase()
  for (const key of Object.keys(MATCHERS) as LayerName[]) {
    if (MATCHERS[key].some((alias) => n.includes(alias))) return key
  }
  return null
}

type Vec3 = [number, number, number]

interface ApiLike {
  start(): void
  addEventListener(evt: string, cb: () => void): void
  getNodeMap(cb: (err: unknown, map: Record<string, { instanceID: number; name?: string; type?: string }>) => void): void
  getCameraLookAt(cb: (err: unknown, camera: { position: Vec3; target: Vec3 }) => void): void
  setCameraLookAt(eye: Vec3, target: Vec3, duration: number, cb?: () => void): void
  show(id: number): void
  hide(id: number): void
  setBackground(opts: Record<string, unknown>, cb?: () => void): void
}

export function SketchfabStage({ progressRef }: { progressRef: React.RefObject<number> }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const api = useRef<ApiLike | null>(null)
  const layerNodes = useRef<Record<LayerName, number[]>>({
    enamel: [], dentin: [], pulp: [], root: [],
  })
  const home = useRef<{ eye: Vec3; target: Vec3; radius: number } | null>(null)
  const lastBeat = useRef<string>('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = VIEWER
    script.async = true

    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Sketchfab = (window as any).Sketchfab
      if (!Sketchfab || !frame.current) return

      const client = new Sketchfab('1.12.1', frame.current)
      client.init(MODEL_UID, {
        autostart: 1,
        transparent: 1,
        // Strip the viewer's own chrome so it reads as our scene, not an embed.
        ui_infos: 0,
        ui_controls: 0,
        ui_stop: 0,
        ui_watermark_link: 0,
        ui_watermark: 0,
        ui_hint: 0,
        ui_ar: 0,
        ui_help: 0,
        ui_settings: 0,
        ui_vr: 0,
        ui_fullscreen: 0,
        ui_annotations: 0,
        ui_loading: 0,
        scrollwheel: 0,
        double_click: 0,
        preload: 1,
        success: (viewer: ApiLike) => {
          api.current = viewer
          viewer.start()
          viewer.addEventListener('viewerready', () => {
            viewer.getNodeMap((err, map) => {
              if (err || !map) return
              const buckets: Record<LayerName, number[]> = {
                enamel: [], dentin: [], pulp: [], root: [],
              }
              const seen: string[] = []
              for (const node of Object.values(map)) {
                if (!node?.name) continue
                seen.push(`${node.type}: ${node.name}`)
                const layer = classify(node.name)
                if (layer) buckets[layer].push(node.instanceID)
              }
              layerNodes.current = buckets

              const matched = (Object.keys(buckets) as LayerName[])
                .filter((k) => buckets[k].length)
                .map((k) => `${k}(${buckets[k].length})`)
              // Loud, because the mapping is the one thing that has to be
              // right and it depends on someone else's naming.
              console.info('[SketchfabStage] layers matched:', matched.join(' ') || 'NONE')
              if (!matched.length) console.info('[SketchfabStage] node names seen:', seen)
            })

            viewer.getCameraLookAt((err, cam) => {
              if (err || !cam) return
              const d: Vec3 = [
                cam.position[0] - cam.target[0],
                cam.position[1] - cam.target[1],
                cam.position[2] - cam.target[2],
              ]
              home.current = {
                eye: cam.position,
                target: cam.target,
                radius: Math.hypot(d[0], d[1], d[2]) || 1,
              }
              setReady(true)
            })
          })
        },
        error: () => console.warn('[SketchfabStage] viewer failed to initialise'),
      })
    }

    document.body.appendChild(script)
    return () => {
      script.remove()
      api.current = null
    }
  }, [])

  // Drive camera and layer visibility from scroll.
  useEffect(() => {
    if (!ready) return
    let frameId = 0

    const tick = () => {
      frameId = requestAnimationFrame(tick)
      const viewer = api.current
      const base = home.current
      if (!viewer || !base) return

      const progress = progressRef.current ?? 0
      const beat = resolveBeat(progress)
      if (beat.id === lastBeat.current) return
      lastBeat.current = beat.id

      // Peel outward layers away to reveal the one this beat describes.
      const buckets = layerNodes.current
      const hidden = beat.hideLayers ?? []
      for (const key of Object.keys(buckets) as LayerName[]) {
        const visible = !hidden.includes(key)
        for (const id of buckets[key]) {
          if (visible) viewer.show(id)
          else viewer.hide(id)
        }
      }

      /**
       * Orbit around the model's own default framing.
       *
       * Beat cameras are authored in our R3F world units, which mean nothing
       * here. Using their direction and relative distance instead keeps the
       * choreography while staying independent of this model's scale.
       */
      const c = beat.camera
      const len = Math.hypot(c.x, c.y, c.z) || 1
      const zoom = (c.z / 7) * base.radius
      const eye: Vec3 = [
        base.target[0] + (c.x / len) * zoom,
        base.target[1] + (c.y / len) * zoom,
        base.target[2] + (c.z / len) * zoom,
      ]
      viewer.setCameraLookAt(eye, base.target, 1.2)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [ready, progressRef])

  return (
    <iframe
      ref={frame}
      title="Tooth cross-section by Ebers on Sketchfab"
      className="pointer-events-none h-full w-full"
      allow="autoplay; fullscreen; xr-spatial-tracking"
      allowFullScreen
    />
  )
}
