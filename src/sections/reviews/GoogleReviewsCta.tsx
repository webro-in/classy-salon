import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { googleRating, googleReviewsUrl, reviewsPageCopy } from '@/data/reviews'
import { trackMapsClick } from '@/lib/analytics'

/**
 * Strong link out to the salon's Google listing (verified URL). A plain link:
 * no scraped or embedded "live" review feed.
 */
export function GoogleReviewsCta() {
  if (!googleReviewsUrl) return null
  return (
    <Section tone="taupe" labelledBy="google-cta-title">
      <Container>
        <div className="grid-editorial items-center gap-y-10">
          <Reveal className="col-span-full lg:col-span-6">
            <p className="label text-fg-muted">{reviewsPageCopy.google.eyebrow}</p>
            <h2 id="google-cta-title" className="mt-5 max-w-[16ch] font-display text-h1">{reviewsPageCopy.google.title}</h2>
            <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">
              {reviewsPageCopy.google.lead}
              {googleRating && <> {googleRating.countLabel} {reviewsPageCopy.rating.countSuffix} · {googleRating.display} {reviewsPageCopy.rating.outOf}.</>}
            </p>
            <div className="mt-9">
              <Button to={googleReviewsUrl} external variant="solid" icon="arrow-up-right" iconPosition="end" onClick={() => trackMapsClick('reviews-google-cta')}>
                {reviewsPageCopy.google.action}
              </Button>
            </div>
          </Reveal>
          <MediaReveal slot="reviewsGoogle" sizes="(min-width: 1024px) 40vw, 100vw" wrapperClassName="col-span-full lg:col-span-5 lg:col-start-8" />
        </div>
      </Container>
    </Section>
  )
}
