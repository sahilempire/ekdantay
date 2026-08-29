import Link from 'next/link'

type Variant = 'primary' | 'outline' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-60 disabled:pointer-events-none'

const sizes = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  outline: 'border border-line-strong text-ink hover:border-accent hover:text-accent',
  ghost: 'text-accent hover:bg-accent-wash',
}

interface Props {
  variant?: Variant
  size?: keyof typeof sizes
  className?: string
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { children, ...rest } = props
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props & { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = href.startsWith('http') || href.startsWith('tel:')
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if (external) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  )
}
