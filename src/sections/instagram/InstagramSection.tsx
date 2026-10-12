import { ActionLink } from '@/components/buttons/ActionLink'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { business } from '@/data/business'
import { homeCopy } from '@/data/home'
import { valueOf } from '@/lib/content'
import { trackInstagramClick } from '@/lib/analytics'
import { cx } from '@/lib/cx'

const tiles = ['instagram01', 'instagram02', 'instagram03', 'instagram04', 'instagram05', 'instagram06']

/**
 * Chapter 10: Instagram. A curated mosaic of the salon's own exported posts
 * (media slots), not a live feed, plus the verified handle(s).
 */
export function InstagramSection() {
  const accounts = business.instagram
    .map((a) => ({ handle: a.handle, url: valueOf(a.url), pending: a.url.status === 'pending' }))

  return (
    <Section tone="ivory" id="instagram" labelledBy="instagram-title">
      <Container>
        <ChapterHeader
          eyebrow={homeCopy.instagram.eyebrow}
          title={homeCopy.instagram.title}
          headingId="instagram-title"
          intro={
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {accounts.map((a) =>
                a.url ? (
                  <li key={a.handle}>
                    <a href={a.url} target="_blank" rel="noopener noreferrer" onClick={() => trackInstagramClick('home-instagram')} className="text-fg underline decoration-rule underline-offset-[0.3em] hover:decoration-fg">
                      @{a.handle}<span className="sr-only"> on Instagram (opens in a new tab)</span>
                    </a>
                  </li>
                ) : (
                  <li key={a.handle}><ContentMarker kind="confirm" inline>confirm @{a.handle} is the salon's own account</ContentMarker></li>
                ),
              )}
            </ul>
          }
          action={<ActionLink kind="instagram" location="home-instagram" variant="solid" label="Follow on Instagram" />}
        />

        <div className="mt-12 grid grid-cols-2 gap-(--spacing-gutter) sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((slot, i) => (
            <MediaReveal key={slot} slot={slot} aspect="4:5" sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" wrapperClassName={cx(i % 2 === 1 && 'lg:mt-14', i % 3 === 1 && 'sm:max-lg:mt-10')} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
