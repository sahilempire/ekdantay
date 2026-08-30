import type { NextConfig } from 'next'

/** Legacy .html paths kept alive so inbound links and search ranking survive. */
const legacyRedirects = [
  { from: '/index.html', to: '/' },
  { from: '/about.html', to: '/about' },
  { from: '/services.html', to: '/services' },
  { from: '/doctors.html', to: '/doctors' },
  { from: '/blog.html', to: '/blog' },
  { from: '/contact.html', to: '/contact' },
  // blog-single.html was a single lorem article, not a real post.
  { from: '/blog-single.html', to: '/blog' },
  // Never existed, but 12 links across the old site pointed at it.
  { from: '/teacher-single.html', to: '/doctors' },
]

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return legacyRedirects.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: true,
    }))
  },
}

export default nextConfig
