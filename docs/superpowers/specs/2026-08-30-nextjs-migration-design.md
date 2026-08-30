# Ekdantay Dental Clinic — Next.js Migration Design

**Date:** 2026-08-30
**Status:** Approved (pending spec review)
**Branch:** `feat/nextjs`

---

## 1. Context

The Ekdantay Dental Clinic site is seven static HTML pages built on a 2019 Colorlib
Bootstrap 4 template ("DentaCare"), driven by jQuery and eleven jQuery plugins. It is
deployed on Vercel.

An audit on 2026-08-30 found the site functional but carrying substantial template
residue and one broken conversion path. The migration is motivated by four concrete
problems, not by novelty:

1. **The booking flow does not work.** Duplicate DOM ids (`appointment_name`,
   `appointment_email` at `index.html:125/799` and `131/810`) mean the modal form's
   handler reads the hero form's empty inputs, so submission always fails validation.
   Even on success, `sendAppointmentEmail()` only calls `console.log` while telling the
   patient they will be contacted within 24 hours.
2. **The site weighs roughly 10 MB.** 6.3 MB images (four staff PNGs at ~1 MB each),
   2.8 MB icon fonts, 772 KB CSS, 652 KB JS.
3. **Every shared element is duplicated seven times.** Header, footer, and the "Recent
   Blog" widget are copy-pasted per page, so fixes land on some pages and not others.
   The last two commits demonstrate this: social links and clinic stats were each
   updated on a subset of pages.
4. **SEO is largely absent.** Four pages still carry the title
   `"DentaCare - Free Bootstrap 4 Template by Colorlib"`. No page has a meta
   description, Open Graph tag, canonical, sitemap, or structured data.

Full audit findings are in the conversation record of 2026-08-30; this document assumes
them rather than repeating them.

## 2. Goals

- Rebuild the seven pages as a Next.js App Router application with Tailwind styling.
- Eliminate jQuery, Bootstrap, and all eleven jQuery plugins.
- Make the appointment form actually deliver a booking request.
- Cut page weight substantially, primarily through image and font handling.
- Write each shared section once.
- Add the missing SEO layer.
- Structure content so the known placeholder cleanup is cheap to perform later.

## 3. Non-goals

Explicitly out of scope for this migration:

- **Correcting placeholder content.** Fake staff, lorem blog posts, USD pricing,
  invented testimonials, the San Francisco address, and the contradictory clinic
  statistics all port across verbatim. This is a deliberate decision (§4.2).
- **Restructuring pages.** Same sections, same order, same page map. Styling changes;
  information architecture does not.
- **A CMS or admin interface.** Blog content stays hard-coded.
- **A booking backend, database, or patient records.** See §4.3.
- **Redesigning the logo, brand colors, or photography.**

## 4. Decisions

### 4.1 Visual direction — warm 3D illustration

**Decision:** Rebuild with Tailwind 4, in a **stylized 3D illustration** direction —
the synthesis of Directions B (immersive 3D) and C (warm illustrated) from the
2026-08-30 reference research.

**Rationale:** A pixel-identical port would retain 772 KB of CSS, 2.8 MB of icon fonts,
and the dated template aesthetic. Beyond that, the user selected a direction combining
3D depth with illustrated warmth. This is a deliberate synthesis, not a compromise: the
objection to cold architectural 3D (South Cliff) was that impressiveness works against
an anxious patient. Illustrated, characterful 3D inverts that — the visual impact is
retained while the illustration style does the anxiety-reduction work that every 2026
dental roundup identifies as the category's core UX problem.

**Design brief:**

- Stylized, warm, characterful 3D — never photoreal, never clinical-architectural.
- One orchestrated 3D set-piece (hero), not a 3D site. Depth used where it carries
  meaning; flat everywhere else.
- Illustrated character/motion moments at the anxiety points: first visit, treatments,
  pain-free messaging.
- Real staff photography retained — the four real staff are a trust asset and must not
  be replaced by avatars.

**Cost accepted:** The site will differ substantially from what is live today. Content
and page structure are preserved (§3, §4.2); presentation changes completely.

