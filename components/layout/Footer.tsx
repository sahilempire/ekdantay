import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '@/components/ui/BrandIcons'
import { clinic } from '@/content/clinic'
import { posts } from '@/content/posts'
import { hoursSummary } from '@/lib/hours'
import { Container } from '@/components/ui/Container'
import { NAV } from '@/content/nav'

/**
 * Written once and rendered on every route.
 *
 * On the legacy site each page carried its own copy of this markup, which is
 * how four footers ended up showing a San Francisco address and a
 * "+2 392 3929 210" phone number while three showed the real ones. Everything
 * here reads from `clinic`, so that cannot drift again.
 */
export function Footer() {
  const recent = posts.slice(0, 2)
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-semibold">
              Ekdan<span className="text-accent">tay</span>
            </p>
            <p className="mt-4 text-sm text-ink-soft">{clinic.tagline}</p>
            <div className="mt-6 flex gap-3">
              <a
                href={clinic.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ekdantay on Facebook"
                className="rounded-full border border-line p-2.5 text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href={clinic.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ekdantay on Instagram"
                className="rounded-full border border-line p-2.5 text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>

          <nav aria-labelledby="footer-links">
            <h2 id="footer-links" className="text-sm font-semibold uppercase tracking-[0.12em]">
              Quick Links
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Recent Blog</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {recent.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <p className="line-clamp-2 text-sm text-ink-soft transition-colors group-hover:text-accent">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(post.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Clinic</h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-ink-soft">
              <li className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <address className="not-italic">
                  {clinic.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <a href={clinic.phone.tel} className="tabular transition-colors hover:text-accent">
                  {clinic.phone.display}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <a
                  href={`mailto:${clinic.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {clinic.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <div>
                  {hoursSummary().map(({ label, value }) => (
                    <span key={label} className="block">
                      <span className="text-ink">{label}</span>{' '}
                      <span className="tabular">{value}</span>
                    </span>
                  ))}
                  <span className="mt-1 block text-xs text-muted">
                    {clinic.hours.emergency}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {clinic.name}. All rights reserved.
          </p>
          <p>
            Website by{' '}
            <a
              href={clinic.credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft underline transition-colors hover:text-accent"
            >
              {clinic.credit.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
