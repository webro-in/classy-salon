import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { aboutContent, aboutCopy } from '@/data/about'

/** About 04: "What Defines Classy", the client's own five principles (content/about.json → defines). */
export function AboutExperience() {
  const { title, items } = aboutContent.defines
  return (
    <Section tone="dark" id="experience" labelledBy="experience-title">
      <Container>
        <ChapterHeader eyebrow={aboutCopy.experience.eyebrow} title={title} headingId="experience-title" />
        <Reveal as="ol" stagger className="mt-12 grid gap-px overflow-hidden border border-rule bg-(--tone-line) sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
          {items.map((p) => (
            <li key={p.title} className="flex min-h-48 flex-col bg-tone p-7 sm:min-h-64 lg:min-h-80 lg:p-7 [&:nth-child(5)]:sm:col-span-2 [&:nth-child(5)]:lg:col-span-1">
              {/* Equal-height text block keeps every title on the same line across cards. */}
              <div className="mt-auto">
                <h3 className="font-display text-h3 lg:min-h-[2.3em]">{p.title}</h3>
                <p className="mt-3 text-small text-fg-muted lg:min-h-[6.2em]">{p.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  )
}