**Dependency:** This direction requires illustration and 3D assets that do not currently
exist. Asset sourcing is tracked as an open question (§14) and gates visual completion,
though not the architecture.

### 4.6 Motion stack and mobile strategy

**Decision:** React Three Fiber for the single 3D set-piece with **procedurally generated
geometry**, animated inline SVG for illustrated moments, Motion as the base layer, Lenis
for smooth scroll (desktop only).

**Rationale:** Asset sourcing resolved to code-only (§14.1), which rules Rive out — Rive
requires authored `.riv` files produced in its editor, and there is no one to author
them. Inline SVG animated with Motion delivers the same illustrated warmth from source we
can write, version, theme, and diff, with no runtime, no WASM, and no third-party
dependency. Rive was evaluated (78 KB WASM, GPU-accelerated, 10–15× smaller than Lottie)
and remains the right choice if commissioned assets are ever introduced; it is recorded
here so that decision is not re-litigated from scratch.

**Consequence — this is a strength, not a fallback.** Procedural geometry and inline SVG
both react to the theme tokens, scale losslessly, cost no network requests, and are
diffable in review. The ceiling is geometric elegance rather than a sculpted character
mascot; the direction is therefore *abstract warm 3D* — soft forms, studio lighting,
tactile materials — not a cartoon character.

**Mobile strategy — mandatory, not optional:**

- The 3D set-piece is lazy-loaded and never blocks first paint. A static rendered image
  is the fallback.
- Heavy motion is gated behind both `prefers-reduced-motion` **and** a viewport/capability
  check. Phones receive layout, typography and illustration without scroll hijacking.
- Lenis smooth scroll is desktop-only; touch devices keep native momentum scrolling.
- Inline SVG illustration ships with the HTML and costs no extra request; its animation
  is driven by Motion and starts on intersection, never on load.
- Performance budget: the mobile Lighthouse score must not regress against the current
  static site. This is a merge gate (§11), not an aspiration.

### 4.2 Content — port verbatim, including placeholders

**Decision:** All current content ports across unchanged, placeholders included.

**Rationale:** User's explicit choice. Cleanup is deferred to a later, separate pass.

**Risk acknowledged and accepted:** Two items carry more than cosmetic risk on a
healthcare site — the five invented testimonials attributed to "Dennis Green", and the
"203 Fake St. Mountain View, San Francisco, California, USA" business address in four
footers. This risk was raised before the decision was taken and is recorded here so the
choice is traceable, not to reopen it.

**Mitigation:** The content architecture (§6) is designed specifically so that removing
a fake dentist, testimonial, or pricing tier later is a single-line edit to a typed data
file rather than an edit across multiple JSX files. This is the primary reason content
is externalized rather than inlined.

### 4.3 Booking — WhatsApp handoff

**Decision:** The appointment form composes a prefilled WhatsApp message to
+91 95878 15285 and opens it. No API route, no email provider, no stored data.

**Rationale:** User's choice. It requires no backend, no secrets, and no ongoing
maintenance, and it matches how the clinic already fields enquiries. It also removes the
"fake success" pattern entirely — the patient sees a real WhatsApp thread, which is
self-evidently either delivered or not.

**Consequence:** The site has no server-side runtime. Every route is statically
rendered.

**Limitation accepted:** Patients without WhatsApp cannot use the form. The phone number
and email remain visible on every page as fallbacks.

### 4.4 Rendering — Next.js on Vercel, not static export

**Decision:** Approach A. Standard Next.js deployment on Vercel with all pages
statically rendered at build time, retaining on-demand `next/image` optimization.

**Alternative rejected:** `output: 'export'` producing plain static HTML. It would be
portable to any host, but `next/image` loses on-demand optimization, requiring
build-time pre-compression and hand-written `<picture>` fallbacks. Since the four ~1 MB
staff photos are the single largest weight problem, giving up automatic image
optimization to gain a portability the project is not using is a poor trade.

### 4.5 Parallax — dropped

**Decision:** Remove the `data-scrollax` (26 uses) and `data-stellar` (10 uses) parallax
effects rather than reimplementing them.

