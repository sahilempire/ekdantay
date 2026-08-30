import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { Services } from '@/components/sections/Services'
import { Achievements } from '@/components/sections/Achievements'
import { PricingTable } from '@/components/sections/PricingTable'
import { statsInner } from '@/content/stats'
import { pricingUSD } from '@/content/pricing'
import { services } from '@/content/services'
import { JsonLd, clinicNode, websiteNode, breadcrumbNode } from '@/components/JsonLd'
import { absolute, pageUrl, ID } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Dental Services',
  description:
    'Teeth whitening, scaling and cleaning, braces and aligners, pain-free treatment, dental implants and 24/7 emergency dental care in Sawai Madhopur, Rajasthan.',
  ...pageUrl('/services'),
}

export default function ServicesPage() {
  return (
    <main id="main">
      <JsonLd
        nodes={[
          clinicNode(),
          websiteNode(),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
          /* An explicit list, so each treatment can surface as its own result
             rather than being buried in the Dentist node's availableService. */
          {
            '@type': 'ItemList',
            '@id': `${absolute('/services')}#services`,
            name: 'Dental services at Ekdantay',
            itemListElement: services.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'MedicalProcedure',
                name: s.title,
                description: s.blurb,
                provider: { '@id': ID.clinic },
              },
            })),
          },
        ]}
      />
      <PageHero title="Our Service Keeps you Smile" crumb="Services" />
      <Services />
      <Achievements stats={statsInner} />
      {/* Pricing section commented out at the client's request. */}
      {/* <PricingTable tiers={pricingUSD} /> */}
    </main>
  )
}
