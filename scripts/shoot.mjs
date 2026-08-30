import { chromium } from '@playwright/test'

const BASE = 'http://localhost:3000'
const OUT = '/tmp/shots'

const browser = await chromium.launch()
const errors = []

async function shoot(name, path, viewport, scheme = 'light') {
  const ctx = await browser.newContext({ viewport, colorScheme: scheme })
  const page = await ctx.newPage()
  page.on('console', (m) => m.type() === 'error' && errors.push(`${path} :: ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`${path} :: ${e.message}`))
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)          // let reveals settle
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false })
  await ctx.close()
}

const desktop = { width: 1440, height: 900 }
const phone = { width: 390, height: 844 }

await shoot('home-desktop', '/', desktop)
await shoot('home-dark', '/', desktop, 'dark')
await shoot('home-phone', '/', phone)
await shoot('services-desktop', '/services', desktop)
await shoot('doctors-desktop', '/doctors', desktop)
await shoot('contact-desktop', '/contact', desktop)
await shoot('contact-phone', '/contact', phone)

await browser.close()

console.log(errors.length ? `CONSOLE ERRORS:\n${errors.join('\n')}` : 'no console errors')
