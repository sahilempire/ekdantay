import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.goto('https://oryzo.ai/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4000)

const h = await page.evaluate(() => document.body.scrollHeight)
console.log('page scroll height:', h, 'px  (~' + (h / 900).toFixed(1) + ' viewports)')

for (let i = 0; i < 6; i++) {
  const y = Math.round((h - 900) * (i / 5))
  await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y)
  await page.waitForTimeout(2200)
  await page.screenshot({ path: `/tmp/shots/ref-oryzo-${i}.png` })
}
await browser.close()
console.log('6 scroll positions captured')
