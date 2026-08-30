/**
 * Load a Sketchfab embed headlessly and dump its node map.
 *
 * This answers the only question that matters before adopting an embedded
 * model: are its anatomical layers separate, addressable nodes we can show and
 * hide, or one mesh with the interior painted on? Material counts only hint;
 * the node map is definitive.
 */
import { chromium } from '@playwright/test'

const UID = process.argv[2] ?? '9cc281349c314cc4859e26af238f9cd5'

const html = `<!doctype html><html><body style="margin:0">
<iframe id="api-frame" style="width:100vw;height:100vh;border:0"
  allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe>
<script src="https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"></script>
<script>
  window.__nodes = null; window.__err = null;
  const client = new Sketchfab('1.12.1', document.getElementById('api-frame'));
  client.init('${UID}', {
    success: (api) => {
      api.start();
      api.addEventListener('viewerready', () => {
        api.getNodeMap((err, nodes) => {
          if (err) { window.__err = String(err); return; }
          window.__nodes = Object.values(nodes).map(n => ({
            id: n.instanceID, name: n.name, type: n.type
          }));
        });
      });
    },
    error: (e) => { window.__err = 'init failed: ' + e; },
    autostart: 1, transparent: 1, ui_infos: 0, ui_controls: 0,
  });
</script></body></html>`

// Headless Chromium has no GPU by default; SwiftShader gives the Sketchfab
// viewer the WebGL context it refuses to start without.
const browser = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
  ],
})
const page = await (await browser.newContext()).newPage()
await page.setContent(html)

for (let i = 0; i < 40; i++) {
  const done = await page.evaluate(() => window.__nodes || window.__err)
  if (done) break
  await page.waitForTimeout(1000)
}

const err = await page.evaluate(() => window.__err)
const nodes = await page.evaluate(() => window.__nodes)
await page.screenshot({ path: '/tmp/shots/sketchfab-probe.png' })
await browser.close()

if (err) { console.log('  ERROR:', err); process.exit(1) }
if (!nodes) { console.log('  timed out waiting for the node map'); process.exit(1) }

const geom = nodes.filter(n => n.type === 'Geometry' || n.type === 'MatrixTransform')
console.log(`  ${nodes.length} nodes total, ${geom.length} geometry/transform\n`)
for (const n of nodes) {
  if (n.name && n.name !== 'undefined') console.log(`    [${n.type}] ${n.name}`)
}
