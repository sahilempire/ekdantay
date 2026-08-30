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
import { statsHome } from '@/content/stats'
import { pricingINR } from '@/content/pricing'

export default function Home() {
  return (
    <main id="main">
      <ScrollStory />

      <section aria-hidden className="border-y border-line bg-surface">
        <Marquee items={services.map((s) => s.title)} />
      </section>

      <Services limit={6} />
      <Achievements stats={statsHome} />
      <TeamGrid limit={4} />
      <PricingTable tiers={pricingINR} blurb="Clear, upfront pricing for our most common treatments." />
      <RecentPosts limit={3} />

      <section aria-label="Clinic location" className="border-t border-line">
        <MapEmbed height={420} />
      </section>
    </main>
  )
}
