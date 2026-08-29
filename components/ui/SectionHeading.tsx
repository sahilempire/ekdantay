import { Reveal } from '@/components/motion/Reveal'

interface Props {
  eyebrow?: string
  title: string
  blurb?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, blurb, align = 'center' }: Props) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {blurb && <p className="mt-4 text-ink-soft">{blurb}</p>}
    </Reveal>
  )
}
