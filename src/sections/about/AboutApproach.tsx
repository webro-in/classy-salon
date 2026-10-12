import { Link } from 'react-router-dom'
import { PATHS } from '@/app/paths'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { aboutContent, aboutCopy } from '@/data/about'
import { serviceGroups } from '@/data/services'
import { copyOf } from '@/lib/content'

/**
 * About 02: the client's philosophy ("Beauty is Personal.") and approach
 * (content/about.json), then the three areas of care, built from the service
 * groups so it always matches content/services.json.
 */
export function AboutApproach() {
  const philosophy = copyOf(aboutContent.philosophy)
  const [quote, ...rest] = philosophy ? philosophy.split(/\n\s*\n/) : []
  const approach = aboutContent.approach

  return (
    <Section tone="ivory" id="approach" labelledBy="approach-title">
      <Container>
        <ChapterHeader
          eyebrow={aboutCopy.approach.eyebrow}
          title={aboutContent.philosophyTitle}
          headingId="approach-title"
          action={<Button to={PATHS.services} variant="outline" icon="arrow" iconPosition="end">{aboutCopy.approach.action}</Button>}
        />

        <Reveal className="mt-12 grid-editorial gap-y-8 lg:mt-16">
          {quote ? (
            <>
              <blockquote className="col-span-full font-display text-h1 leading-[1.08] text-fg lg:col-span-9 lg:col-start-2">{quote}</blockquote>
              <div className="col-span-full grid gap-6 text-lead text-fg-muted md:grid-cols-2 md:gap-(--spacing-gutter) lg:col-span-9 lg:col-start-2">
                {rest.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </>
          ) : (
            <div className="col-span-full"><ContentMarker kind="data">the salon's philosophy in its own words (content/about.json → philosophy)</ContentMarker></div>
          )}
        </Reveal>
      </Container>

      <div className="mt-14 lg:mt-20">
        <MediaReveal slot="aboutApproach" parallax sizes="100vw" />
      </div>

      <Container>
        <Reveal className="mt-14 grid-editorial gap-y-8 lg:mt-20" as="div">
          <div className="col-span-full lg:col-span-5">
            <p className="label text-fg-muted">{aboutCopy.approach.approachEyebrow}</p>
            <h3 className="mt-5 font-display text-h2 text-balance">{approach.title}</h3>
            <p className="mt-6 font-display text-h4 text-fg">{approach.lead}</p>
          </div>
          <div className="col-span-full flex flex-col gap-5 text-body text-fg-muted lg:col-span-6 lg:col-start-7 lg:pt-10">
            {approach.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Reveal>

        <Reveal as="ol" stagger className="mt-14 grid gap-12 md:grid-cols-3 md:gap-(--spacing-gutter) lg:mt-20">
          {serviceGroups.map((g) => (
            <li key={g.id} className="border-t border-rule pt-6">
              <h3 className="font-display text-h2">{g.title}</h3>
              {copyOf(g.summary) && <p className="mt-4 max-w-[34ch] text-body text-fg-muted">{copyOf(g.summary)}</p>}
              <Link to={`${PATHS.services}#${g.id}`} className="mt-6 inline-flex min-h-11 items-center gap-2 label text-fg underline decoration-rule underline-offset-[0.45em] hover:decoration-fg">
                {g.items.length} {g.title.toLowerCase()} services
                <Icon name="arrow" size={16} />
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  )
}