**Rationale:** Recommended during design review and not contested. Scroll-linked
parallax performs poorly on mobile, and these libraries cost 20 KB combined. Reversible
if the visual loss is missed.

## 5. Architecture

### 5.1 Stack

| Concern | Choice | Version |
|---|---|---|
| Framework | Next.js, App Router | 16.3.3 |
| UI runtime | React | 19.2.8 |
| Language | TypeScript, `strict: true` | 5.x |
| Styling | Tailwind CSS, CSS-first `@theme` config | 4.3.3 |
| Icons | `lucide-react` | latest |
| Carousel | `embla-carousel-react` | latest |
| Animation base layer | `motion` (formerly Framer Motion) | latest |
| Illustrated motion | inline SVG animated with `motion` — authored in repo, no runtime | n/a |
| 3D set-piece | `@react-three/fiber` + `@react-three/drei`, procedural geometry, lazy-loaded | latest |
| Smooth scroll | `lenis` — desktop only (§4.6) | latest |
| Animated components | React Bits — copy-paste source, ships `prefers-reduced-motion` | n/a |
| Dialog / a11y primitives | `@radix-ui/react-dialog` | latest |
| Unit tests | Vitest + Testing Library | latest |
| E2E tests | Playwright | latest |
| Package manager | pnpm | 10.12.4 |

Versions marked "latest" are resolved and pinned to exact versions in `package.json` at
scaffold time; the four pinned above were verified against the npm registry on
2026-08-30. Toolchain in use: Node 22.16.0, pnpm 10.12.4.

Tailwind 4 uses CSS-first configuration; there is no `tailwind.config.js`. The theme
(brand colors, fonts, spacing) is declared in an `@theme` block in the global stylesheet.

### 5.2 Directory layout

```
app/
  layout.tsx              root layout: Header, Footer, fonts, default metadata
  page.tsx                /
  about/page.tsx
  services/page.tsx
  doctors/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  contact/page.tsx
  not-found.tsx
  sitemap.ts
  robots.ts
  globals.css             Tailwind import + @theme block

components/
  layout/                 Header, Footer, MobileNav
  sections/               PageHero, HomeHero, Services, Achievements,
                          PricingTable, TeamGrid, Testimonials,
                          RecentPosts, MapEmbed, Newsletter
  booking/                AppointmentForm, AppointmentModal
  ui/                     Button, Input, Select, Container, SectionHeading

content/
  types.ts                shapes for every content module (§6)
  clinic.ts               phone, address, email, hours, WhatsApp, socials, credit
  services.ts
  team.ts
  pricing.ts
  stats.ts
  testimonials.ts
  posts.ts

lib/
  whatsapp.ts             buildWhatsAppMessage()
  hours.ts                time-slot generation from clinic hours

hooks/
  useCountUp.ts

public/images/            reprocessed images
```

### 5.3 Route map and URL preservation

| Old | New | Notes |
|---|---|---|
| `/index.html` | `/` | |
| `/about.html` | `/about` | |
| `/services.html` | `/services` | |
| `/doctors.html` | `/doctors` | |
| `/blog.html` | `/blog` | |
| `/blog-single.html` | `/blog/[slug]` | 11 posts get real slugs |
| `/contact.html` | `/contact` | |
| `/teacher-single.html` | — | **currently 404s; 12 links point at it** |

`next.config.ts` declares permanent redirects from each `/*.html` path to its clean
equivalent so existing inbound links and any accumulated search ranking survive.

The 12 dead `teacher-single.html` links (8 in `doctors.html`, 4 in `index.html`) are
repointed at the team section. A `not-found.tsx` provides a real 404 page, which the site
currently lacks.

## 6. Content model

All copy lives in typed modules under `content/`. No user-visible string is hard-coded in
JSX. This is the mechanism that makes the deferred cleanup (§4.2) cheap.

