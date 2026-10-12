import { Button, type ButtonVariant } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Reveal } from '@/components/motion/Reveal'
import { reviewsPageCopy } from '@/data/reviews'
import { bookingCta } from '@/data/navigation'
import { trackBookingClick, trackWhatsAppClick } from '@/lib/analytics'
import { getGeneralWhatsAppUrl } from '@/lib/links'

/** "WhatsApp us" with the general appointment-enquiry message (never a booking confirmation). */
export function ReviewsWhatsAppButton({ location, variant = 'outline' }: { location: string; variant?: ButtonVariant }) {
  const href = getGeneralWhatsAppUrl()
  if (!href) return <ContentMarker inline>WhatsApp number</ContentMarker>
  return (
    <Button to={href} external variant={variant} icon="whatsapp" onClick={() => trackWhatsAppClick(location)}>
      {reviewsPageCopy.book.whatsapp}
    </Button>
  )
}

/** Closing chapter (light, so it does not repeat the dark footer's booking band): Book an appointment + WhatsApp us (enquiries). */
export function ReviewsCta() {
  return (
    <Section tone="ivory" labelledBy="reviews-book-title">
      <Container>
        <Reveal className="grid-editorial items-center gap-y-10">
          <div className="col-span-full lg:col-span-7">
            <p className="label text-fg-muted">{reviewsPageCopy.book.eyebrow}</p>
            <h2 id="reviews-book-title" className="mt-5 font-display text-h1">{reviewsPageCopy.book.title}</h2>
            <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">{reviewsPageCopy.book.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to={bookingCta.to} variant="solid" onClick={() => trackBookingClick('reviews-cta')}>
                {reviewsPageCopy.book.book}
              </Button>
              <ReviewsWhatsAppButton location="reviews-cta" />
            </div>
          </div>
          <div aria-hidden="true" className="col-span-full hidden justify-self-end lg:col-span-4 lg:col-start-9 lg:block">
            <img src="/logo/logo-mark-gold.svg" alt="" width={220} height={220} className="h-auto w-[clamp(10rem,6rem+8vw,15rem)]" />
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
