import { chromium } from '@playwright/test'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://localhost:3300/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)

const box = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="Modern dentistry, explained"]')
  return { top: s.offsetTop, height: s.offsetHeight }
})
console.log('stage:', Math.round(box.height), 'px =', (box.height/900).toFixed(1), 'viewports')

for (let i = 0; i < 8; i++) {
  const y = box.top + (box.height - 900) * (i / 7)
  await p.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await p.waitForTimeout(1800)
  await p.screenshot({ path: `/tmp/shots/stage-${i}.png` })
}
await b.close()
console.log(errs.length ? 'ERRORS: ' + errs.join('; ') : 'no page errors')
