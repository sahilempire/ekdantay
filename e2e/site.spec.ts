import { test, expect, type Page } from '@playwright/test'

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/doctors',
  '/blog',
  '/blog/how-a-cavity-forms',
  '/contact',
]

/** Vercel Analytics only exists once deployed; it 404s locally by design. */
const IGNORED = [/_vercel\/insights/]

function watch(page: Page) {
  const problems: string[] = []
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    // Resource-load failures surface here as generic text with no URL, so
    // they cannot be filtered by origin. The response handler below sees the
    // actual URL and filters properly - counting them here too would just
    // double-report an already-covered failure as an unfilterable one.
    if (/Failed to load resource/i.test(m.text())) return
    problems.push(`console: ${m.text()}`)
  })
  page.on('response', (r) => {
    if (r.status() >= 400 && !IGNORED.some((rx) => rx.test(r.url()))) {
      problems.push(`${r.status()}: ${r.url()}`)
    }
  })
  return problems
}

test.describe('every route', () => {
  for (const route of ROUTES) {
    test(`${route} loads clean with exactly one h1`, async ({ page }) => {
      const problems = watch(page)
      const res = await page.goto(route, { waitUntil: 'networkidle' })

      expect(res?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('nextjs-portal')).toHaveCount(0)
      expect(problems, problems.join('\n')).toEqual([])
    })
  }
})

test.describe('legacy URLs', () => {
  const REDIRECTS: [string, string][] = [
    ['/index.html', '/'],
    ['/about.html', '/about'],
    ['/services.html', '/services'],
    ['/doctors.html', '/doctors'],
    ['/blog.html', '/blog'],
    ['/blog-single.html', '/blog'],
    ['/contact.html', '/contact'],
    // Never existed, but the old site linked it 12 times.
    ['/teacher-single.html', '/doctors'],
  ]

  for (const [from, to] of REDIRECTS) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      await page.goto(from)
      expect(new URL(page.url()).pathname).toBe(to)
    })
  }

  test('an unknown path renders the 404 page', async ({ page }) => {
    const res = await page.goto('/no-such-page')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/couldn/i)
  })
})

test.describe('template residue', () => {
  // Placeholders that content/ deliberately supplies are allowed (spec 4.2).
  // These are template artefacts that must never appear.
  const FORBIDDEN = ['DentaCare', '203 Fake St', 'info@yourdomain.com', '+2 392 3929 210']

  for (const route of ROUTES) {
    test(`${route} carries no template residue`, async ({ page }) => {
      await page.goto(route)
      const body = (await page.locator('body').innerText()).toLowerCase()
      for (const term of FORBIDDEN) {
        expect(body, `found "${term}" on ${route}`).not.toContain(term.toLowerCase())
      }
    })
  }

  test('clinic contact facts appear correctly', async ({ page }) => {
    await page.goto('/')
    const body = await page.locator('body').innerText()
    expect(body).toContain('+91 95878 15285')
    expect(body).toContain('info@ekdantay.com')
    expect(body).toContain('Sawai Madhopur')
  })
})

test.describe('booking', () => {
  test('offers no slot before the clinic opens, and composes a wa.me link', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel(/full name/i).fill('Asha Meena')
    await page.getByLabel(/phone number/i).fill('+91 90000 11111')
    // 2026-09-07 is a Monday; the clinic opens at 10:30.
    await page.getByLabel(/preferred date/i).fill('2026-09-07')

    const times = page.getByLabel(/preferred time/i)
    const options = await times.locator('option').allTextContents()
    expect(options).toContain('10:30 AM')
    expect(options).not.toContain('9:00 AM')
    expect(options).not.toContain('10:00 AM')

    await times.selectOption('10:30')

    // Intercept rather than actually opening WhatsApp.
    await page.addInitScript(() => {
      // @ts-expect-error test shim
      window.__opened = null
      // @ts-expect-error test shim
      window.open = (u: string) => { window.__opened = u }
    })
    await page.reload()
    await page.getByLabel(/full name/i).fill('Asha Meena')
    await page.getByLabel(/phone number/i).fill('+91 90000 11111')
    await page.getByLabel(/preferred date/i).fill('2026-09-07')
    await page.getByLabel(/preferred time/i).selectOption('10:30')
    await page.getByRole('button', { name: /send booking/i }).click()

    const opened = await page.evaluate(() => (window as unknown as { __opened: string }).__opened)
    expect(opened).toContain('https://wa.me/919587815285')
    expect(decodeURIComponent(opened)).toContain('Asha Meena')
  })

  test('blocks submission when required fields are empty', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: /send booking/i }).click()
    await expect(page.getByText(/please tell us your name/i)).toBeVisible()
  })
})

