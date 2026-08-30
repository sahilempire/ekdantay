# Ekdantay Next.js Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps
> use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace seven static Bootstrap/jQuery HTML pages with a Next.js 16 application
in a warm 3D illustration direction, with a working WhatsApp booking flow.

**Architecture:** App Router, statically rendered, deployed on Vercel. All copy lives in
typed `content/` modules so the deliberately-ported placeholder content is a one-line
edit to remove later. One procedural React Three Fiber set-piece, lazy-loaded, with a
designed static fallback; illustrated motion is inline SVG driven by Motion. No backend —
the appointment form hands off to WhatsApp.

**Tech Stack:** Next.js 16.3.3, React 19.2.8, TypeScript strict, Tailwind 4.3.3,
motion, @react-three/fiber + drei, lenis, embla-carousel-react, lucide-react,
@radix-ui/react-dialog, Vitest + Testing Library, Playwright, pnpm 10.12.4.

**Spec:** `docs/superpowers/specs/2026-08-30-nextjs-migration-design.md`

## Global Constraints

- Node 22.16.0, pnpm 10.12.4. Never npm or yarn.
- TypeScript `strict: true`. `pnpm tsc --noEmit` must pass at every commit.
- Tailwind 4 CSS-first config. There is **no** `tailwind.config.js`; theme lives in an
  `@theme` block in `app/globals.css`.
- **No user-visible string is hard-coded in JSX.** Every one comes from `content/`.
- Placeholder content ports **verbatim** — fake staff, USD pricing, lorem posts, the
  "203 Fake St. Mountain View, San Francisco, California, USA" address, the contradictory
  stats. This is deliberate (spec §4.2). Do not "helpfully" correct it.
- Clinic facts, exact values: phone `+91 95878 15285` / `tel:+919587815285` /
  WhatsApp `919587815285`; email `info@ekdantay.com`; address
  `8, Janta Dharmshala, near Mahila Thana, Housing Board, Sawai Madhopur, Alanpur Rural, Rajasthan 322001`;
  hours Mon–Sat `10:30`–`17:30`, Sun `12:00`–`16:00`, emergency 24/7.
- Every R3F and animated-SVG surface renders a static fallback under
  `prefers-reduced-motion`. Non-negotiable.
- Lenis smooth scroll is **desktop only**. Touch devices keep native scrolling.
- Mobile Lighthouse performance must not regress vs. the current static site. If it does,
  cut the motion budget, not the gate.
- Old files (`*.html`, `css/`, `js/`, `scss/`, `fonts/`, `prepros-6.config`) are deleted
  in the **final** task only.
- Commit after every task. Never commit to `main`; branch is `feat/nextjs`.
- No AI-attribution trailer in any commit message.

---

### Task 1: Scaffold and toolchain

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`,
  `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Delete: `vercel.json` (Next.js on Vercel needs no build/route config)

**Interfaces:**
- Consumes: nothing
- Produces: a running `pnpm dev`, and `pnpm test` / `pnpm tsc --noEmit` / `pnpm build`
  scripts every later task depends on.

- [ ] **Step 1: Scaffold with exact pinned versions**

```bash
cd /Users/apple/Desktop/ekdantay
pnpm add next@16.3.3 react@19.2.8 react-dom@19.2.8
pnpm add -D typescript @types/react @types/react-dom @types/node
pnpm add -D tailwindcss@4.3.3 @tailwindcss/postcss
pnpm add motion lenis embla-carousel-react lucide-react @radix-ui/react-dialog
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
pnpm add @vercel/analytics
```

- [ ] **Step 2: Preserve the old site during migration**

The seven `.html` files must keep working until the final task. Move them out of the way
of Next's routing rather than deleting:

```bash
mkdir -p legacy && git mv index.html about.html services.html doctors.html \
  blog.html blog-single.html contact.html legacy/
git mv css js scss fonts prepros-6.config legacy/
```

`images/` stays at the repo root — Task 11 reprocesses it into `public/`.

- [ ] **Step 3: Verify the toolchain runs**

