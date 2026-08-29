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

export interface Post {
  slug: string
  title: string
  /** ISO date. The legacy site displayed "Sep. 20, 2018". */
  date: string
  author: string
  comments: number
  image: string
  excerpt: string
  body: string
}
