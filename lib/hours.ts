import { clinic } from '@/content/clinic'
import type { DayHours } from '@/content/types'

const SLOT_MINUTES = 30

/** "HH:MM" -> minutes since midnight. */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Minutes since midnight -> "HH:MM". */
function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Sunday is 0 in JS. Every other day uses the weekday window. */
function hoursFor(date: Date): DayHours {
  return date.getDay() === 0 ? clinic.hours.sunday : clinic.hours.weekdays
}

export function isOpenOn(_date: Date): boolean {
  // Ekdantay opens seven days a week; the windows differ but none is closed.
  // Kept as a function so a future closure is one edit, not a scattered change.
  return true
}

/**
 * Bookable appointment times for a given date, as 24-hour "HH:MM" strings.
 *
 * Derived from `clinic.hours` rather than hard-coded, which is what makes it
 * impossible to reintroduce the legacy defect: the old form offered 09:00,
 * 09:30 and 10:00 from a static option list while the clinic opened at 10:30.
 *
 * Inclusive of the opening time, exclusive of the closing time - the last slot
 * starts one interval before close so the appointment fits inside opening
 * hours.
 */
export function getSlotsForDate(date: Date): string[] {
  if (!isOpenOn(date)) return []

  const { open, close } = hoursFor(date)
  const start = toMinutes(open)
  const end = toMinutes(close)

  const slots: string[] = []
  for (let t = start; t + SLOT_MINUTES <= end; t += SLOT_MINUTES) {
    slots.push(toHHMM(t))
  }
  return slots
}

/** "17:00" -> "5:00 PM". Patients read 12-hour time; the value stays 24-hour. */
export function formatSlot(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

/** Today as "YYYY-MM-DD" in local time, for a date input's `min`. */
export function todayISO(): string {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

/** Parse a date input's "YYYY-MM-DD" as local midnight, not UTC. */
export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

/** The opening-hours lines shown in the header and footer. */
export function hoursSummary(): { label: string; value: string }[] {
  const fmt = (h: DayHours) => `${formatSlot(h.open)} to ${formatSlot(h.close)}`
  return [
    { label: clinic.hours.weekdays.label, value: fmt(clinic.hours.weekdays) },
    { label: clinic.hours.sunday.label, value: fmt(clinic.hours.sunday) },
  ]
}
