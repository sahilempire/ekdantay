import type { Faq } from '@/content/types'

/**
 * The article's FAQ.
 *
 * Plain <details> rather than a JS accordion: it opens without hydration, it
 * is keyboard and screen-reader accessible for free, and crucially the answers
 * are in the DOM whether or not the reader expands them, which is what lets
 * Google associate them with the FAQPage markup.
 *
 * The same `faq` array feeds that structured data, so the page and the markup
 * cannot drift apart.
 */
export function ArticleFaq({ items }: { items: Faq[] }) {
  return (
    <section aria-labelledby="faq-heading" className="mt-16 border-t border-line pt-10">
      <h2 id="faq-heading" className="text-2xl sm:text-3xl">
        Common questions
      </h2>
      <div className="mt-8 flex flex-col">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-line py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg">
              {item.q}
              <span
                aria-hidden
                className="mt-1 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
