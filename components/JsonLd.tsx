import { clinic } from '@/content/clinic'
import { services } from '@/content/services'
import { graphLd, absolute, ID, SITE_URL, type Crumb, breadcrumbLd } from '@/lib/seo'

/**
 * Renders a schema.org @graph as a JSON-LD script.
 *
 * Every page composes its own node list and passes it here, rather than a
 * single fixed blob being emitted from the root layout. That is what allows a
 * blog post to carry Article and FAQPage markup while the homepage carries the
 * business record.
 */
export function JsonLd({ nodes }: { nodes: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphLd(nodes)) }}
    />
  )
}

/**
 * The clinic itself: the primary signal for Google's local map pack, which a
 * single-location practice depends on for discovery.
 *
 * Built from `clinic` so the hours and address here can never disagree with
 * what the page renders.
 */
export function clinicNode() {
  const { weekdays, sunday } = clinic.hours

  return {
    '@type': 'Dentist',
    '@id': ID.clinic,
    name: clinic.name,
    description: clinic.tagline,
    url: SITE_URL,
    telephone: clinic.phone.display,
    email: clinic.email,
    image: absolute('/images/about.webp'),
    logo: absolute('/icon.svg'),
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.lines[0],
      addressLocality: 'Sawai Madhopur',
      addressRegion: 'Rajasthan',
      postalCode: '322001',
      addressCountry: 'IN',
    },
    // Named towns rather than a radius: this is a regional practice and the
    // surrounding places are where patients actually travel from.
    areaServed: ['Sawai Madhopur', 'Alanpur', 'Gangapur City', 'Bonli', 'Rajasthan'].map(
      (name) => ({ '@type': 'Place', name }),
    ),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      clinic.address.mapQuery,
    )}`,
    ...(clinic.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: clinic.geo.lat,
            longitude: clinic.geo.lng,
          },
        }
      : {}),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: weekdays.open,
        closes: weekdays.close,
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: sunday.open,
        closes: sunday.close,
      },
    ],
    sameAs: [clinic.socials.facebook, clinic.socials.instagram],
    availableService: services.map((s) => ({
      '@type': 'MedicalProcedure',
      name: s.title,
      description: s.blurb,
      url: absolute('/services'),
    })),
    medicalSpecialty: 'Dentistry',
  }
}

/** The site, so Google can attach a sitelinks search box and a publisher. */
export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: SITE_URL,
    name: clinic.name,
    inLanguage: 'en-IN',
    publisher: { '@id': ID.clinic },
  }
}

export function breadcrumbNode(crumbs: Crumb[]) {
  return breadcrumbLd(crumbs)
}
