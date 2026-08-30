import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
await page.goto('http://localhost:3201/', { waitUntil: 'networkidle' })
await page.waitForTimeout(3500)   // let WebGL mount + distort settle
await page.screenshot({ path: '/tmp/shots/hero-v2.png' })
await browser.close()
console.log('shot taken')
