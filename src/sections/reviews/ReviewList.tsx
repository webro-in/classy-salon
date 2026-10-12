import { useState } from 'react'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { showContentMarkers } from '@/config/site'
import { listReviews, reviews, reviewsPageCopy } from '@/data/reviews'
import { ReviewItem } from './ReviewItem'

const INITIAL = 8

/**
 * Full list of approved reviews: two editorial columns with hairline
 * separators and an offset second column. Scales to any number of reviews
 * ("Show more" after eight). No per-item animation by design.
 */
export function ReviewList() {
  const [expanded, setExpanded] = useState(false)
  if (listReviews.length === 0) {
    if (!showContentMarkers || reviews.length > 0) return null
    return (
      <Section tone="ivory" spacing="small" labelledBy="list-title">
        <Container>
          <div className="border-t border-rule pt-10">
            <p className="label text-fg-muted">{reviewsPageCopy.list.eyebrow}</p>
            <h2 id="list-title" className="mt-4 font-display text-h3">{reviewsPageCopy.list.title}</h2>
            <ContentMarker kind="reviews" className="mt-6">full review list: every further approved review, verbatim, in two editorial columns (content/reviews.json)</ContentMarker>
          </div>
        </Container>
      </Section>
    )
  }

  const shown = expanded ? listReviews : listReviews.slice(0, INITIAL)
  return (
    <Section tone="ivory" spacing="small" labelledBy="list-title">
      <Container>
        <div className="border-t border-rule pt-10">
          <p className="label text-fg-muted">{reviewsPageCopy.list.eyebrow}</p>
          <h2 id="list-title" className="mt-4 font-display text-h3">{reviewsPageCopy.list.title}</h2>
          <p className="mt-4 max-w-[52ch] text-body text-fg-muted">{reviewsPageCopy.list.lead}</p>
        </div>
        <ul id="review-list" className="mt-10 grid gap-x-(--spacing-gutter) md:grid-cols-2 md:[&>li:nth-child(even)]:translate-y-16">
          {shown.map((r) => (
            <li key={r.id} className="border-t border-rule py-10">
              <ReviewItem review={r} />
            </li>
          ))}
        </ul>
        {listReviews.length > INITIAL && (
          <div className="mt-20 flex justify-center">
            <Button variant="outline" onClick={() => setExpanded((v) => !v)} ariaExpanded={expanded} ariaControls="review-list">
              {expanded ? reviewsPageCopy.list.less : reviewsPageCopy.list.more}
            </Button>
          </div>
        )}
      </Container>
    </Section>
  )
}
