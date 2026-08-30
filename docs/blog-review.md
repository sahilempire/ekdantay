# Blog: clinical review before launch

Twelve articles now sit at `/blog`, replacing the eleven copies of the same
lorem paragraph ported from `legacy/blog.html`.

**They are bylined "Dr. Divya Bharti" and they have not been read by her.**
That is the one outstanding item. Everything else on this page is context for
that review.

## Why this matters more than for ordinary web copy

Every article makes claims about diagnosis and treatment under the name of a
practising dentist, on the website of a real clinic. Two things follow:

- Patients will act on it. The avulsion article in particular tells people what
  to do with a knocked-out tooth in the thirty minutes before they reach us.
- Google holds health content to a higher bar than other content, and an
  identifiable, credentialled author is a large part of clearing it. That
  benefit only exists if the byline is true.

## What was done to keep the claims defensible

- Every article carries a `sources` array, rendered as a References section at
  the foot of the page, and emitted as `citation` in the Article structured
  data. The sources are the WHO oral health fact sheet, Cochrane reviews, the
  IADT trauma guidelines and named systematic reviews.
- Every pulled-out figure carries the body it came from, on the page, next to
  the number.
- Figures were checked against the source rather than written from memory. The
  root canal article deliberately reports both the pooled success range
  (68 to 85 percent) and the survival figures (about 93 percent at four to five
  years, about 87 percent at eight to ten), and explains that clinics quoting
  the high nineties are quoting survival, because that distinction is the most
  useful thing on the page.
- No price is quoted in any article. Prices live in `content/pricing.ts` and in
  the scroll sequence, so they change in one place.
- Every article ends with a disclaimer that it is general information and not a
  diagnosis.

## What to check, per article

1. Does anything contradict how you actually practise or what you tell patients?
2. Are the risks stated honestly enough? Several articles deliberately include
   caveats a marketing page would omit: peri-implantitis rates and the roughly
   fourfold risk with a history of periodontitis, that periodontal bone loss
   does not reverse, that prophylactic removal of healthy wisdom teeth is not
   supported, that retention after orthodontics is effectively lifelong.
3. `knocked-out-tooth-first-aid` is the one to read most carefully. It gives
   step-by-step first aid, and it says explicitly not to replant a primary
   tooth.
4. Timings and treatment sequences: number of visits, healing periods, recovery
   expectations. These are stated as typical ranges and should match this
   clinic.
5. Anything you would rather say differently in your own voice.

If you would rather not carry the byline, change `author` in the twelve files
under `content/articles/` to the clinic name. The Article structured data uses
whatever is there.

## Where things are

| What | Where |
| --- | --- |
| One article per file | `content/articles/*.ts` |
| Assembly, reading time, related posts | `content/posts.ts` |
| Block types, `Faq`, `Source` | `content/types.ts` |
| Page and structured data | `app/blog/[slug]/page.tsx` |
| Renderer for the block types | `components/blog/ArticleBody.tsx` |

## Adding another article later

Create a file in `content/articles/`, export a `Post`, and add it to the array
in `content/posts.ts`. The test suite then enforces: a unique slug, title and
description, a description of usable length, a search title under 65
characters, real image alt text, over 600 words, an opening paragraph rather
than a heading, at least one source, at least three FAQ entries phrased as
questions, no dangling `related` slug, and no em dashes.

Set `service` only if the article is *the* explainer for one of the six
services, and only one article may claim each. That is what puts the "How this
works" link on the service card.
