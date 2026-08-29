import { describe, it, expect } from 'vitest'
import { clinic } from '@/content/clinic'
import { team } from '@/content/team'
import { services } from '@/content/services'
import { pricingINR, pricingUSD } from '@/content/pricing'
import { statsHome, statsInner } from '@/content/stats'
import { posts, getPost } from '@/content/posts'
import { testimonials } from '@/content/testimonials'

describe('clinic', () => {
  it('exposes contact facts exactly as the legacy site had them', () => {
    expect(clinic.phone.display).toBe('+91 95878 15285')
    expect(clinic.phone.tel).toBe('tel:+919587815285')
    expect(clinic.phone.whatsapp).toBe('919587815285')
    expect(clinic.email).toBe('info@ekdantay.com')
  })

  it('uses a WhatsApp number that is digits only', () => {
    // wa.me rejects "+" and spaces; this is the bug class that silently
    // produces a dead link, so assert the shape rather than trust it.
    expect(clinic.phone.whatsapp).toMatch(/^\d{10,15}$/)
  })

  it('carries the real Sawai Madhopur address, not the template one', () => {
    const joined = clinic.address.lines.join(' ')
    expect(joined).toContain('Sawai Madhopur')
    expect(joined).toContain('322001')
    expect(joined).not.toContain('Fake St')
    expect(joined).not.toContain('San Francisco')
  })

  it('records opening hours in 24-hour form for slot generation', () => {
    expect(clinic.hours.weekdays.open).toBe('10:30')
    expect(clinic.hours.weekdays.close).toBe('17:30')
    expect(clinic.hours.sunday.open).toBe('12:00')
    expect(clinic.hours.sunday.close).toBe('16:00')
  })
})

describe('team', () => {
  it('carries all eight staff ported from the legacy site', () => {
    expect(team).toHaveLength(8)
  })

  it('flags exactly the four genuine staff as real', () => {
    expect(team.filter((m) => m.real).map((m) => m.name)).toEqual([
      'Dr. Divya Bharti',
      'Dr. Yamini Sharma',
      'Gungun Rajput',
      'Vijay Gurjar',
    ])
  })

  it('keeps the four template entries flagged so cleanup is a filter', () => {
    const placeholders = team.filter((m) => !m.real).map((m) => m.name)
    expect(placeholders).toContain('Ivan Dorchsner')
    expect(placeholders).toHaveLength(4)
  })
})

describe('pricing', () => {
  it('keeps rupee pricing for the homepage', () => {
    expect(pricingINR).toHaveLength(4)
    expect(pricingINR[0].amount).toBe('₹800')
    expect(pricingINR.every((t) => t.amount.startsWith('₹'))).toBe(true)
  })

  it('ports the template dollar tiers verbatim, identical features included', () => {
    expect(pricingUSD).toHaveLength(4)
    expect(pricingUSD.map((t) => t.amount)).toEqual([
      '$24.50',
      '$34.50',
      '$54.50',
      '$89.50',
    ])
    // All four tiers listing the same features is the original defect,
    // deliberately preserved. Assert it so a later "fix" is a visible change.
    const first = JSON.stringify(pricingUSD[0].features)
    expect(pricingUSD.every((t) => JSON.stringify(t.features) === first)).toBe(true)
  })
})

describe('stats', () => {
  it('keeps both contradictory sets so each page renders what it did before', () => {
    expect(statsHome.find((s) => s.label === 'Qualified Dentists')?.value).toBe(2)
    expect(statsInner.find((s) => s.label === 'Qualified Dentist')?.value).toBe(4500)
  })
})

describe('services', () => {
  it('covers all six services offered', () => {
    expect(services).toHaveLength(6)
    expect(services.map((s) => s.slug)).toContain('emergency-care')
  })

  it('gives every service a unique slug', () => {
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length)
  })
})

describe('posts', () => {
  it('ports all eleven legacy entries', () => {
    expect(posts).toHaveLength(11)
  })

  it('gives every post a unique slug despite identical titles', () => {
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length)
  })

  it('resolves a post by slug and returns undefined for an unknown one', () => {
    expect(getPost('post-1')?.slug).toBe('post-1')
    expect(getPost('nope')).toBeUndefined()
  })
})

describe('testimonials', () => {
  it('ports the five template testimonials verbatim', () => {
    expect(testimonials).toHaveLength(5)
    expect(testimonials.every((t) => t.name === 'Dennis Green')).toBe(true)
  })
})