Run: `pnpm tsc --noEmit && pnpm build`
Expected: both exit 0. A default `app/page.tsx` renders.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Scaffold Next.js 16 with Tailwind 4 and test toolchain"
```

---

### Task 2: Design tokens and theme

**Files:**
- Modify: `app/globals.css`
- Create: `docs/superpowers/design-tokens.md` (the palette rationale, one page)

**Interfaces:**
- Produces: CSS custom properties every component consumes. Token names are fixed here
  and must not be renamed later: `--paper`, `--surface`, `--surface-raised`, `--ink`,
  `--ink-soft`, `--muted`, `--line`, `--accent`, `--accent-ink`, `--accent-wash`.

The direction is *abstract warm 3D* (spec §4.6) — soft forms, studio lighting, tactile
materials. The palette must read calm and warm, not clinical-mint. Derive it from the
enamel/bone/soft-tissue world rather than the medical-blue default every dental template
reaches for.

- [ ] **Step 1: Define the `@theme` block with a full light and dark token set**

Both themes are defined at token level. Light is the `:root` default; dark redefines only
tokens under `@media (prefers-color-scheme: dark)`. Never declare a colour only inside a
media block.

- [ ] **Step 2: Set the type pairing**

A display face with character for headings, a neutral workhorse for body, loaded via
`next/font/google` and self-hosted. Not Inter, not Space Grotesk.

- [ ] **Step 3: Verify both themes**

Run: `pnpm build`, then load `/` with the OS in light and in dark.
Expected: text is legible on both grounds; `body` background comes from a token, never
transparent.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add design tokens and type scale"
```

---

### Task 3: Content modules

**Files:**
- Create: `content/types.ts`, `content/clinic.ts`, `content/services.ts`,
  `content/team.ts`, `content/pricing.ts`, `content/stats.ts`,
  `content/testimonials.ts`, `content/posts.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces — every later task imports from these. Exact exported names:
  `clinic: Clinic`, `services: Service[]`, `team: StaffMember[]`,
  `pricingINR: PricingTier[]`, `pricingUSD: PricingTier[]`,
  `statsHome: StatSet[]`, `statsInner: StatSet[]`,
  `testimonials: Testimonial[]`, `posts: Post[]`.

```ts
// content/types.ts
export interface DayHours { label: string; open: string; close: string }  // "10:30" 24h

export interface Clinic {
  name: string
  tagline: string
  phone: { display: string; tel: string; whatsapp: string }
  email: string
  address: { lines: string[]; mapQuery: string }
  hours: { weekdays: DayHours; sunday: DayHours; emergency: string }
  socials: { facebook: string; instagram: string }
  credit: { name: string; url: string }
}

