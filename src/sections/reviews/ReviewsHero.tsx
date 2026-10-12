import { PATHS } from '@/app/paths'
import { Button } from '@/components/buttons/Button'
import { PageHero } from '@/components/sections/PageHero'
import { googleReviewsUrl, reviewsPageCopy } from '@/data/reviews'
import { trackMapsClick } from '@/lib/analytics'
import { ReviewsWhatsAppButton } from './ReviewsCta'

/** Reviews opening: breadcrumbs, "Reviews" h1, editorial lead, Google + WhatsApp actions, salon image. */
export function ReviewsHero() {
  return (
    <PageHero
      trail={[{ name: 'Home', path: PATHS.home }, { name: 'Reviews', path: PATHS.reviews }]}
      title={reviewsPageCopy.hero.title}
      lead={reviewsPageCopy.hero.lead}
      slot="reviewsHero"
      aside={
        <div className="flex flex-wrap gap-3">
          {googleReviewsUrl && (
            <Button to={googleReviewsUrl} external variant="solid" icon="arrow-up-right" iconPosition="end" onClick={() => trackMapsClick('reviews-hero')}>
              {reviewsPageCopy.google.action}
            </Button>
          )}
          <ReviewsWhatsAppButton location="reviews-hero" variant="outline" />
        </div>
      }
    />
  )
}
