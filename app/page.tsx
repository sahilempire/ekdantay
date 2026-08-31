import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { ScrollStory } from '@/components/scrollstory/ScrollStory'
import { Marquee } from '@/components/motion/Marquee'
import { Services } from '@/components/sections/Services'
import { Achievements } from '@/components/sections/Achievements'
import { TeamGrid } from '@/components/sections/TeamGrid'
import { PricingTable } from '@/components/sections/PricingTable'
import { RecentPosts } from '@/components/sections/RecentPosts'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { clinic } from '@/content/clinic'
import { services } from '@/content/services'
import { stats } from '@/content/stats'
import { pricingINR } from '@/content/pricing'
import { JsonLd, clinicNode, websiteNode } from '@/components/JsonLd'
import { pageUrl } from '@/lib/seo'

/* Title and description come from the root layout's defaults; only the
   canonical is page-specific. Every route sets its own now, see lib/seo. */
export const metadata: Metadata = pageUrl('/')

export default function Home() {
  return (
    <main id="main">
      <JsonLd nodes={[clinicNode(), websiteNode()]} />
      <ScrollStory />

      <section aria-hidden className="border-y border-line bg-surface">
        <Marquee items={services.map((s) => s.title)} />
      </section>

      <Services limit={6} />
      <Achievements stats={stats} />
      <TeamGrid limit={4} />
      {/* Pricing section commented out at the client's request. The rupee
          tiers still live in content/pricing.ts, so restoring it is
          uncommenting this line. */}
      {/* <PricingTable tiers={pricingINR} blurb="Clear, upfront pricing for our most common treatments." /> */}
      <RecentPosts limit={3} />

      <section aria-label="Clinic location" className="border-t border-line">
        <MapEmbed height={420} />
      </section>
    </main>
  )
}
