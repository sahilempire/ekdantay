import { ImageResponse } from 'next/og'
import { clinic } from '@/content/clinic'

export const alt = `${clinic.name}, dental clinic in Sawai Madhopur`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The card WhatsApp, Facebook and X show when the site is shared.
 *
 * The site declared `twitter:card: summary_large_image` and then supplied no
 * image at all, so every share rendered as a bare link. Generating it here
 * rather than shipping a PNG means it stays in step with the palette and the
 * clinic details, which are the two things that would otherwise go stale.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F3EFE8',
          padding: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#0F6B5C',
              display: 'flex',
            }}
          />
          {/* Satori requires an explicit display on any element with more
              than one child, and this one has a text node beside a span. */}
          <div style={{ display: 'flex', gap: 0, fontSize: 40, color: '#1F1B16', letterSpacing: -1 }}>
            <span>Ekdan</span>
            <span style={{ color: '#0F6B5C' }}>tay</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 72, color: '#1F1B16', lineHeight: 1.05, letterSpacing: -2 }}>
            Modern dentistry in a calm
          </div>
          <div style={{ fontSize: 72, color: '#1F1B16', lineHeight: 1.05, letterSpacing: -2 }}>
            and relaxed environment
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '2px solid #DFD7CB',
            paddingTop: 32,
            fontSize: 28,
            color: '#4A4239',
          }}
        >
          <div style={{ display: 'flex' }}>Sawai Madhopur, Rajasthan</div>
          <div style={{ display: 'flex', color: '#0F6B5C' }}>{clinic.phone.display}</div>
        </div>
      </div>
    ),
    size,
  )
}