test.describe('css cascade', () => {
  /*
    Guards a bug that was invisible and site-wide.

    globals.css resets `h1,h2,h3,h4 { margin: 0 }` and `p { margin: 0 }`. Those
    were written outside any @layer, and unlayered CSS beats every layered rule
    in the cascade regardless of specificity, so Tailwind's utilities lost. The
    result was thirty-five dead mt-* and mb-* declarations across fifteen
    files, doing nothing, mostly unnoticed because the elements sat in flex
    containers whose `gap` was quietly covering for them.

    A unit test cannot see this: the class is in the markup and the rule is in
    the stylesheet. Only a browser resolving the cascade can tell you the
    computed value is zero.
  */
  test('margin utilities survive the base reset on p and headings', async ({ page }) => {
    await page.goto('/blog/how-a-cavity-forms')

    const measured = await page.evaluate(() => {
      const pick = (sel: string) => document.querySelector(sel)
      const heading = pick('h2[class*="mt-"]') as HTMLElement | null
      const para = pick('p[class*="mt-"]') as HTMLElement | null
      return {
        heading: heading ? getComputedStyle(heading).marginTop : null,
        paragraph: para ? getComputedStyle(para).marginTop : null,
      }
    })

    expect(measured.heading, 'no h2 carrying an mt-* utility to test').toBeTruthy()
    expect(measured.paragraph, 'no p carrying an mt-* utility to test').toBeTruthy()
    expect(measured.heading).not.toBe('0px')
    expect(measured.paragraph).not.toBe('0px')
  })

  test('a service card spaces its own parts', async ({ page }) => {
    await page.goto('/services')
    const gaps = await page.evaluate(() => {
      const h3 = [...document.querySelectorAll('h3')].find((h) => h.textContent === 'Teeth Cleaning')
      const card = h3!.closest('a')!
      const blurb = card.querySelector('p')!
      const rule = card.querySelector('div.border-t')!
      return {
        blurbToRule: Math.round(rule.getBoundingClientRect().top - blurb.getBoundingClientRect().bottom),
        titleTop: parseFloat(getComputedStyle(h3!).marginTop),
      }
    })
    // Both were zero: the title sat on the icon and the blurb on the rule.
    expect(gaps.blurbToRule).toBeGreaterThan(12)
    expect(gaps.titleTop).toBeGreaterThan(12)
  })
})

test.describe('search engine markup', () => {
  /*
    This suite exists because of a defect that shipped and went unnoticed.

    `alternates.canonical: '/'` sat on the root layout, and Next inherits
    alternates down the route tree, so every page emitted a canonical pointing
    at the homepage. That instructs Google to treat /services, /contact and
    every article as duplicates of / and drop them from the index. It is
    invisible in a browser and fatal to a site's search traffic, so it is
    asserted here rather than trusted.
  */
  for (const route of ROUTES) {
    test(`${route} declares itself canonical, not the homepage`, async ({ page }) => {
      await page.goto(route)
      const href = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(href, `no canonical on ${route}`).toBeTruthy()
      expect(new URL(href!).pathname).toBe(route === '/' ? '/' : route)
    })

    test(`${route} has a unique, non-empty title and description`, async ({ page }) => {
      await page.goto(route)
      const title = await page.title()
      expect(title.length).toBeGreaterThan(15)
      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(desc, `no meta description on ${route}`).toBeTruthy()
      expect(desc!.length).toBeGreaterThan(70)
    })

    test(`${route} emits valid JSON-LD naming the clinic`, async ({ page }) => {
      await page.goto(route)
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
      expect(blocks.length).toBeGreaterThan(0)
      const graph = blocks.map((b) => JSON.parse(b))
      const types = graph.flatMap((g) => (g['@graph'] ?? []).map((n: { '@type': string }) => n['@type']))
      expect(types).toContain('Dentist')
    })
  }

  test('titles are unique across the site', async ({ page }) => {
    const titles: string[] = []
    for (const route of ROUTES) {
      await page.goto(route)
      titles.push(await page.title())
    }
    expect(new Set(titles).size).toBe(titles.length)
  })

  test('an article carries Article and FAQ markup with a named author', async ({ page }) => {
    await page.goto('/blog/how-a-cavity-forms')
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent()
    const nodes = JSON.parse(raw!)['@graph'] as Array<Record<string, unknown>>

    const article = nodes.find((n) => n['@type'] === 'BlogPosting')
    expect(article).toBeTruthy()
    expect((article!.author as { name: string }).name).toContain('Dr.')
    expect(article!.datePublished).toBeTruthy()

    const faq = nodes.find((n) => n['@type'] === 'FAQPage')
    expect((faq!.mainEntity as unknown[]).length).toBeGreaterThanOrEqual(3)

    const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList')
    expect((crumbs!.itemListElement as unknown[]).length).toBe(3)
  })

  test('the sitemap lists every route and every article', async ({ page }) => {
    const res = await page.goto('/sitemap.xml')
    const xml = await res!.text()
    for (const route of ROUTES) {
      const path = route === '/' ? '' : route
      expect(xml, `${route} missing from sitemap`).toContain(`ekdantay.com${path}<`)
    }
  })

  test('robots.txt points at the sitemap and allows crawling', async ({ page }) => {
    const res = await page.goto('/robots.txt')
    const txt = await res!.text()
    expect(txt).toContain('Allow: /')
    expect(txt).toContain('Sitemap: https://www.ekdantay.com/sitemap.xml')
  })

  test('the site serves a favicon and a social card', async ({ page }) => {
    await page.goto('/')
    const icon = await page.locator('link[rel="icon"]').first().getAttribute('href')
    expect(icon).toBeTruthy()
    const og = await page.locator('meta[property="og:image"]').first().getAttribute('content')
    expect(og, 'no og:image, so shares render as a bare link').toBeTruthy()
  })
})

test.describe('mobile', () => {
  test.use({ ...devicesPixel() })

  test('renders the scroll story on a phone, without WebGL', async ({ page }) => {
    // The stage is now pre-rendered images rather than real-time 3D, which is
    // what lets it work identically on low-end hardware. Asserting no canvas
    // is the point: if one reappears, WebGL is back in the critical path on
    // exactly the devices this was moved away from it for.
    await page.goto('/', { waitUntil: 'networkidle' })
    const story = page.locator('section[aria-label="Modern dentistry, explained"]')
    await expect(story).toHaveCount(1)

    await story.scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)

    await expect(story.locator('canvas')).toHaveCount(0)
    await expect(story.locator('img').first()).toBeVisible()
  })

  test('the scroll story copy is reachable without a pointer', async ({ page }) => {
    await page.goto('/')
    const story = page.locator('section[aria-label="Modern dentistry, explained"]')
    await expect(story).toContainText('Modern Dentistry')
  })
})

function devicesPixel() {
  return { viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true }
}
