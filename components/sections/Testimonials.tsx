'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { testimonials } from '@/content/testimonials'

/**
 * One of only two genuine carousels on the site - the other is the homepage
 * hero. Everything else the legacy template wrapped in Owl Carousel held a
 * single slide.
 */
export function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: 'start' })

  return (
    <section className="border-y border-line bg-surface py-20">
      <Container>
        <SectionHeading eyebrow="Testimony" title="What Our Patients Say" />

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t, i) => (
              <figure
                key={`${t.name}-${i}`}
                className="min-w-0 flex-[0_0_100%] rounded-2xl border border-line bg-paper p-8 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <Quote size={22} className="text-accent" aria-hidden />
                <blockquote className="mt-4 text-sm text-ink-soft">{t.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="relative size-11 overflow-hidden rounded-full bg-surface-sunk">
                    <Image src={t.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => embla?.scrollPrev()}
            aria-label="Previous testimonial"
            className="rounded-full border border-line p-2.5 transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => embla?.scrollNext()}
            aria-label="Next testimonial"
            className="rounded-full border border-line p-2.5 transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </Container>
    </section>
  )
}
