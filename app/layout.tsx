import type { Metadata, Viewport } from 'next'
import { Fraunces, Figtree } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { clinic } from '@/content/clinic'
import './globals.css'

/**
 * Fraunces carries the warmth the direction calls for - it has soft, slightly
 * eccentric letterforms that read as cared-for rather than corporate, which is
 * the right register for a clinic whose main UX problem is patient anxiety.
 * Figtree is the neutral workhorse underneath it.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK'],
})

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ekdantay.com'),
  title: {
    default: `${clinic.name} — ${clinic.tagline}`,
    template: `%s — ${clinic.name}`,
  },
  description:
    'Dental care in Sawai Madhopur, Rajasthan. Cleanings, whitening, orthodontics, implants and emergency treatment.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EFE8' },
    { media: '(prefers-color-scheme: dark)', color: '#14110D' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
