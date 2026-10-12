import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type Tone = 'ivory' | 'cream' | 'taupe' | 'dark'

interface SectionProps {
  tone?: Tone
  spacing?: 'default' | 'small' | 'none'
  /** Accessible name for the landmark: id of the section heading. */
  labelledBy?: string
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Page chapter. Sets the tone variables (light / cream / taupe / dark) so
 * children render correctly on any background, and applies section rhythm.
 */
export function Section({ tone = 'ivory', spacing = 'default', labelledBy, id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx(
        `tone-${tone}`,
        'bg-tone text-fg',
        spacing === 'default' && 'py-section',
        spacing === 'small' && 'py-section-sm',
        className,
      )}
    >
      {children}
    </section>
  )
}
