import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { Services } from '@/components/sections/Services'
import { Achievements } from '@/components/sections/Achievements'
import { PricingTable } from '@/components/sections/PricingTable'
import { statsInner } from '@/content/stats'
import { pricingUSD } from '@/content/pricing'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Teeth whitening, cleaning, orthodontics, pain-free treatment, dental implants and 24/7 emergency care in Sawai Madhopur.',
}

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero title="Our Service Keeps you Smile" crumb="Services" />
      <Services />
      <Achievements stats={statsInner} />
      {/* Pricing section commented out at the client's request. */}
      {/* <PricingTable tiers={pricingUSD} /> */}
    </main>
  )
}
