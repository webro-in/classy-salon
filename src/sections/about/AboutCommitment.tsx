import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { aboutContent, aboutCopy } from '@/data/about'

/** About 05: the client's commitment statement (content/about.json → commitment). */
export function AboutCommitment() {
  const c = aboutContent.commitment
  return (
    <Section tone="ivory" id="commitment" labelledBy="commitment-title">
      <Container>
        <ChapterHeader eyebrow={aboutCopy.commitment.eyebrow} title={c.title} headingId="commitment-title" />
        <Reveal className="mt-12 grid-editorial gap-y-8 lg:mt-16">
          <p className="col-span-full font-display text-h1 leading-[1.08] text-balance lg:col-span-6">{c.line}</p>
          <div className="col-span-full flex flex-col gap-5 text-lead text-fg-muted lg:col-span-5 lg:col-start-8 lg:pt-3">
            {c.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