```ts
// content/types.ts — shapes only; values live in the modules

interface Clinic {
  name: string
  tagline: string
  phone: { display: string; tel: string; whatsapp: string }
  email: string
  address: { lines: string[]; mapQuery: string }
  hours: { weekdays: DayHours; sunday: DayHours; emergency: string }
  socials: { facebook: string; instagram: string }
  credit: { name: string; url: string }
}

interface DayHours { label: string; open: string; close: string }   // "10:30", "17:30"
interface Service { slug: string; title: string; icon: LucideIcon; blurb: string }
interface StaffMember { name: string; role: string; image: string; socials: Social[] }
interface PricingTier { title: string; amount: string; unit: string; features: string[] }
interface StatSet { label: string; value: number }
interface Testimonial { name: string; role: string; image: string; quote: string }
interface Post { slug: string; title: string; date: string; author: string;
                 comments: number; image: string; excerpt: string; body: string }
```

Notes on specific modules:

- **`clinic.ts`** is the single source for phone, address, and email. Today the San
  Francisco address appears in four footers and the real address in three; after
  migration each exists exactly once.
- **`team.ts`** holds all eight staff: Dr. Divya Bharti (Chief Dentist), Dr. Yamini
  Sharma (Assistant Dentist), Gungun Rajput (Receptionist), Vijay Gurjar (Hygienist),
  and the four template entries — Tom Smith, Mark Wilson, Patrick Jacobson, Ivan
  Dorchsner (System Analyst).
- **`pricing.ts`** holds both sets: the four ₹ tiers from the homepage (Basic Checkup
  ₹800/visit, Teeth Whitening ₹3,500/session, Dental Implant ₹25,000/tooth, Orthodontic
  Treatment ₹45,000/treatment) and the four template $ tiers used on Services and
  Doctors (Basic $24.50, Standard $34.50, Premium $54.50, Platinum $89.50).
- **`stats.ts`** holds both conflicting sets: the homepage's `4 / 2 / 1080` and the
  other pages' `14 / 4500 / 4200 / 320`. Each page references the set it uses today.
- **`services.ts`** holds six services: Teeth Whitening, Teeth Cleaning, Orthodontics,
  Pain-Free Treatment, Dental Implants, Emergency Care.

Every field is required and typed, so an omission is a build error rather than a blank
region on a live page.

## 7. Dependency replacement

| Removed | Replacement | Bytes saved |
|---|---|---|
| jQuery + jquery-migrate | React | 273 KB |
| Bootstrap JS (modal, collapse, dropdown) | Radix Dialog, `useState` nav | 68 KB |
| Owl Carousel | Embla, on two carousels only | 42 KB |
| Magnific Popup | — **dead code, selectors match nothing** | 26 KB |
| bootstrap-datepicker + jquery.timepicker | native `<input type="date">`, `<select>` | 61 KB |
| Waypoints + AOS + `ftco-animate` | Framer Motion `whileInView` | 22 KB |
| jquery.animateNumber | `useCountUp` hook (rAF + IntersectionObserver) | 1 KB |
| Stellar + Scrollax | — dropped per §4.5 | 20 KB |
| jquery.easing | CSS easing | 8 KB |
| `main.js` page loader | — no FOUC in Next.js | 6 KB |
| `google-map.js` + Maps JS API | plain `<iframe>` embed | removes exposed API key |
| Bootstrap CSS + `style.css` | Tailwind | ~388 KB |
| icomoon, ionicons, flaticon, open-iconic | `lucide-react` | ~2.8 MB |

### 7.1 Carousel scope

Audit finding that shapes this: `home-slider` contains **one slide** on six of seven
pages — it is a static hero wrapped in carousel markup. Only two genuine carousels
exist:

- Homepage hero — 2 slides ("Modern Dentistry in a Calm and Relaxed Environment",
  "Achieve Your Desired Perfect Smile")
- About testimonials — 5 slides

Therefore six of seven pages use a static `<PageHero>` component with no carousel
JavaScript at all. Embla loads only on `/` and `/about`.

### 7.2 Google Maps

The current setup is doubly broken: `initMap()` in `js/google-map.js` is never called
(no `callback=initMap` parameter, no direct invocation), so the map on `/contact` never
renders; and the Maps JS API loads on six pages, five of which have no map container.
The homepage iframe uses a fabricated `pb=` blob.

Replacement is a plain Google Maps `<iframe>` embed built from `clinic.address.mapQuery`,
lazy-loaded, requiring no API key. This removes the exposed key
(`AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s`) and its billing exposure.

