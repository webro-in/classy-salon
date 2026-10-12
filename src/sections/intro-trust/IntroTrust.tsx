import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { CountUp, parseCountLabel } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Eyebrow, Heading, Text } from '@/components/typography/Typography'
import { Icon } from '@/components/icons/Icon'
import { aboutContent } from '@/data/about'
import { business, locationLine } from '@/data/business'
import { homeCopy } from '@/data/home'
import { googleReviewsUrl } from '@/data/reviews'
import { valueOf } from '@/lib/content'
import { trackMapsClick } from '@/lib/analytics'

/**
 * Chapter 2: Introduction + Trust.
 * Introduction copy is the client's own (content/about.json → intro). The
 * rating figures are verified client data and count up when scrolled into view.
 */
export function IntroTrust() {
  const intro = aboutContent.intro
  const rating = valueOf(business.rating)
  const count = rating ? parseCountLabel(rating.countLabel) : null

  return (
    <Section tone="ivory" id="introduction" labelledBy="introduction-title">
      <Container>
        <div className="grid-editorial gap-y-14">
          <div className="col-span-full flex flex-col lg:col-span-7">
            <Reveal>
              <Eyebrow>
                {homeCopy.intro.eyebrow}
                <span aria-hidden="true" className="mx-3 text-rule">·</span>
                {intro.eyebrow}
              </Eyebrow>
              <Heading id="introduction-title" size="h1" className="mt-6 max-w-[18ch]">
                {intro.title}
              </Heading>
            </Reveal>

            <Reveal stagger className="mt-10 flex max-w-prose flex-col gap-5 md:ml-[calc(100%/7)]">
              {intro.paragraphs.map((p, i) => (
                <Text key={i} className={i === 0 ? 'text-lead text-fg' : 'text-body text-fg-muted'}>{p}</Text>
              ))}
            </Reveal>
          </div>

          <div className="relative col-span-full mx-auto grid w-full max-w-md grid-cols-6 items-end gap-(--spacing-gutter) md:max-w-lg lg:col-span-5 lg:max-w-none">
            <MediaReveal slot="introPortrait" shape="arch" sizes="(min-width: 1024px) 30vw, 70vw" wrapperClassName="col-span-5 col-start-2 lg:col-span-5" />
            <MediaReveal slot="introDetail" sizes="(min-width: 1024px) 14vw, 40vw" wrapperClassName="col-span-3 -mt-24 border-[6px] border-ivory lg:col-span-3 lg:-mt-40" />
          </div>
        </div>

        {/* Trust band: verified figures only. */}
        <div className="mt-section-sm grid gap-8 border-y border-rule py-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-rule">
          <div className="md:pr-8">
            <p className="label text-fg-muted">Google rating</p>
            {rating ? (
              <p className="mt-3 flex items-baseline gap-2">
                <CountUp value={rating.value} decimals={1} className="font-display text-numeral leading-none" />
                <span className="text-small text-fg-muted">/ 5</span>
              </p>
            ) : (
              <ContentMarker className="mt-3">verified Google rating (business.rating)</ContentMarker>
            )}
          </div>
          <div className="md:px-8">
            <p className="label text-fg-muted">Google reviews</p>
            {rating ? (
              <p className="mt-3 font-display text-numeral leading-none">
                {count ? <CountUp value={count.value} suffix={count.suffix} /> : rating.countLabel}
              </p>
            ) : (
              <ContentMarker className="mt-3">verified review count (business.rating)</ContentMarker>
            )}
          </div>
          <div className="flex flex-col justify-between gap-4 md:pl-8">
            <p className="label text-fg-muted">Location</p>
            <p className="font-display text-h3">{locationLine}</p>
            {googleReviewsUrl && (
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackMapsClick('intro-trust')}
                className="inline-flex min-h-11 items-center gap-2 label text-fg underline decoration-rule underline-offset-[0.45em] hover:decoration-fg"
              >
                Find us on Google
                <Icon name="arrow-up-right" size={16} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