export interface Service { slug: string; title: string; icon: string; blurb: string }
export interface StaffMember { name: string; role: string; image: string; real: boolean }
export interface PricingTier { title: string; amount: string; unit: string; features: string[] }
export interface StatSet { label: string; value: number }
export interface Testimonial { name: string; role: string; image: string; quote: string }
export interface Post {
  slug: string; title: string; date: string; author: string
  comments: number; image: string; excerpt: string; body: string
}
```

`StaffMember.real` marks the four genuine staff (Divya Bharti, Yamini Sharma,
Gungun Rajput, Vijay Gurjar) apart from the four ported template entries (Tom Smith,
Mark Wilson, Patrick Jacobson, Ivan Dorchsner). This flag is what makes the later cleanup
a filter rather than an archaeology exercise.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { clinic } from '@/content/clinic'
import { team } from '@/content/team'

describe('content', () => {
  it('exposes clinic contact facts exactly once and correctly', () => {
    expect(clinic.phone.whatsapp).toBe('919587815285')
    expect(clinic.phone.tel).toBe('tel:+919587815285')
    expect(clinic.email).toBe('info@ekdantay.com')
    expect(clinic.hours.weekdays.open).toBe('10:30')
    expect(clinic.hours.sunday.close).toBe('16:00')
  })

  it('carries all eight staff, four flagged real', () => {
    expect(team).toHaveLength(8)
    expect(team.filter(m => m.real).map(m => m.name)).toEqual([
      'Dr. Divya Bharti', 'Dr. Yamini Sharma', 'Gungun Rajput', 'Vijay Gurjar',
    ])
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `pnpm vitest run tests/content.test.ts`
Expected: FAIL — modules do not resolve.

- [ ] **Step 3: Extract every string from `legacy/*.html` into the modules**

Source of truth is the legacy HTML, not memory. Read each file and transcribe. Port
placeholders verbatim per the global constraints.

- [ ] **Step 4: Run tests, confirm pass**

Run: `pnpm vitest run && pnpm tsc --noEmit`
Expected: PASS, 0 type errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add typed content modules extracted from legacy HTML"
```

---

### Task 4: Hours logic and WhatsApp handoff

**Files:**
- Create: `lib/hours.ts`, `lib/whatsapp.ts`
- Test: `tests/hours.test.ts`, `tests/whatsapp.test.ts`

**Interfaces:**
- Consumes: `clinic` from Task 3.
- Produces:
  - `getSlotsForDate(date: Date): string[]` — 24h `"HH:MM"` strings, 30-min intervals,
    inclusive of open, exclusive of close. Sunday uses Sunday hours. Returns `[]` for
    dates the clinic is shut.
  - `buildWhatsAppMessage(data: BookingData): string` — plain text, not yet encoded.
  - `buildWhatsAppUrl(data: BookingData): string` — full `https://wa.me/...?text=` URL.
  - `interface BookingData { name: string; phone: string; service: string; date: string; time: string; message?: string }`

This is the task that structurally kills the two live bugs: no slot before 10:30 can be
generated, and there are no DOM ids to collide.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from 'vitest'
import { getSlotsForDate } from '@/lib/hours'

describe('getSlotsForDate', () => {
  it('never offers a slot before the 10:30 weekday opening', () => {
    const monday = new Date('2026-09-07T00:00:00')
    const slots = getSlotsForDate(monday)
    expect(slots[0]).toBe('10:30')
    expect(slots).not.toContain('09:00')
    expect(slots).not.toContain('10:00')
  })

  it('uses the shorter Sunday window', () => {
    const sunday = new Date('2026-09-06T00:00:00')
    const slots = getSlotsForDate(sunday)
    expect(slots[0]).toBe('12:00')
    expect(slots.at(-1)).toBe('15:30')
    expect(slots).not.toContain('16:00')
  })
})
```

- [ ] **Step 2: Run, confirm fail**

Run: `pnpm vitest run tests/hours.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `lib/hours.ts`**

- [ ] **Step 4: Scaffold `lib/whatsapp.ts` and hand off `buildWhatsAppMessage`**

`buildWhatsAppUrl` and the types are implemented here. `buildWhatsAppMessage` is left as
a marked `TODO` with its signature, a doc comment explaining the trade-off, and a
minimal passing stub — **the user writes this one** (spec §9.1). It is the clinic's first
line to a patient, so its tone and field order are a business call.

- [ ] **Step 5: Run tests, confirm pass**

Run: `pnpm vitest run && pnpm tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Add hours and WhatsApp handoff logic"
```

---

### Task 5: Motion primitives

**Files:**
- Create: `hooks/useReducedMotion.ts`, `hooks/useCountUp.ts`,
  `components/motion/Reveal.tsx`, `components/motion/SmoothScroll.tsx`
- Test: `tests/useCountUp.test.ts`

**Interfaces:**
- Produces:
  - `usePrefersReducedMotion(): boolean`
  - `useCountUp(target: number, opts?: { duration?: number }): { value: number; ref: RefObject<HTMLElement> }`
  - `<Reveal delay?: number>` — wraps children, animates on intersection, renders plain
    under reduced motion
  - `<SmoothScroll>` — Lenis, mounts on desktop pointer-fine devices only

- [ ] **Step 1: Write the failing test for `useCountUp`**

```ts
it('lands exactly on the target value', async () => { /* rAF-driven, assert terminal */ })
it('returns the target immediately under reduced motion', () => { /* no animation */ })
```

- [ ] **Step 2: Run, confirm fail** — `pnpm vitest run tests/useCountUp.test.ts`

- [ ] **Step 3: Implement all four**

`useCountUp` uses `requestAnimationFrame` + `IntersectionObserver`, fires once, and
returns the target immediately when reduced motion is set. `SmoothScroll` mounts Lenis
only when `matchMedia('(pointer: fine)')` matches.

- [ ] **Step 4: Run tests, confirm pass**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add motion primitives with reduced-motion fallbacks"
```

---

### Task 6: UI primitives and layout

