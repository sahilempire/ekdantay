import { clinic } from '@/content/clinic'

/**
 * Plain Google Maps embed - no API key, no JS SDK.
 *
 * The legacy setup was doubly broken: initMap() was never called (no
 * callback parameter, no direct invocation) so the map never rendered, while
 * the Maps JS API loaded on six pages, five of which had no map container at
 * all. That key was public in the page source and billable.
 */
export function MapEmbed({ height = 420 }: { height?: number }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    clinic.address.mapQuery,
  )}&output=embed`

  return (
    <iframe
      src={src}
      title={`Map showing ${clinic.name}`}
      width="100%"
      height={height}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      style={{ border: 0, display: 'block' }}
    />
  )
}
