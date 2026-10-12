import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { Eyebrow, Heading } from '@/components/typography/Typography'
import { cx } from '@/lib/cx'

interface ChapterHeaderProps {
  eyebrow: string
  title: ReactNode
  /** id of the heading: the section uses it as its accessible name. */
  headingId: string
  intro?: ReactNode
  /** Optional link/button aligned to the header's end. */
  action?: ReactNode
  size?: 'h1' | 'h2'
  className?: string
}

/**
 * Shared chapter opening (eyebrow, serif heading, optional intro and
 * action, hairline below). Keeps the editorial rhythm identical across sections.
 */
export function ChapterHeader({ eyebrow, title, headingId, intro, action, size = 'h2', className }: ChapterHeaderProps) {
  return (
    <Reveal className={cx('grid-editorial items-end gap-y-6 border-b border-rule pb-8 lg:pb-10', className)}>
      <div className="col-span-full lg:col-span-8">
        <Eyebrow>
          {eyebrow}
        </Eyebrow>
        <Heading id={headingId} size={size} className="mt-4 max-w-[22ch]">{title}</Heading>
        {intro && <div className="mt-5 max-w-prose text-lead text-fg-muted">{intro}</div>}
      </div>
      {action && <div className="col-span-full flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">{action}</div>}
    </Reveal>
  )
}