**Files:**
- Create: `components/ui/{Container,Button,SectionHeading,Input,Select}.tsx`
- Create: `components/layout/{Header,Footer,MobileNav}.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `clinic` (Task 3), tokens (Task 2), `Reveal` (Task 5).
- Produces: `<Header/>`, `<Footer/>` used by every route.

`Footer` reads phone, address and email from `clinic` — the single change that stops the
address existing in seven copies. `MobileNav` is `useState` + Radix Dialog; no Bootstrap
collapse.

- [ ] **Step 1: Build the primitives**
- [ ] **Step 2: Build Header, MobileNav, Footer**
- [ ] **Step 3: Verify** — `pnpm build`, check header and footer render on `/`, mobile nav opens at 375px
- [ ] **Step 4: Commit** — `git commit -m "Add UI primitives and site layout"`

---

### Task 7: The procedural 3D set-piece

**Files:**
- Create: `components/hero/Scene.tsx` (R3F, client, lazy), `components/hero/HeroCanvas.tsx`
  (the lazy boundary + static fallback), `components/hero/HeroFallback.tsx`

**Interfaces:**
- Consumes: theme tokens (Task 2), `usePrefersReducedMotion` (Task 5).
- Produces: `<HeroCanvas/>` — safe to render anywhere; never blocks first paint.

Geometry is generated in code — no model files (spec §14.1). Quality lives in lighting,
material and motion, not polygon count. Soft rounded forms, studio lighting, a slow
scroll-linked rotation.

- [ ] **Step 1: Build `HeroFallback` first**

A designed static state that must stand on its own — it is what mobile, reduced-motion
and pre-hydration users actually see. Build it before the 3D so it is never an
afterthought.

- [ ] **Step 2: Build the R3F scene with procedural geometry**

- [ ] **Step 3: Wire the lazy boundary**

`next/dynamic` with `ssr: false` and `HeroFallback` as the loading state. Skip mounting
entirely under `prefers-reduced-motion` or coarse pointer.

- [ ] **Step 4: Verify it is off the critical path**

Run: `pnpm build` and inspect the route's First Load JS.
Expected: the three/R3F chunk is a **separate** chunk, not in the entry bundle.

- [ ] **Step 5: Commit** — `git commit -m "Add procedural 3D hero with static fallback"`

---

### Task 8: Section components

**Files:**
- Create: `components/sections/{PageHero,Services,Achievements,PricingTable,TeamGrid,Testimonials,RecentPosts,MapEmbed,Newsletter}.tsx`

**Interfaces:**
- Consumes: content modules (Task 3), `Reveal` + `useCountUp` (Task 5), UI primitives (Task 6).
- Produces: the section vocabulary all seven routes compose from.

Written **once** each. `PageHero` is static — six of seven pages had a one-slide
"carousel" (spec §7.1), so only the homepage and About get Embla. `MapEmbed` is a plain
lazy `<iframe>` built from `clinic.address.mapQuery`; no API key.

- [ ] **Step 1: Build each section against its content module**
- [ ] **Step 2: Verify** — `pnpm tsc --noEmit && pnpm build`
- [ ] **Step 3: Commit** — `git commit -m "Add section components"`

---

### Task 9: Booking form

**Files:**
- Create: `components/booking/{AppointmentForm,AppointmentModal}.tsx`
- Test: `tests/AppointmentForm.test.tsx`

**Interfaces:**
- Consumes: `getSlotsForDate`, `buildWhatsAppUrl` (Task 4); Radix Dialog (Task 6).
- Produces: `<AppointmentForm/>`, `<AppointmentModal/>` — rendered in the hero and behind
  the nav CTA. **One component, two mounts**, with React-scoped state.

- [ ] **Step 1: Write the failing test**

```tsx
it('blocks submission until required fields are filled', async () => {})
it('offers no time slot before the clinic opens', async () => {})
it('composes the correct wa.me URL on submit', async () => {})
```

- [ ] **Step 2: Run, confirm fail**
- [ ] **Step 3: Implement**

Date input `min` is today. The time `<select>` is populated from `getSlotsForDate` for
the chosen date, so it changes when a Sunday is picked. No success alert — submitting
opens WhatsApp.

- [ ] **Step 4: Run tests, confirm pass**
- [ ] **Step 5: Commit** — `git commit -m "Add appointment form with WhatsApp handoff"`

---

### Task 10: Routes

**Files:**
- Create: `app/page.tsx`, `app/about/page.tsx`, `app/services/page.tsx`,
  `app/doctors/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`,
  `app/contact/page.tsx`, `app/not-found.tsx`
- Modify: `next.config.ts` (legacy `.html` redirects)

**Interfaces:**
- Consumes: everything above.

Compose sections per page, matching the legacy page order exactly (spec §3 — structure is
preserved). Homepage last; it is the most complex. `not-found.tsx` fixes the 12 dead
`teacher-single.html` links, which are repointed at `/doctors`.

- [ ] **Step 1: Add redirects for all seven legacy `.html` paths**
- [ ] **Step 2: Build the six inner routes**
- [ ] **Step 3: Build the homepage**
- [ ] **Step 4: Verify** — `pnpm build`; all 8 routes prerender
- [ ] **Step 5: Commit** — `git commit -m "Add all routes with legacy redirects"`

---

### Task 11: Images

**Files:**
- Create: `public/images/*` (reprocessed)
- Modify: every component referencing an image

The four staff PNGs are ~1 MB each. Convert to WebP, serve through `next/image` with
`sizes`. Drop the six unreferenced images (`bg_3.jpg`, `person_5–8.jpg`, `loc.png`).

- [ ] **Step 1: Convert and move into `public/images/`**
- [ ] **Step 2: Replace every `<img>`/background with `next/image`**
- [ ] **Step 3: Verify** — visually compare staff photos against originals at display size
- [ ] **Step 4: Commit** — `git commit -m "Optimize images through next/image"`

---

### Task 12: SEO layer

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `components/JsonLd.tsx`
- Modify: every `page.tsx` (add `metadata`), `app/layout.tsx`

Per-route `metadata` with title, description, Open Graph, canonical. `Dentist` JSON-LD
generated from `clinic`. One `<h1>` per page.

- [ ] **Step 1: Add metadata to all 8 routes**
- [ ] **Step 2: Add sitemap, robots, JSON-LD**
- [ ] **Step 3: Verify** — no route title contains "DentaCare"; every route has a description
- [ ] **Step 4: Commit** — `git commit -m "Add SEO metadata, sitemap and structured data"`

---

### Task 13: E2E and performance gate

**Files:**
- Create: `e2e/site.spec.ts`, `playwright.config.ts`

- [ ] **Step 1: Write the E2E suite**

All 8 routes return 200; legacy `.html` paths redirect; zero console errors; zero failed
requests; mobile nav opens; the appointment modal composes the right `wa.me` URL
(intercepted). Content assertion: no route renders "DentaCare" — placeholders that
`content/` deliberately supplies are allowed, template residue is not.

- [ ] **Step 2: Run, fix what it catches**
- [ ] **Step 3: Lighthouse, before and after, recorded**

Mobile performance must not regress vs. the legacy site. Mid-range Android profile
(4× CPU throttle, Slow 4G): FCP under 2.0 s, R3F chunk unloaded at interactive.

- [ ] **Step 4: Commit** — `git commit -m "Add E2E suite and record performance comparison"`

---

### Task 14: Cutover

**Files:**
- Delete: `legacy/`

- [ ] **Step 1: Confirm every legacy page has a working replacement**
- [ ] **Step 2: Delete `legacy/`**
- [ ] **Step 3: Update `README.md`** — it currently names four doctors who are not on the site
- [ ] **Step 4: Full verification** — `pnpm tsc --noEmit && pnpm vitest run && pnpm build && pnpm exec playwright test`
- [ ] **Step 5: Commit** — `git commit -m "Remove legacy static site"`

---

## Self-Review

**Spec coverage:** §4.1 → Tasks 2, 7. §4.2 → Task 3. §4.3/§9 → Tasks 4, 9. §4.4 → Task 1.
§4.5 → covered by omission (no parallax library installed). §4.6 → Tasks 5, 7, 13.
§5 → Tasks 1, 6, 10. §6 → Task 3. §7 → Tasks 5, 6, 8. §8 → Task 11. §10 → Task 12.
§11 → Tasks 3, 4, 9, 13. §12 → Tasks 1, 14. No uncovered requirement.

**Placeholder scan:** No TBDs. The one `TODO` is deliberate and assigned (Task 4 Step 4,
`buildWhatsAppMessage`, per spec §9.1).

**Type consistency:** `getSlotsForDate`, `buildWhatsAppMessage`, `buildWhatsAppUrl`,
`BookingData`, `usePrefersReducedMotion`, `useCountUp` and the nine content exports are
named identically everywhere they appear.

**Known gap:** Tasks 2, 6, 7 and 8 are deliberately lighter on prescribed code than
Tasks 3, 4 and 9. Those are visual-design tasks where the spec sets constraints
(tokens, direction, fallbacks, motion budget) but the composition is a judgment call best
made against the rendered result, not pre-specified in a plan document. Their verification
steps are still concrete.
