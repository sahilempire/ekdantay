'use client'

import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/ui/Container'

/**
 * Temporary probe for an embedded Sketchfab model.
 *
 * Sketchfab's viewer refuses to start without hardware WebGL, so it cannot be
 * inspected from a headless browser. This page runs the Viewer API in a real
 * one and prints the node map, which is the only thing that settles whether a
 * model's anatomical layers are separately addressable or a single mesh with
 * the interior painted on.
 *
 * Delete this route once the model question is decided.
 */

const VIEWER = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js'

const CANDIDATES = [
  {
    uid: '9cc281349c314cc4859e26af238f9cd5',
    name: 'Tooth cross-section',
    author: 'Ebers',
    note: '8 materials, 288k faces. Described as 4 layers: enamel, dentin, pulp, neurovascular bundle. No stated licence.',
  },
  {
    uid: '3f5afc9d2e4b4b28b3459afffab050c3',
    name: 'Orofacial anatomy with blood and nerve supply',
    author: 'Ebers',
    note: '9 materials, 758k faces. Sketchfab Standard licence, which permits commercial use. Whole jaw region, so heavier than a single tooth needs.',
  },
  {
    uid: 'afa26449757e41dbbbeb9a8eba7da940',
    name: 'Human Tooth Anatomy',
    author: 'arloopa',
    note: 'Only 1 material, so its layers cannot be separately addressable. Included for completeness.',
  },
]

interface Node {
  id: number
  name: string
  type: string
}

export default function ModelTest() {
  const [pick, setPick] = useState(0)
  const frame = useRef<HTMLIFrameElement>(null)
  const [nodes, setNodes] = useState<Node[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('loading viewer script...')
  const apiRef = useRef<unknown>(null)

  const current = CANDIDATES[pick]

  useEffect(() => {
    setNodes(null)
    setError(null)
    setStatus('loading viewer script...')
    const script = document.createElement('script')
    script.src = VIEWER
    script.onload = () => {
      setStatus('initialising viewer...')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Sketchfab = (window as any).Sketchfab
      if (!Sketchfab) return setError('viewer script loaded but Sketchfab global missing')

      const client = new Sketchfab('1.12.1', frame.current)
      client.init(current.uid, {
        autostart: 1,
        transparent: 1,
        ui_infos: 0,
        ui_controls: 0,
        ui_stop: 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        success: (api: any) => {
          apiRef.current = api
          api.start()
          api.addEventListener('viewerready', () => {
            setStatus('viewer ready, reading node map...')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            api.getNodeMap((err: unknown, map: Record<string, any>) => {
              if (err) return setError(String(err))
              const list = Object.values(map).map((n) => ({
                id: n.instanceID,
                name: n.name ?? '(unnamed)',
                type: n.type,
              }))
              setNodes(list)
              setStatus(`ready — ${list.length} nodes`)
            })
          })
        },
        error: () => setError('viewer failed to initialise'),
      })
    }
    script.onerror = () => setError('could not load the Sketchfab viewer script')
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [current.uid])

  const named = nodes?.filter((n) => n.name && n.name !== '(unnamed)') ?? []

  return (
    <main id="main" className="py-16">
      <Container>
        <h1 className="text-3xl">Model probe</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Checks whether each embedded model&rsquo;s layers are separately
          addressable. Pick one, wait for it to load, then copy the node list
          below and send it back.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {CANDIDATES.map((c, i) => (
            <button
              key={c.uid}
              type="button"
              onClick={() => setPick(i)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                i === pick
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line text-ink-soft hover:border-accent'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <p className="mt-4 max-w-2xl text-sm text-muted">
          <strong className="text-ink">{current.name}</strong> by {current.author}. {current.note}
        </p>

        <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-line bg-surface">
          <iframe
            ref={frame}
            title={current.name}
            className="h-full w-full"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>

        <p className="mt-4 text-sm text-muted">
          Status: <span className="text-ink">{status}</span>
          {error && <span className="text-danger"> — {error}</span>}
        </p>

        {named.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl">
              {named.length} named nodes
            </h2>
            <pre className="mt-4 max-h-96 overflow-auto rounded-xl border border-line bg-surface p-5 text-xs leading-relaxed">
              {named.map((n) => `[${n.type}] ${n.name}`).join('\n')}
            </pre>
          </div>
        )}

        <p className="mt-8 text-xs text-muted">
          &ldquo;{current.name}&rdquo; by {current.author} on Sketchfab.
        </p>
      </Container>
    </main>
  )
}
