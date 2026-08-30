import { chromium } from '@playwright/test'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:3300/', { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)
await p.screenshot({ path: '/tmp/shots/p1-hero.png' })
// scroll to the marquee, which sits just after the story section
await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How a tooth works"]')
  window.scrollTo({ top: s.offsetTop + s.offsetHeight - 200, behavior: 'instant' })
})
await p.waitForTimeout(1500)
await p.screenshot({ path: '/tmp/shots/p1-marquee.png' })
await b.close()
console.log(errs.length ? 'ERRORS: ' + errs.join('; ') : 'no page errors')
