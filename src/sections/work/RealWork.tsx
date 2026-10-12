import { PATHS } from '@/app/paths'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { homeCopy } from '@/data/home'

/**
 * Real Work. Real Classy results only (slots work01–05).
 * No stock, reference or invented before/after imagery; before/after pairs live
 * in the Gallery and require client consent.
 */
export function RealWork() {
  return (
    <Section tone="ivory" id="real-work" labelledBy="real-work-title">
      <Container>
        <ChapterHeader
          eyebrow={homeCopy.work.eyebrow}
          title={homeCopy.work.title}
          headingId="real-work-title"
          intro={homeCopy.work.intro}
          action={<Button to={PATHS.gallery} variant="outline" icon="arrow" iconPosition="end">{homeCopy.work.action}</Button>}
        />

        <div className="mt-12 flex flex-col gap-(--spacing-gutter) md:gap-[calc(var(--spacing-gutter)*2)]">
          {/* Row A: portrait · tall · square, aligned to a common baseline */}
          <div className="grid grid-cols-2 gap-(--spacing-gutter) md:grid-cols-12 md:items-end">
            <MediaReveal slot="work01" parallax sizes="(min-width: 768px) 40vw, 100vw" wrapperClassName="col-span-2 md:col-span-5" />
            <MediaReveal slot="work05" sizes="(min-width: 768px) 24vw, 50vw" wrapperClassName="col-span-1 md:col-span-3" />
            <MediaReveal slot="work02" sizes="(min-width: 768px) 32vw, 50vw" wrapperClassName="col-span-1 md:col-span-4" />
          </div>
          {/* Row B: landscape + square, offset */}
          <div className="grid grid-cols-2 gap-(--spacing-gutter) md:grid-cols-12 md:items-start">
            <MediaReveal slot="work03" sizes="(min-width: 768px) 55vw, 100vw" wrapperClassName="col-span-2 md:col-span-7 md:col-start-2" />
            <MediaReveal slot="work04" sizes="(min-width: 768px) 28vw, 50vw" wrapperClassName="col-span-1 md:col-span-3 md:col-start-10 md:mt-24" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
