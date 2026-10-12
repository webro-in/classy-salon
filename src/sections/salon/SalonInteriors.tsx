import { PATHS } from '@/app/paths'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { homeCopy } from '@/data/home'

/**
 * Chapter 5: the salon interiors. Five fixed slots (salonInterior01–05) in an
 * asymmetric editorial composition with gentle parallax on the large frames.
 * Supplying real photos only changes the slot `src`; the layout is final.
 */
export function SalonInteriors() {
  return (
    <Section tone="taupe" id="the-salon" labelledBy="the-salon-title">
      <Container>
        <ChapterHeader
          eyebrow={homeCopy.salon.eyebrow}
          title={homeCopy.salon.title}
          headingId="the-salon-title"
          intro={homeCopy.salon.intro}
          action={<Button to={PATHS.gallery} variant="outline" icon="arrow" iconPosition="end">View the gallery</Button>}
        />

        {/* Row 1: large left + two stacked right (equal heights). Row 2: even pair. */}
        <div className="mt-12 flex flex-col gap-(--spacing-gutter)">
          <div className="grid grid-cols-2 gap-(--spacing-gutter) lg:grid-cols-12">
            <MediaReveal slot="salonInterior01" parallax sizes="(min-width: 1024px) 64vw, 100vw" wrapperClassName="col-span-2 lg:col-span-8" />
            <div className="col-span-2 grid grid-cols-2 gap-(--spacing-gutter) lg:col-span-4 lg:grid-cols-1">
              <MediaReveal slot="salonInterior02" sizes="(min-width: 1024px) 30vw, 50vw" />
              <MediaReveal slot="salonInterior03" sizes="(min-width: 1024px) 30vw, 50vw" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-(--spacing-gutter)">
            <MediaReveal slot="salonInterior04" sizes="50vw" />
            <MediaReveal slot="salonInterior05" parallax sizes="50vw" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
