import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Referenced nowhere on the new site (spec 8) - not carried over.
const DROP = new Set([
  'bg_3.jpg', 'person_5.jpg', 'person_6.jpg', 'person_7.jpg',
  'person_8.jpg', 'loc.png', '.DS_Store',
])

// Staff photos render at ~400px square; backgrounds go full-bleed.
const WIDTHS = { staff: 900, wide: 1800 }
const STAFF = /divya|yamini|vijay|Gungun|person_/i

const files = await readdir('images')
let before = 0, after = 0, n = 0

for (const f of files) {
  if (DROP.has(f)) continue
  const src = join('images', f)
  const stem = f.replace(/\.[^.]+$/, '')
  const out = join('public/images', `${stem}.webp`)

  before += (await stat(src)).size
  await sharp(src)
    .resize({ width: STAFF.test(f) ? WIDTHS.staff : WIDTHS.wide, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out)
  after += (await stat(out)).size
  n++
}

const mb = (b) => (b / 1024 / 1024).toFixed(2)
console.log(`${n} images converted`)
console.log(`before: ${mb(before)} MB`)
console.log(`after:  ${mb(after)} MB`)
console.log(`saved:  ${mb(before - after)} MB (${Math.round((1 - after / before) * 100)}%)`)
