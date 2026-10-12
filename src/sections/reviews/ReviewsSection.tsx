import { PATHS } from '@/app/paths'
import { CountUp } from '@/components/motion/CountUp'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { homeCopy } from '@/data/home'
import { googleReviewsUrl, rating, reviewQuotes } from '@/data/reviews'
import { valueOf } from '@/lib/content'
import { trackMapsClick } from '@/lib/analytics'

/**
 * Chapter 9: Reviews. Shows only the verified rating and genuine quotes the
 * client has permission to publish (content/reviews.json). Nothing is invented:
 * while data is pending the blocks are omitted in production.
 */
export function ReviewsSection() {
  const verified = valueOf(rating)
  const quotes = reviewQuotes.slice(0, 3)

  return (
    <Section tone="taupe" id="reviews" labelledBy="reviews-title">
      <Container>
        <ChapterHeader
          eyebrow={homeCopy.reviews.eyebrow}
          title={homeCopy.reviews.title}
          headingId="reviews-title"
          action={
            <>
              {googleReviewsUrl && (
                <Button to={googleReviewsUrl} variant="solid" icon="arrow-up-right" iconPosition="end" onClick={() => trackMapsClick('home-reviews')}>
                  {homeCopy.reviews.action}
                </Button>
              )}
              <Button to={PATHS.reviews} variant="outline">{homeCopy.reviews.more}</Button>
            </>
          }
        />

        <div className="mt-12 grid-editorial gap-y-12">
          <Reveal className="col-span-full lg:col-span-4">
            {verified ? (
              <div>
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-[clamp(5rem,3rem+8vw,10rem)] leading-[0.85]"><CountUp value={verified.value} decimals={1} /></span>
                  <span className="text-lead text-fg-muted">/ 5</span>
                </p>
                <p className="mt-3 label text-fg-muted">{verified.countLabel} Google reviews</p>
              </div>
            ) : (
              <ContentMarker>verified Google rating and review count (business.rating)</ContentMarker>
            )}
          </Reveal>

          <div className="col-span-full lg:col-span-7 lg:col-start-6">
            {quotes.length > 0 ? (
              <Reveal as="ul" stagger className="divide-y divide-rule border-y border-rule">
                {quotes.map((q) => (
                  <li key={q.id} className="py-8">
                    <figure>
                      <blockquote className="font-display text-h3 text-fg">“{q.quote}”</blockquote>
                      <figcaption className="mt-4 label text-fg-muted">{q.author}{q.source ? ` · ${q.source}` : ''}</figcaption>
                    </figure>
                  </li>
                ))}
              </Reveal>
            ) : (
              <ContentMarker kind="data">genuine review quotes with client permission (content/reviews.json). Hidden until supplied</ContentMarker>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
