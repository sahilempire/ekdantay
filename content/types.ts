/**
 * Shapes for every content module.
 *
 * No user-visible string is hard-coded in JSX anywhere in this project. That
 * rule exists for a specific reason: the site deliberately ships placeholder
 * content carried over from the original template (spec 4.2) - fake staff,
 * USD pricing, lorem posts, a San Francisco address. Keeping every string
 * here means removing that later is a one-line edit rather than an
 * archaeological dig through components.
 */

/** 24-hour "HH:MM" strings. */
export interface DayHours {
  label: string
  open: string
  close: string
}

export interface Clinic {
  name: string
  tagline: string
  phone: {
    /** Human-readable, e.g. "+91 95878 15285" */
    display: string
    /** RFC 3966 href, e.g. "tel:+919587815285" */
    tel: string
    /** Digits only for wa.me, e.g. "919587815285" */
    whatsapp: string
  }
  email: string
  address: {
    lines: string[]
    /** Query string for the Google Maps embed. No API key involved. */
    mapQuery: string
  }
  /**
   * Exact clinic coordinates, for the `geo` property of the LocalBusiness
   * structured data. Deliberately optional and currently unset: putting a
   * guessed lat/long into schema.org markup is worse than omitting it, because
   * Google will happily place the map pin where you told it to.
   */
  geo?: { lat: number; lng: number }
  hours: {
    weekdays: DayHours
    sunday: DayHours
    emergency: string
  }
  socials: {
    facebook: string
    instagram: string
  }
  credit: {
    name: string
    url: string
  }
}

export interface Service {
  slug: string
  title: string
  /** lucide-react icon name */
  icon: string
  blurb: string
  /**
   * What this costs, as one display string.
   *
   * Lives here rather than in the scroll story's beats, which is where it
   * used to live. Two places rendering the same price is the drift that put a
   * San Francisco address in four footers on the legacy site, and the services
   * grid needed the same numbers the beats already had.
   */
  price: string
}

export interface StaffMember {
  name: string
  role: string
  image: string
  /**
   * True for the four genuine Ekdantay staff, false for the four entries
   * carried over from the DentaCare template. This flag is what turns the
   * eventual cleanup into `team.filter(m => m.real)`.
   */
  real: boolean
}

export interface PricingTier {
  title: string
  amount: string
  unit: string
  features: string[]
}

export interface StatSet {
  label: string
  value: number
}

export interface Testimonial {
  name: string
  role: string
  image: string
  quote: string
}

/**
 * One piece of an article body.
 *
 * Articles are structured blocks rather than a string of HTML for two
 * reasons: nothing user-authored is ever passed to dangerouslySetInnerHTML,
 * and the same `faq` array that renders on the page also feeds the FAQPage
 * structured data, so the two can never disagree.
 */
export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  /** A boxed aside. Used sparingly, for the one thing a reader must not miss. */
  | { kind: 'note'; title: string; text: string }
  /** A pulled-out figure with the study or body it came from. */
  | { kind: 'figure'; value: string; label: string; source: string }

export interface Faq {
  q: string
  a: string
}

/** A citation. Every clinical claim in an article traces back to one. */
export interface Source {
  label: string
  url: string
}

export interface Post {
  slug: string
  /** The on-page h1. */
  title: string
  /** The <title> tag, when a search-facing headline reads better than the h1. */
  seoTitle?: string
  /** Meta description. Written per post; never derived from the excerpt. */
  description: string
  /** ISO date first published. */
  date: string
  /** ISO date last reviewed. Google shows this, and health content needs it. */
  updated?: string
  author: string
  /** Groups posts on the index and gives the breadcrumb its middle rung. */
  category: string
  image: string
  /** Never empty: these images carry meaning in an article context. */
  imageAlt: string
  excerpt: string
  body: Block[]
  faq?: Faq[]
  sources?: Source[]
  /** Slugs of related posts. Internal links are most of a blog's SEO value. */
  related?: string[]
  /**
   * The one service this article is the explainer for, if any.
   *
   * Singular and unique on purpose. It was a list, and the services grid
   * resolved it with a `find`, so which article a service linked to depended
   * on the order of the posts array: "Pain-Free Treatment" pointed at the
   * wisdom teeth article rather than the root canal one purely because of
   * where it sat in the list. A test asserts no two posts claim the same
   * service, so the mapping cannot silently become ambiguous again.
   */
  service?: string
}
