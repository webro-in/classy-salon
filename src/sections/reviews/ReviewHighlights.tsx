import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Reveal } from '@/components/motion/Reveal'
import { showContentMarkers } from '@/config/site'
import { featuredReviews, reviewsPageCopy } from '@/data/reviews'
import { cx } from '@/lib/cx'
import { ReviewItem } from './ReviewItem'

/**
 * Featured genuine reviews as large pull-quotes, alternating alignment.
 * No approved reviews yet: a development-only pending layout; production
 * renders nothing (and the strict build fails until reviews are supplied).
 */
export function ReviewHighlights() {
  if (featuredReviews.length === 0) {
    if (!showContentMarkers) return null
    return (
      <Section tone="ivory" labelledBy="highlights-title" className="relative">
        <Container>
          <p className="label text-fg-muted">{reviewsPageCopy.highlights.eyebrow}</p>
          <h2 id="highlights-title" className="mt-4 font-display text-h2">{reviewsPageCopy.highlights.title}</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2" data-reviews-pending>
            {[0, 1].map((i) => (
              <div key={i} className={cx('border-t border-dashed border-rule pt-6', i === 1 && 'md:mt-24')}>
                <span aria-hidden="true" className="block font-display text-[5rem] leading-none text-accent/40">“</span>
                <ContentMarker kind="reviews" className="-mt-4">featured review {i + 1}: the reviewer&apos;s exact words, their name as shown on the source, and rating/date only if the source shows them (content/reviews.json)</ContentMarker>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section tone="ivory" labelledBy="highlights-title">
      <Container>
        <p className="label text-fg-muted">{reviewsPageCopy.highlights.eyebrow}</p>
        <h2 id="highlights-title" className="mt-4 font-display text-h2">{reviewsPageCopy.highlights.title}</h2>
        <ul className="mt-14 space-y-20 md:space-y-28">
          {featuredReviews.map((r, i) => (
            <li key={r.id} className={cx('max-w-[52rem]', i % 2 === 1 && 'md:ml-auto')}>
              <Reveal>
                <p className="mb-4 label text-fg-muted">{reviewsPageCopy.highlights.item}</p>
                <ReviewItem review={r} size="feature" />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
