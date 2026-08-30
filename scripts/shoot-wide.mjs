import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 2000, height: 1180 } })).newPage()
await p.goto('http://localhost:3300/', { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)
const box = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="Modern dentistry, explained"]')
  return { top: s.offsetTop, height: s.offsetHeight }
})
for (let i = 0; i < 8; i++) {
  const y = box.top + (box.height - 1180) * (i / 7)
  await p.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await p.waitForTimeout(1700)
  await p.screenshot({ path: `/tmp/shots/wide-${i}.png` })
}
await b.close()
console.log('captured at 2000x1180')
