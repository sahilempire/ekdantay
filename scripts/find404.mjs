import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()
const bad = new Set()
page.on('response', (r) => { if (r.status() >= 400) bad.add(`${r.status()}  ${r.url()}`) })
await page.goto('http://localhost:3200/', { waitUntil: 'networkidle' })
await browser.close()
console.log(bad.size ? [...bad].join('\n') : 'no failed requests')
