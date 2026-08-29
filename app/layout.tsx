import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ekdantay Dental Clinic',
  description: 'Dental care in Sawai Madhopur, Rajasthan.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
