import { clinic } from '@/content/clinic'
import { formatSlot } from './hours'

export interface BookingData {
  name: string
  phone: string
  service: string
  /** "YYYY-MM-DD" from the date input. */
  date: string
  /** "HH:MM" 24-hour, from getSlotsForDate. */
  time: string
  message?: string
}

/** "2026-09-07" -> "Mon, 7 Sep 2026". Falls back to the raw value if unparseable. */
export function formatBookingDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Compose the WhatsApp message a patient sends to the clinic.
 *
 * ---------------------------------------------------------------------------
 * TODO(ekdantay): this one is yours to write.
 *
 * This message is the clinic's first contact with a patient, so its tone and
 * field order are a business judgment rather than a technical one, and it is
 * the wrong thing for me to guess at.
 *
 * The trade-off to weigh: a terse message is faster for staff to scan on a
 * busy phone, but a fuller one avoids a follow-up round trip asking for
 * details the patient already typed. Consider also whether it opens in English
 * or Hindi, whether it should read as the patient's own words (it is sent
 * from their account, so it will look like something they wrote), and whether
 * an unfilled optional field should be omitted or shown as "not specified".
 *
 * Available: data.name, data.phone, data.service, data.date, data.time,
 * data.message. Helpers: formatBookingDate(data.date) -> "Mon, 7 Sep 2026",
 * formatSlot(data.time) -> "10:30 AM".
 *
 * Return plain text with real newlines. Encoding is handled by
 * buildWhatsAppUrl, so do not escape anything here.
 *
 * The stub below is a working placeholder so the form functions today.
 * ---------------------------------------------------------------------------
 */
export function buildWhatsAppMessage(data: BookingData): string {
  const lines = [
    `Hello ${clinic.name}, I would like to book an appointment.`,
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Service: ${data.service}`,
    `Preferred date: ${formatBookingDate(data.date)}`,
    `Preferred time: ${formatSlot(data.time)}`,
  ]

  if (data.message?.trim()) {
    lines.push(`Notes: ${data.message.trim()}`)
  }

  return lines.join('\n')
}

/**
 * Full wa.me deep link for a booking.
 *
 * wa.me requires the number as digits only - no "+", no spaces - which is why
 * clinic.phone.whatsapp is stored separately from the display and tel forms.
 */
export function buildWhatsAppUrl(data: BookingData): string {
  const text = encodeURIComponent(buildWhatsAppMessage(data))
  return `https://wa.me/${clinic.phone.whatsapp}?text=${text}`
}

/** Deep link with no prefilled booking, for the "chat with us" affordances. */
export function whatsAppContactUrl(): string {
  const text = encodeURIComponent(`Hello ${clinic.name}, I have a question.`)
  return `https://wa.me/${clinic.phone.whatsapp}?text=${text}`
}
