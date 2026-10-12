import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { aboutContent, aboutCopy, salonFacts } from '@/data/about'
import { business } from '@/data/business'
import { copyOf } from '@/lib/content'

/**
 * About 01: the salon's story (client content: business.story, paragraphs
 * separated by blank lines) beside an arched portrait, with the client's
 * signature line and a list of verified salon facts.
 */
export function AboutStory() {
  const story = copyOf(business.story)
  const paragraphs = story ? story.split(/\n\s*\n/) : []
  return (
    <Section tone="cream" id="story" labelledBy="story-title">
      <Container>
        <ChapterHeader eyebrow={aboutCopy.story.eyebrow} title={aboutCopy.story.title} headingId="story-title" />
        <div className="mt-12 grid-editorial gap-y-14 lg:mt-16">
          <div className="relative col-span-full mx-auto grid w-full max-w-md grid-cols-6 items-end gap-(--spacing-gutter) md:max-w-lg lg:col-span-5 lg:mx-0 lg:max-w-none">
            <MediaReveal slot="aboutStory" shape="arch" sizes="(min-width: 1024px) 34vw, 80vw" wrapperClassName="col-span-5" />
            <MediaReveal slot="aboutStoryDetail" sizes="(min-width: 1024px) 16vw, 40vw" wrapperClassName="col-span-3 col-start-4 -mt-28 border-[6px] border-cream lg:-mt-36" />
          </div>
          <div className="col-span-full flex flex-col gap-12 lg:col-span-6 lg:col-start-7 lg:pt-8">
            <Reveal>
              {story ? (
                <div className="flex flex-col gap-5" data-about-story>
                  {paragraphs.map((p, i) =>
                    i === 0
                      ? <p key={i} className="font-display text-h3 leading-snug text-fg">{p}</p>
                      : <p key={i} className="text-body text-fg-muted">{p}</p>,
                  )}
                  <p className="mt-3 border-t border-rule pt-5 label text-fg">{aboutContent.storyLine}</p>
                </div>
              ) : (
                <ContentMarker kind="story">the salon's story in its own words (business.story). Shown here as the opening of the About page</ContentMarker>
              )}
            </Reveal>
            <Reveal as="div">
              <dl className="divide-y divide-rule border-y border-rule">
                {salonFacts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-6 py-4 sm:grid-cols-[9rem_1fr]">
                    <dt className="label pt-1 text-fg-muted">{f.label}</dt>
                    <dd className="font-display text-h4">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}
