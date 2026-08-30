import { describe, it, expect } from 'vitest'
import { clinic } from '@/content/clinic'
import { team } from '@/content/team'
import { services } from '@/content/services'
import { pricingINR, pricingUSD } from '@/content/pricing'
import { statsHome, statsInner } from '@/content/stats'
import { posts, getPost, categories, readingMinutes, wordCount, relatedPosts } from '@/content/posts'
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
  it('gives every post a unique slug', () => {
    expect(new Set(posts.map((p) => p.slug)).size).toBe(posts.length)
  })

  it('resolves a post by slug and returns undefined for an unknown one', () => {
    expect(getPost('how-a-cavity-forms')?.slug).toBe('how-a-cavity-forms')
    expect(getPost('nope')).toBeUndefined()
  })

  it('carries no trace of the lorem articles it replaced', () => {
    // Eleven URLs of identical placeholder text was the single worst SEO
    // liability on the site. Assert it can never come back.
    const all = JSON.stringify(posts)
    expect(all).not.toContain('Vokalia')
    expect(all).not.toContain('blind texts')
    expect(posts.some((p) => p.author === 'Admin')).toBe(false)
  })

  it('gives every post a unique title and description', () => {
    // Duplicate titles or meta descriptions across URLs is exactly what the
    // old blog did wrong, and it is invisible until Search Console flags it.
    expect(new Set(posts.map((p) => p.title)).size).toBe(posts.length)
    expect(new Set(posts.map((p) => p.description)).size).toBe(posts.length)
  })

  it('keeps every meta description within the length Google will render', () => {
    for (const p of posts) {
      expect(p.description.length).toBeGreaterThan(70)
      expect(p.description.length).toBeLessThanOrEqual(320)
    }
  })

  it('keeps search titles short enough not to be truncated', () => {
    for (const p of posts) {
      expect((p.seoTitle ?? p.title).length).toBeLessThanOrEqual(65)
    }
  })

  it('gives every post an h1, an image with real alt text and a category', () => {
    for (const p of posts) {
      expect(p.title.length).toBeGreaterThan(10)
      expect(p.image).toMatch(/^\/images\//)
      expect(p.imageAlt.length).toBeGreaterThan(10)
      expect(p.category.length).toBeGreaterThan(2)
    }
  })

  it('writes substantial articles rather than thin pages', () => {
    // Thin content ranks badly and can drag a whole domain down with it.
    for (const p of posts) {
      expect(wordCount(p)).toBeGreaterThan(600)
      expect(readingMinutes(p)).toBeGreaterThanOrEqual(3)
    }
  })

  it('starts every article body with prose, not a heading', () => {
    // An h2 immediately under the h1 with nothing between them reads as a
    // broken page to a crawler and to a person.
    for (const p of posts) {
      expect(p.body[0].kind).toBe('p')
    }
  })

  it('cites a source for every article and for every pulled-out figure', () => {
    for (const p of posts) {
      expect(p.sources?.length ?? 0).toBeGreaterThan(0)
      for (const s of p.sources ?? []) expect(s.url).toMatch(/^https:\/\//)
      for (const b of p.body) {
        if (b.kind === 'figure') expect(b.source.length).toBeGreaterThan(3)
      }
    }
  })

  it('gives every article an FAQ, which is what earns the rich result', () => {
    for (const p of posts) {
      expect(p.faq?.length ?? 0).toBeGreaterThanOrEqual(3)
      for (const f of p.faq ?? []) {
        expect(f.q.endsWith('?')).toBe(true)
        expect(f.a.length).toBeGreaterThan(40)
      }
    }
  })

  it('never links to a related slug that does not exist', () => {
    const slugs = new Set(posts.map((p) => p.slug))
    for (const p of posts) {
      for (const r of p.related ?? []) expect(slugs.has(r)).toBe(true)
      expect(p.related ?? []).not.toContain(p.slug)
    }
  })

  it('always fills the related-posts grid, even without hand-picked links', () => {
    for (const p of posts) {
      const rel = relatedPosts(p, 2)
      expect(rel).toHaveLength(2)
      expect(rel.some((r) => r.slug === p.slug)).toBe(false)
    }
  })

  it('maps each service to exactly one explainer article', () => {
    // The services grid resolves this with an exact match. Two posts claiming
    // the same service would make which one gets linked arbitrary, and none
    // claiming it would silently drop the link, so assert the bijection.
    const claimed = posts.map((p) => p.service).filter(Boolean) as string[]
    expect(new Set(claimed).size).toBe(claimed.length)

    const offered = services.map((s) => s.slug)
    for (const c of claimed) expect(offered).toContain(c)
    for (const slug of offered) {
      expect(claimed, `no article explains "${slug}"`).toContain(slug)
    }
  })

  it('groups into categories without leaving any post uncategorised', () => {
    const cats = categories()
    expect(cats.length).toBeGreaterThan(2)
    for (const p of posts) expect(cats).toContain(p.category)
  })

  it('uses no em dashes anywhere, as the client asked', () => {
    expect(JSON.stringify(posts)).not.toMatch(/[\u2014\u2013]/)
  })
})

describe('testimonials', () => {
  it('ports the five template testimonials verbatim', () => {
    expect(testimonials).toHaveLength(5)
    expect(testimonials.every((t) => t.name === 'Dennis Green')).toBe(true)
  })
})
