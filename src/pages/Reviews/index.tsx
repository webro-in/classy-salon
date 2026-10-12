import { Seo } from '@/components/seo/Seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildReviewsPageJsonLd } from '@/config/seo'
import { ReviewsHero } from '@/sections/reviews/ReviewsHero'
import { RatingSummary } from '@/sections/reviews/RatingSummary'
import { ReviewHighlights } from '@/sections/reviews/ReviewHighlights'
import { ReviewList } from '@/sections/reviews/ReviewList'
import { GoogleReviewsCta } from '@/sections/reviews/GoogleReviewsCta'
import { ReviewsCta } from '@/sections/reviews/ReviewsCta'

/**
 * Reviews. Tone cadence: white hero · cream rating · white highlights + list
 * (genuine approved reviews only) · taupe Google CTA · white booking CTA →
 * dark footer. Typography-led; the only photo is the salon hero image.
 */
export function Component() {
  return (
    <>
      <Seo route="reviews" />
      <JsonLd data={buildReviewsPageJsonLd()} />
      <ReviewsHero />
      <RatingSummary />
      <ReviewHighlights />
      <ReviewList />
      <GoogleReviewsCta />
      <ReviewsCta />
    </>
  )
}
