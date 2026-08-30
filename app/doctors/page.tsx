import type { Metadata } from 'next'
import { PageHero } from '@/components/sections/PageHero'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { Achievements } from '@/components/sections/Achievements'
import { PricingTable } from '@/components/sections/PricingTable'
import { statsInner } from '@/content/stats'
import { pricingUSD } from '@/content/pricing'

export const metadata: Metadata = {
  title: 'Our Doctors',
  description:
    'Meet the team at Ekdantay Dental Clinic: Dr. Divya Bharti, Dr. Yamini Sharma and the wider clinic staff.',
}

export default function DoctorsPage() {
  return (
    <main id="main">
      <PageHero title="Meet Our Experience Dentist" crumb="Doctors" />
      <TeamGrid title="Meet Our Experience Dentist" />
      <Achievements stats={statsInner} />
      {/* Pricing section commented out at the client's request. */}
      {/* <PricingTable tiers={pricingUSD} /> */}
    </main>
  )
}
