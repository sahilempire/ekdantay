import type { Block } from '@/content/types'

/**
 * Renders an article's structured blocks.
 *
 * Articles are block arrays rather than HTML strings, so nothing here goes
 * near dangerouslySetInnerHTML and the heading levels are guaranteed to nest
 * correctly under the post's single h1. Search engines and screen readers both
 * care about that, and a hand-authored HTML blob reliably gets it wrong.
 */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return <p className="text-lg leading-relaxed text-ink-soft">{block.text}</p>

    case 'h2':
      return <h2 className="mt-6 text-2xl sm:text-3xl">{block.text}</h2>

    case 'h3':
      return <h3 className="mt-2 text-xl">{block.text}</h3>

    case 'ul':
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-lg leading-relaxed text-ink-soft">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'ol':
      return (
        <ol className="flex flex-col gap-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4 text-lg leading-relaxed text-ink-soft">
              <span
                aria-hidden
                className="tabular mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-wash text-sm font-semibold text-accent-ink"
              >
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )

    /* The one thing in an article a reader must not scroll past. */
    case 'note':
      return (
        <aside className="rounded-2xl border-l-4 border-accent bg-accent-wash/60 p-6 sm:p-7">
          <p className="font-display text-lg text-accent-ink">{block.title}</p>
          <p className="mt-3 leading-relaxed text-ink-soft">{block.text}</p>
        </aside>
      )

    /* A figure always carries the body it came from. An unattributed number
       on a medical page is the thing that makes the rest look unreliable. */
    case 'figure':
      return (
        <figure className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
          <p className="tabular font-display text-3xl text-accent sm:text-4xl">{block.value}</p>
          <figcaption className="mt-3 text-ink-soft">
            {block.label}
            <span className="mt-2 block text-sm text-muted">{block.source}</span>
          </figcaption>
        </figure>
      )
  }
}
