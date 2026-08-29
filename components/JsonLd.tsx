import { clinic } from '@/content/clinic'
import { services } from '@/content/services'

/**
 * Dentist / LocalBusiness structured data.
 *
 * This is the primary signal for Google's local map pack, which a
 * single-location clinic depends on for discovery - and the legacy site
 * emitted none at all. Built from `clinic` so the hours and address here can
 * never disagree with what the page renders.
 */
export function JsonLd() {
  const { weekdays, sunday } = clinic.hours

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: clinic.name,
    description: clinic.tagline,
    url: 'https://www.ekdantay.com',
    telephone: clinic.phone.display,
    email: clinic.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.lines[0],
      addressLocality: 'Sawai Madhopur',
      addressRegion: 'Rajasthan',
      postalCode: '322001',
      addressCountry: 'IN',
    },
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
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