**Action for the clinic, outside this migration:** that key should be revoked or
referrer-restricted in Google Cloud Console regardless, since it has been public in the
page source.

## 8. Assets

| Asset | Current | Approach | Expected |
|---|---|---|---|
| 4 staff photos | ~1 MB PNG each (4.2 MB) | convert to WebP, serve via `next/image` with `sizes` | < 200 KB total |
| Background / gallery JPGs | 1.6 MB | `next/image`, responsive `sizes` | substantially reduced |
| Icon fonts | 2.8 MB, 4 families | `lucide-react`, tree-shaken | ~1 KB per icon used |
| CSS | 772 KB | Tailwind, only what is used | 10–20 KB |
| Open Sans | Google Fonts render-blocking request | `next/font/google`, self-hosted | no layout shift, no third-party request |

Six images referenced nowhere (`bg_3.jpg`, `person_5–8.jpg`, `loc.png`) are not carried
over.

## 9. Booking flow

```
patient fills <AppointmentForm/>
        |
        v
client-side validation (name, phone, service, date, time)
        |
        v
buildWhatsAppMessage(data) -> encoded string
        |
        v
window.open("https://wa.me/919587815285?text=...")
        |
        v
WhatsApp opens prefilled; clinic replies in the thread
```

Design points:

- The hero form and the modal form become **one** `<AppointmentForm>` component rendered
  twice. React-scoped state replaces global DOM ids, which structurally eliminates the
  duplicate-id defect — it cannot recur.
- Time slots are generated by `lib/hours.ts` from `clinic.hours`, so the 09:00 / 09:30 /
  10:00 options currently offered before the 10:30 opening cannot be produced. Sunday
  correctly yields the 12:00–16:00 range.
- The date input's `min` is today; Sundays map to Sunday hours automatically.
- No fake success state. The WhatsApp thread is the confirmation.

### 9.1 Deliberate hand-off to the user

`buildWhatsAppMessage()` in `lib/whatsapp.ts` will be scaffolded with its signature,
types, and a marked `TODO`, for the user to implement (5–10 lines). The message is the
clinic's first line to a patient; its tone, field order, and phrasing are a business
judgment, not a technical one. Trade-offs to weigh: a terse message is easier for staff
to scan at a glance, while a fuller one avoids a follow-up round trip asking for details
the patient already typed.

## 10. SEO

Currently missing entirely; all of the following is new:

- Per-route `metadata` exports — replaces the four
  `"DentaCare - Free Bootstrap 4 Template by Colorlib"` titles and supplies the
  descriptions absent from all seven pages.
- Open Graph and Twitter card tags, so shared links render a preview.
- Canonical URLs.
- `app/sitemap.ts` and `app/robots.ts`.
- `LocalBusiness` / `Dentist` JSON-LD generated from `clinic.ts` — name, address,
  geo, opening hours, telephone. This is the primary signal for Google's local map pack,
  which a single-location clinic depends on and the site currently provides none of.
- One `<h1>` per page (the homepage currently has two).
- Descriptive `alt` text replacing the seven `alt="Image placeholder"` instances.

## 11. Verification

Claims in this document are to be measured, not asserted.

**Build gates** — must pass before any merge:
- `pnpm tsc --noEmit` clean
- `pnpm next build` clean, no warnings
- `pnpm lint` clean

**Unit (Vitest + Testing Library)** — logic with branches worth testing:
- `buildWhatsAppMessage()` — encoding, field inclusion, optional-field omission
- `lib/hours.ts` — weekday vs. Sunday slot generation, boundary times, no pre-opening slots
- `AppointmentForm` validation — required fields, phone/email format, submit behavior
- `useCountUp` — terminal value, triggers once on intersection

**E2E (Playwright):**
- All 7 routes return 200; `/teacher-single.html` and other legacy paths redirect correctly
- Zero console errors on every route
- Zero failed network requests on every route
- Mobile nav opens and closes; appointment modal opens, validates, and composes the
  correct `wa.me` URL (intercepted, not opened)
