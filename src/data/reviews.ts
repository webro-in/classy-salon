/**
 * Reviews data (single source for review text). Never hard-code review text
 * in JSX. The aggregate rating is business data: content/business.json → rating.
 */
import raw from '@content/reviews.json'
import { parseContent, valueOf } from '@/lib/content'
import { reviewsSchema, type Review } from '@/types/content'
import { business, googleRating } from './business'

const data = parseContent('reviews', reviewsSchema, raw)

export type { Review }

/** All approved reviews, in the order supplied. */
export const reviews: Review[] = data.reviews
/** Featured reviews for the highlights (falls back to the first two when none are marked). */
export const featuredReviews: Review[] = (() => {
  const marked = reviews.filter((r) => r.featured)
  return (marked.length ? marked : reviews.slice(0, 2)).slice(0, 3)
})()
/** Reviews for the full list: everything not already featured. */
export const listReviews: Review[] = reviews.filter((r) => !featuredReviews.includes(r))

/** Direct review link when supplied, otherwise the verified Maps listing. */
export const googleReviewsUrl = valueOf(data.googleReviewsUrl) ?? valueOf(business.mapsUrl)
export const rating = business.rating
export { googleRating }

/** Kept for the Home reviews chapter (first three approved quotes). */
export const reviewQuotes = reviews

/** "2026-09-14" → "14 September 2026" (only used when a date is supplied). */
export function formatReviewDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${d} ${months[m - 1]} ${y}`
}

/** Reviews page copy (WEBRO draft, client review). No claims beyond the verified rating. */
export const reviewsPageCopy = {
  hero: {
    title: 'Reviews',
    lead: 'What our clients say about Classy, in their own words.',
  },
  rating: {
    eyebrow: 'Google rating',
    outOf: 'out of 5',
    countSuffix: 'Google reviews',
    note: 'Rating and review count as shown on Classy’s Google listing.',
    checked: 'Last checked',
  },
  highlights: { eyebrow: 'In their words', title: 'Highlights', item: 'Featured Review' },
  list: { eyebrow: 'More reviews', title: 'From our clients', lead: 'A selection of experiences shared by clients at Classy Unisex Salon, Jagatpura.', more: 'Show more reviews', less: 'Show fewer reviews' },
  google: {
    eyebrow: 'On Google',
    title: 'Read every review on Google.',
    lead: 'See all reviews of Classy Unisex Salon on our Google listing.',
    action: 'Read our Google reviews',
  },
  book: {
    eyebrow: 'Visit Classy',
    title: 'Experience it for yourself.',
    lead: 'Send us a message on WhatsApp with what you have in mind, and we will reply to confirm availability.',
    book: 'Book an appointment',
    whatsapp: 'WhatsApp us',
  },
} as const
