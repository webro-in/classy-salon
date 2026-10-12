import type { ReactNode } from 'react'
import { showContentMarkers } from '@/config/site'
import { cx } from '@/lib/cx'

type MarkerKind = 'data' | 'confirm' | 'story' | 'faq' | 'description' | 'media' | 'reviews' | 'legal' | 'legalName' | 'policy'

const prefix: Record<MarkerKind, string> = {
  data: 'CLIENT DATA REQUIRED',
  confirm: 'CONFIRM WITH CLIENT',
  story: 'CLIENT STORY REQUIRED',
  faq: 'CLIENT FAQ CONTENT REQUIRED',
  description: 'CLIENT DESCRIPTION REQUIRED',
  media: 'MEDIA PLACEHOLDER',
  reviews: 'CLIENT REVIEWS REQUIRED',
  legal: 'LEGAL DETAILS REQUIRED',
  legalName: 'LEGAL BUSINESS NAME REQUIRED',
  policy: 'CLIENT POLICY REQUIRED',
}

/**
 * Developer-visible marker for unresolved client content.
 * Rendered in dev/preview builds only; returns nothing in strict production
 * builds (where `npm run content:check:strict` also blocks the release).
 */
export function ContentMarker({ kind = 'data', children, inline = false, className }: { kind?: MarkerKind; children?: ReactNode; inline?: boolean; className?: string }) {
  if (!showContentMarkers) return null
  const Tag = inline ? 'span' : 'p'
  return (
    <Tag
      data-content-marker={kind}
      className={cx(
        'border border-dashed border-current px-2 py-1 font-mono text-caption tracking-normal text-fg-muted normal-case',
        inline ? 'inline-block' : 'block w-fit max-w-full',
        className,
      )}
    >
      [{prefix[kind]}{children ? <>: {children}</> : null}]
    </Tag>
  )
}
