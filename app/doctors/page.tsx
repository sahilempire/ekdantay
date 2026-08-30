import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { Achievements } from '@/components/sections/Achievements'
import { PricingTable } from '@/components/sections/PricingTable'
import { statsInner } from '@/content/stats'
import { pricingUSD } from '@/content/pricing'
import { team } from '@/content/team'
import { JsonLd, clinicNode, websiteNode, breadcrumbNode } from '@/components/JsonLd'
import { absolute, pageUrl, ID } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Our Dentists',
  description:
    'Meet the dentists at Ekdantay Dental Clinic in Sawai Madhopur: Dr. Divya Bharti, Dr. Yamini Sharma and the wider clinic team.',
  ...pageUrl('/doctors'),
}

export default function DoctorsPage() {
  return (
    <main id="main">
      <JsonLd
        nodes={[
          clinicNode(),
          websiteNode(),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Doctors', path: '/doctors' },
          ]),
          /* Only the genuine staff. The four DentaCare template entries are
             still rendered on the page, but publishing invented people as
             structured data about a real medical practice is a different
             thing entirely from leaving a placeholder photo up. */
          ...team
            .filter((m) => m.real)
            .map((m) => ({
              '@type': 'Person',
              name: m.name,
              jobTitle: m.role,
              image: absolute(m.image),
              worksFor: { '@id': ID.clinic },
            })),
        ]}
      />
      <PageHero title="Meet Our Experience Dentist" crumb="Doctors" />
      <TeamGrid title="Meet Our Experience Dentist" />
      <Achievements stats={statsInner} />
      {/* Pricing section commented out at the client's request. */}
      {/* <PricingTable tiers={pricingUSD} /> */}
    </main>
  )
}
