import { describe, it, expect } from 'vitest'
import { getSlotsForDate, isOpenOn, formatSlot } from '@/lib/hours'

// 2026-09-07 is a Monday, 2026-09-06 a Sunday. Constructed with an explicit
// local midnight so the weekday is not shifted by the runner's timezone.
const monday = new Date('2026-09-07T00:00:00')
const sunday = new Date('2026-09-06T00:00:00')
const saturday = new Date('2026-09-05T00:00:00')

describe('getSlotsForDate', () => {
  it('never offers a slot before the 10:30 weekday opening', () => {
    const slots = getSlotsForDate(monday)
    expect(slots[0]).toBe('10:30')
    // These three were bookable on the legacy site despite the clinic
    // being shut. That is the bug this function exists to make impossible.
    expect(slots).not.toContain('09:00')
    expect(slots).not.toContain('09:30')
    expect(slots).not.toContain('10:00')
  })

  it('stops before the weekday closing time', () => {
    const slots = getSlotsForDate(monday)
    expect(slots.at(-1)).toBe('17:00')
    expect(slots).not.toContain('17:30')
  })

  it('treats Saturday as a weekday', () => {
    expect(getSlotsForDate(saturday)).toEqual(getSlotsForDate(monday))
  })

  it('uses the shorter Sunday window', () => {
    const slots = getSlotsForDate(sunday)
    expect(slots[0]).toBe('12:00')
    expect(slots.at(-1)).toBe('15:30')
    expect(slots).not.toContain('10:30')
    expect(slots).not.toContain('16:00')
  })

  it('produces slots at 30 minute intervals', () => {
    const slots = getSlotsForDate(monday)
    expect(slots.slice(0, 4)).toEqual(['10:30', '11:00', '11:30', '12:00'])
  })

  it('generates every slot in ascending order with no duplicates', () => {
    const slots = getSlotsForDate(monday)
    expect([...slots].sort()).toEqual(slots)
    expect(new Set(slots).size).toBe(slots.length)
  })
})

describe('isOpenOn', () => {
  it('reports the clinic open every day of the week', () => {
    expect(isOpenOn(monday)).toBe(true)
    expect(isOpenOn(sunday)).toBe(true)
  })
})

describe('formatSlot', () => {
  it('renders 24-hour values as 12-hour labels for patients', () => {
    expect(formatSlot('10:30')).toBe('10:30 AM')
    expect(formatSlot('12:00')).toBe('12:00 PM')
    expect(formatSlot('12:30')).toBe('12:30 PM')
    expect(formatSlot('17:00')).toBe('5:00 PM')
  })
})
