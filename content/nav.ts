/**
 * Site navigation.
 *
 * Lives here rather than in Header.tsx because Header is a client component:
 * when a server component (Footer) imports a plain value from a 'use client'
 * module, Next replaces it with a client reference and the array arrives as a
 * function proxy. Keeping shared data in a server-safe module avoids that
 * whole class of error.
 */
export interface NavItem {
  href: string
  label: string
}

export const NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]
