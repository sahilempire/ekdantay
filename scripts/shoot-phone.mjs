import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage()
await p.goto('http://localhost:3300/', { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)
const box = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="Modern dentistry, explained"]')
  return { top: s.offsetTop, height: s.offsetHeight }
})
for (let i = 0; i < 6; i++) {
  const y = box.top + (box.height - 844) * (i / 5)
  await p.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await p.waitForTimeout(1600)
  await p.screenshot({ path: `/tmp/shots/phone-${i}.png` })
}
await b.close()
console.log('captured at 390x844')