- Content assertion: no page renders "DentaCare", "203 Fake St", or
  "info@yourdomain.com" **except** where `content/` deliberately supplies it — this
  distinguishes intentionally-ported placeholders from accidental template residue

**Performance — a merge gate, not a report.** Lighthouse is run against the current site
and the migrated site and recorded side by side, evidencing the §8 weight reductions. The
**mobile** performance score must not regress against the current static site. Since the
chosen direction (§4.1) adds a 3D set-piece and a WASM runtime the current site does not
carry, this gate is what keeps the direction honest: if the mobile score regresses, the
motion budget is cut, not the gate.

Additionally, on a simulated mid-range Android profile (4× CPU throttle, Slow 4G):
- First Contentful Paint under 2.0 s
- The 3D set-piece must not appear in the critical path — verified by confirming the page
  reaches interactive with the R3F chunk still unloaded
- Every R3F and animated-SVG surface renders its static fallback under
  `prefers-reduced-motion`

## 12. Migration and cutover

Work happens on `feat/nextjs`, never directly on `main`.

1. Scaffold Next.js, TypeScript, Tailwind; establish the theme from existing brand colors.
2. Build `content/` modules by extracting every string from the current HTML.
3. Build `ui/` primitives, then `layout/` (Header, Footer, MobileNav).
4. Build `sections/` components.
5. Compose routes, one page at a time, homepage last (it is the most complex).
6. Booking form and `lib/whatsapp.ts` scaffold; hand off `buildWhatsAppMessage()`.
7. Reprocess images; wire `next/image`.
8. SEO layer: metadata, sitemap, robots, JSON-LD.
9. Tests: unit, then E2E.
10. Lighthouse comparison.
11. **Final commit only:** delete `*.html`, `css/`, `js/`, `scss/`, `fonts/`, and
    `prepros-6.config`.

Deleting the old site last means every intermediate commit still contains the original
for side-by-side diffing, and a revert at any point yields a working site.

`vercel.json` is replaced; Next.js on Vercel needs no `builds`/`routes` configuration.
Vercel Analytics is retained via `@vercel/analytics/react`.

## 13. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| **3D/WASM regresses mobile performance** | **High** | Hard merge gate (§11); everything lazy-loaded; static fallbacks; motion budget cut before the gate is |
| Procedural geometry reads as cheap rather than crafted | Medium | Quality lives in lighting, material and motion, not polygon count; benchmark against LAVA's restraint before merge; every 3D surface has a designed static fallback that must stand on its own |
| Stylized 3D reads as gimmicky rather than reassuring on a clinic site | Medium | One set-piece only, not a 3D site; illustration carries warmth; review against LAVA's restraint benchmark before merge |
| Tailwind rebuild drifts visually from expectation | Medium | Page-by-page review; brand colors and photography preserved; user reviews before merge |
| Placeholder content ships again on the new stack | Certain — accepted (§4.2) | `content/` makes removal a one-line edit; E2E test distinguishes deliberate from accidental |
| WhatsApp excludes some patients | Low | Phone and email visible on every page |
| Blog slugs differ from `blog-single.html`, breaking inbound links | Low | Only one blog URL exists today and it is not a real article; redirect it to `/blog` |
| Image conversion degrades staff photo quality | Low | Visual check against originals at display size before old images are deleted |
| Exposed Maps API key remains billable | Certain until revoked | Flagged in §7.2 as an action outside this migration |

## 14. Open questions

**Resolved:**

1. **Asset sourcing for §4.1 — procedural, in code.** Decided 2026-08-30. All 3D geometry
   is generated in React Three Fiber and all illustration is inline SVG authored in the
   repository. No commissioned assets, no marketplace models, no third-party design tool,
   no lead time, no cost. This resolves the only item that was blocking visual
   completion, and it constrains the direction to *abstract warm 3D* rather than
   character mascots (§4.6).

**Deferred by decision, not unresolved:**

2. Placeholder content cleanup — deferred to a separate pass (§4.2).
3. Whether to reinstate parallax — dropped, reversible (§4.5).

**Noted, outside scope:** the exposed Google Maps API key should be revoked or
referrer-restricted regardless of this migration (§7.2).
