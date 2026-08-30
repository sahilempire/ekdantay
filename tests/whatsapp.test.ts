import { describe, it, expect } from 'vitest'
import {
  buildWhatsAppUrl,
  buildWhatsAppMessage,
  formatBookingDate,
  whatsAppContactUrl,
  type BookingData,
} from '@/lib/whatsapp'
import { clinic } from '@/content/clinic'

const booking: BookingData = {
  name: 'Asha Meena',
  phone: '+91 90000 11111',
  service: 'Teeth Cleaning',
  date: '2026-09-07',
  time: '10:30',
}

describe('buildWhatsAppUrl', () => {
  // These assertions are deliberately about the URL contract rather than the
  // message wording, so they keep passing when buildWhatsAppMessage is
  // rewritten by hand (see the TODO in lib/whatsapp.ts).
  it('targets the clinic number in the digits-only form wa.me requires', () => {
    const url = new URL(buildWhatsAppUrl(booking))
    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe(`/${clinic.phone.whatsapp}`)
    expect(url.pathname).not.toContain('+')
    expect(url.pathname).not.toContain(' ')
  })

  it('encodes the message so newlines and spaces survive the URL', () => {
    const raw = buildWhatsAppUrl(booking)
    // A literal newline or space in a URL breaks the link in most clients.
    expect(raw).not.toContain('\n')
    expect(raw.split('?text=')[1]).not.toContain(' ')
  })

  it('round-trips the message back out of the encoded parameter', () => {
    const url = new URL(buildWhatsAppUrl(booking))
    expect(url.searchParams.get('text')).toBe(buildWhatsAppMessage(booking))
  })

  it('encodes a "+" in user input rather than letting it become a space', () => {
    // "+" decodes to a space in query strings; if it is not encoded the
    // patient's phone number arrives mangled.
    const url = new URL(buildWhatsAppUrl(booking))
    expect(url.searchParams.get('text')).toContain('+91 90000 11111')
  })
})

describe('buildWhatsAppMessage', () => {
  it('includes every field the patient filled in', () => {
    const msg = buildWhatsAppMessage(booking)
    expect(msg).toContain('Asha Meena')
    expect(msg).toContain('Teeth Cleaning')
    expect(msg).toContain('+91 90000 11111')
  })

  it('includes optional notes when given and omits them when blank', () => {
    expect(buildWhatsAppMessage({ ...booking, message: 'Sensitive teeth' })).toContain(
      'Sensitive teeth',
    )
    expect(buildWhatsAppMessage({ ...booking, message: '   ' })).not.toContain('Notes:')
  })

  it('returns plain text, not pre-encoded', () => {
    expect(buildWhatsAppMessage(booking)).not.toContain('%20')
  })
})

describe('formatBookingDate', () => {
  it('renders an ISO date in a form a person reads', () => {
    expect(formatBookingDate('2026-09-07')).toContain('Sep')
    expect(formatBookingDate('2026-09-07')).toContain('2026')
  })

  it('falls back to the raw value rather than throwing on bad input', () => {
    expect(formatBookingDate('not-a-date')).toBe('not-a-date')
  })
})

describe('whatsAppContactUrl', () => {
  it('produces a valid prefilled link with no booking data', () => {
    const url = new URL(whatsAppContactUrl())
    expect(url.pathname).toBe(`/${clinic.phone.whatsapp}`)
    expect(url.searchParams.get('text')).toContain(clinic.name)
  })
})
