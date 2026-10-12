import { formatReviewDate, type Review } from '@/data/reviews'
import { cx } from '@/lib/cx'

/**
 * One review, editorial: verbatim quote in the serif, then only the details
 * the source supplied (name, rating as text, source, date). Semantic
 * figure/blockquote/figcaption; quote marks are decorative.
 */
export function ReviewItem({ review, size = 'list' }: { review: Review; size?: 'feature' | 'list' }) {
  const meta = [
    review.source ? `${review.source} Review` : null,
    review.date ? formatReviewDate(review.date) : review.dateLabel ?? null,
  ].filter(Boolean) as string[]

  return (
    <figure data-review={review.id} className="relative">
      <span aria-hidden="true" className={cx('block font-display leading-none text-accent', size === 'feature' ? 'text-[5rem] md:text-[7rem]' : 'text-[3rem]')}>“</span>
      <blockquote className={cx('font-display text-fg', size === 'feature' ? '-mt-6 text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] leading-[1.12] md:-mt-10' : '-mt-3 text-h4 leading-snug')}>
        <p>{review.quote}</p>
      </blockquote>
      <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <cite className="label not-italic text-fg">{review.author}</cite>
        <span className="flex flex-wrap items-baseline gap-x-2 text-caption text-fg-muted">
          {review.rating !== undefined && (
            <span role="img" aria-label={`Rated ${review.rating} out of 5`} className="tracking-[0.12em] text-accent" data-review-stars>
              {'★'.repeat(Math.floor(review.rating))}{review.rating % 1 ? '½' : ''}
            </span>
          )}
          {meta.map((m) => (
            <span key={m}><span aria-hidden="true">· </span>{m}</span>
          ))}
        </span>
      </figcaption>
    </figure>
  )
}
