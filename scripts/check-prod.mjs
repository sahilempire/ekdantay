import { chromium } from '@playwright/test'
const BASE = 'http://localhost:3200'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(`${page.url()} :: ${m.text()}`))
page.on('pageerror', (e) => errors.push(`${page.url()} :: ${e.message}`))

for (const p of ['/', '/about', '/services', '/doctors', '/blog', '/blog/post-1', '/contact']) {
  await page.goto(BASE + p, { waitUntil: 'networkidle' })
  const h1 = await page.locator('h1').first().textContent().catch(() => null)
  const overlay = await page.locator('nextjs-portal').count()
  console.log(`  ${p.padEnd(16)} h1="${(h1 ?? '—').slice(0, 42)}" errorOverlay=${overlay}`)
}
await page.screenshot({ path: '/tmp/shots/prod-doctors.png' })
await browser.close()
console.log(errors.length ? `\nCONSOLE ERRORS:\n${errors.join('\n')}` : '\n✓ no console errors in production')
