import { useEffect, useRef, useState } from 'react'
import { CountUp, parseCountLabel } from '@/components/motion/CountUp'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { Reveal } from '@/components/motion/Reveal'
import { googleRating, googleReviewsUrl, reviewsPageCopy } from '@/data/reviews'
import { formatReviewDate } from '@/data/reviews'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { trackMapsClick } from '@/lib/analytics'

/**
 * The verified Google rating as typography: a large numeral, "out of 5",
 * the review count, and a single proportional hairline (4.8 → 96 %) instead
 * of five stars, so a 4.8 never reads as a perfect score.
 * All values come from content/business.json → rating.
 */
export function RatingSummary() {
  const r = googleRating
  return (
    <Section tone="cream" labelledBy="rating-title">
      <Container>
        <h2 id="rating-title" className="label text-fg-muted">{reviewsPageCopy.rating.eyebrow}</h2>
        {r ? (
          <>
            <Reveal>
              <dl className="mt-8 grid gap-y-10 md:grid-cols-2 md:gap-x-(--spacing-gutter)">
                <div className="flex flex-col">
                  <dt className="sr-only">Google rating</dt>
                  <dd className="flex items-end gap-4" data-rating-value>
                    <span className="font-display text-[clamp(7rem,4rem+14vw,15rem)] leading-[0.78] tracking-[-0.03em] tabular-nums"><CountUp value={r.value} decimals={1} /></span>
                    <span className="pb-[0.6em] text-lead text-fg-muted">{reviewsPageCopy.rating.outOf}</span>
                  </dd>
                </div>
                <div className="flex flex-col justify-end md:items-end md:text-right">
                  <dt className="label order-2 mt-3 text-fg-muted">{reviewsPageCopy.rating.countSuffix}</dt>
                  <dd className="order-1 font-display text-[clamp(3.5rem,2.4rem+4.5vw,7rem)] leading-[0.85] tabular-nums" data-rating-count>{countLabel(r.countLabel)}</dd>
                </div>
              </dl>
            </Reveal>
            <RatingLine value={r.value} outOf={r.outOf} />
            <div className="mt-6 flex flex-col gap-4 text-small text-fg-muted md:flex-row md:items-center md:justify-between">
              <p>
                {reviewsPageCopy.rating.note}
                {r.checkedOn && <> {reviewsPageCopy.rating.checked} {formatReviewDate(r.checkedOn)}.</>}
              </p>
              {googleReviewsUrl && (
                <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMapsClick('reviews-rating')} className="label inline-flex min-h-11 items-center gap-2 text-fg underline decoration-rule underline-offset-[0.55em] hover:decoration-fg">
                  {reviewsPageCopy.google.action}
                  <Icon name="arrow-up-right" size={14} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </>
        ) : (
          <ContentMarker className="mt-6">verified Google rating and review count (content/business.json → rating)</ContentMarker>
        )}
      </Container>
    </Section>
  )
}

/** Proportional hairline (value / outOf). Draws in once when scrolled into view; static under reduced motion. */
function RatingLine({ value, outOf }: { value: number; outOf: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [drawn, setDrawn] = useState(true) // prerendered/no-JS: fully drawn

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight) return // already visible: keep drawn
    setDrawn(false)
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setDrawn(true); io.disconnect() } }, { rootMargin: '0px 0px -15% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const pct = Math.round((value / outOf) * 1000) / 10
  return (
    <div ref={ref} className="relative mt-12 h-px w-full bg-rule" aria-hidden="true" data-rating-line={pct}>
      <div
        className="absolute inset-y-0 left-0 h-[2px] -translate-y-[0.5px] origin-left bg-accent transition-transform duration-[1400ms] ease-(--ease-out) motion-reduce:transition-none"
        style={{ width: `${pct}%`, transform: drawn ? 'scaleX(1)' : 'scaleX(0)' }}
      />
    </div>
  )
}

function countLabel(label: string) {
  const c = parseCountLabel(label)
  return c ? <CountUp value={c.value} suffix={c.suffix} /> : label
}
