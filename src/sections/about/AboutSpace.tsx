import { PATHS } from '@/app/paths'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { aboutCopy } from '@/data/about'
import { addressLines } from '@/data/business'

/** About 03: the salon environment. Three fixed About slots; real photos drop in without layout changes. */
export function AboutSpace() {
  return (
    <Section tone="taupe" id="space" labelledBy="space-title">
      <Container>
        <ChapterHeader
          eyebrow={aboutCopy.space.eyebrow}
          title={aboutCopy.space.title}
          headingId="space-title"
          intro={aboutCopy.space.intro}
          action={<Button to={PATHS.gallery} variant="outline" icon="arrow" iconPosition="end">{aboutCopy.space.action}</Button>}
        />
        <div className="mt-12 grid grid-cols-2 gap-(--spacing-gutter) lg:mt-16 lg:grid-cols-12">
          <MediaReveal slot="aboutSpace01" parallax sizes="(min-width: 1024px) 45vw, 100vw" wrapperClassName="col-span-2 lg:col-span-6" />
          <div className="col-span-2 grid grid-cols-2 content-between gap-(--spacing-gutter) lg:col-span-6 lg:grid-cols-6">
            <MediaReveal slot="aboutSpace02" sizes="(min-width: 1024px) 45vw, 100vw" wrapperClassName="col-span-2 lg:col-span-6" />
            <MediaReveal slot="aboutSpace03" sizes="(min-width: 1024px) 20vw, 50vw" wrapperClassName="col-span-1 lg:col-span-3" />
            <Reveal className="col-span-1 flex flex-col justify-end gap-5 lg:col-span-3">
              <p className="label text-fg-muted">Visit</p>
              <address className="font-display text-h4 not-italic">
                {addressLines.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
              <ActionLink kind="maps" location="about-space" variant="text" />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
