import { test, expect, type Page } from '@playwright/test'

const ROUTES = ['/', '/about', '/services', '/doctors', '/blog', '/blog/post-1', '/contact']

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

test.describe('mobile', () => {
  test.use({ ...devicesPixel() })

  test('renders the scroll story with a canvas on a phone', async ({ page }) => {
    // The direction changed deliberately: 2026 scrollytelling guidance is that
    // desktop-only scroll experiences are obsolete, and the right pattern is a
    // lighter scene on weak hardware rather than no scene. This asserts the
    // canvas actually mounts on a touch device.
    await page.goto('/', { waitUntil: 'networkidle' })
    const story = page.locator('section[aria-label="How a tooth works"]')
    await expect(story).toHaveCount(1)

    await story.scrollIntoViewIfNeeded()
    await page.waitForTimeout(2500)
    await expect(story.locator('canvas')).toHaveCount(1)
  })

  test('the scroll story copy is reachable without a pointer', async ({ page }) => {
    await page.goto('/')
    const story = page.locator('section[aria-label="How a tooth works"]')
    await expect(story).toContainText('Your tooth, explained')
  })
})

function devicesPixel() {
  return { viewport: { width: 393, height: 851 }, hasTouch: true, isMobile: true }
}
