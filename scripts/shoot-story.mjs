import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const errs = []
page.on('pageerror', (e) => errs.push(e.message))
await page.goto('http://localhost:3300/', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

// The story section starts after the hero; walk through its whole range.
const box = await page.evaluate(() => {
  const s = document.querySelector('section[aria-label="Modern dentistry, explained"]')
  const r = s.getBoundingClientRect()
  return { top: r.top + window.scrollY, height: s.offsetHeight }
})
console.log('story section:', Math.round(box.height), 'px tall')

for (let i = 0; i < 6; i++) {
  const y = box.top + (box.height - 900) * (i / 5)
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `/tmp/shots/story-${i}.png` })
}
await browser.close()
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no page errors')
