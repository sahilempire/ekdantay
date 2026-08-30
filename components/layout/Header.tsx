'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { clinic } from '@/content/clinic'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { NAV } from '@/content/nav'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer on navigation, and lock scroll while it is open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'bg-transparent'
      } ${'stage-aware'}`}
    >
      <Container>
        <div className="flex h-18 items-center justify-between gap-4 py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight">
            Ekdan<span className="text-accent">tay</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map(({ href, label }) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${
                        active ? 'text-accent' : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={clinic.phone.tel}
              className="hidden items-center gap-2 text-sm text-ink-soft transition-colors hover:text-accent sm:flex"
            >
              <Phone size={15} aria-hidden />
              <span className="tabular">{clinic.phone.display}</span>
            </a>

            {/*
              Wrapped rather than given `hidden sm:inline-flex` directly.
              Button's base class sets `inline-flex`, and Tailwind resolves
              conflicting display utilities by stylesheet order, not by the
              order they appear in the class attribute - so `hidden` lost and
              the button rendered on phones, wrapping to two lines.
            */}
            <span className="hidden sm:inline-flex">
              <ButtonLink href="/contact">Book Appointment</ButtonLink>
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              className="rounded-full p-2 text-ink lg:hidden"
            >
              <Menu size={22} aria-hidden />
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-0 z-50 bg-paper lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <Container>
            <div className="flex h-18 items-center justify-between py-4">
              <span className="font-display text-xl font-semibold">
                Ekdan<span className="text-accent">tay</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-2"
              >
                <X size={22} aria-hidden />
              </button>
            </div>

            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1 pt-4">
                {NAV.map(({ href, label }) => {
                  const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={`block border-b border-line py-4 font-display text-2xl ${
                          active ? 'text-accent' : 'text-ink'
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-3 pt-8">
              <ButtonLink href="/contact" size="lg">
                Book Appointment
              </ButtonLink>
              <ButtonLink href={clinic.phone.tel} variant="outline" size="lg">
                <Phone size={16} aria-hidden />
                {clinic.phone.display}
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
