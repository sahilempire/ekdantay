import type { Metadata, Viewport } from 'next'
import { Fraunces, Figtree } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { clinic } from '@/content/clinic'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { SITE_URL } from '@/lib/seo'
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

const DESCRIPTION =
  'Dental clinic in Sawai Madhopur, Rajasthan. Checkups, cleaning, teeth whitening, braces, dental implants, root canal treatment and 24/7 emergency care.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${clinic.name} | Dentist in Sawai Madhopur`,
    template: `%s | ${clinic.name}`,
  },
  description: DESCRIPTION,

  /*
    No `alternates.canonical` here, deliberately.

    Next inherits alternates down the route tree, so the `canonical: '/'` that
    used to sit here was emitted on every page: /about, /services, /contact and
    every blog post all told Google they were duplicates of the homepage. The
    whole site was instructing search engines to de-index all of itself bar one
    page. Each route now declares its own via lib/seo's pageUrl(), and a route
    that forgets ships no canonical at all, which Google handles harmlessly.
  */

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: clinic.name,
    title: `${clinic.name} | Dentist in Sawai Madhopur`,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google use full-length text snippets, any image size and full
      // video previews. Without this it applies conservative defaults, and a
      // truncated snippet is a worse result for a query we want to win.
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3EFE8' },
    { media: '(prefers-color-scheme: dark)', color: '#14110D' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
