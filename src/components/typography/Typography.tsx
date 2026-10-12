import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

/**
 * Typography system (docs/DESIGN.md §3). All text styles come from here so
 * sizes stay on the token scale. `as` sets semantics; `size` sets appearance.
 */

type HeadingSize = 'display-xl' | 'display' | 'h1' | 'h2' | 'h3' | 'h4'

const headingSize: Record<HeadingSize, string> = {
  'display-xl': 'text-display-xl',
  display: 'text-display',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
}

type TextTag = 'p' | 'span' | 'div' | 'li' | 'dt' | 'dd' | 'figcaption' | 'h2' | 'h3'

interface BaseProps {
  children: ReactNode
  className?: string
  id?: string
}

export function Heading({
  as: Tag = 'h2',
  size = 'h2',
  italic = false,
  children,
  className,
  id,
}: BaseProps & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'; size?: HeadingSize; italic?: boolean }) {
  return (
    <Tag id={id} className={cx('font-display font-normal text-fg', headingSize[size], italic && 'italic', className)}>
      {children}
    </Tag>
  )
}

export function Eyebrow({ as: Tag = 'p', children, className, id }: BaseProps & { as?: TextTag }) {
  return (
    <Tag id={id} className={cx('label text-fg-muted', className)}>
      {children}
    </Tag>
  )
}

export function Lead({ children, className }: BaseProps) {
  return <p className={cx('text-lead text-fg', className)}>{children}</p>
}

const textSize = { body: 'text-body', small: 'text-small', caption: 'text-caption' } as const

export function Text({ as: Tag = 'p', muted = false, size = 'body', children, className }: BaseProps & { as?: TextTag; muted?: boolean; size?: keyof typeof textSize }) {
  return <Tag className={cx(textSize[size], muted ? 'text-fg-muted' : 'text-fg', className)}>{children}</Tag>
}

/** Large serif numerals for section indices (01/02/03) and statistics. */
export function Numeral({ children, accent = true, className }: BaseProps & { accent?: boolean }) {
  return (
    <span className={cx('font-display text-numeral tabular-nums', accent ? 'text-accent' : 'text-fg', className)} aria-hidden="true">
      {children}
    </span>
  )
}
