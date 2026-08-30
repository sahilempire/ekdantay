import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { PageHero } from '@/components/sections/PageHero'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { AppointmentForm } from '@/components/booking/AppointmentForm'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { clinic } from '@/content/clinic'
import { hoursSummary } from '@/lib/hours'

export const metadata: Metadata = {
  title: 'Contact & Booking',
  description: `Book an appointment at ${clinic.name}, Sawai Madhopur. Call ${clinic.phone.display} or send your booking on WhatsApp.`,
}

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero title="Contact Us" crumb="Contact" />

      <Container className="py-20">
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl">Book an appointment</h2>
            <p className="mt-3 text-ink-soft">
              Fill this in and it opens WhatsApp with your details ready to send. We reply
              in the chat to confirm.
            </p>
            <div className="mt-8">
              <AppointmentForm />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-2xl">Visit the clinic</h2>
            <ul className="mt-8 flex flex-col gap-6 text-sm">
              <li className="flex gap-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <address className="not-italic text-ink-soft">
                  {clinic.address.lines.map((l) => <span key={l} className="block">{l}</span>)}
                </address>
              </li>
              <li className="flex gap-4">
                <Phone size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <a href={clinic.phone.tel} className="tabular text-ink-soft transition-colors hover:text-accent">
                  {clinic.phone.display}
                </a>
              </li>
              <li className="flex gap-4">
                <Mail size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <a href={`mailto:${clinic.email}`} className="text-ink-soft transition-colors hover:text-accent">
                  {clinic.email}
                </a>
              </li>
              <li className="flex gap-4">
                <Clock size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <div className="text-ink-soft">
                  {hoursSummary().map(({ label, value }) => (
                    <span key={label} className="block">
                      <span className="text-ink">{label}</span> <span className="tabular">{value}</span>
                    </span>
                  ))}
                  <span className="mt-1 block text-xs text-muted">{clinic.hours.emergency}</span>
                </div>
              </li>
            </ul>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              <MapEmbed height={340} />
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  )
}
