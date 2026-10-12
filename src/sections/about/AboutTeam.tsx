import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { showContentMarkers } from '@/config/site'
import { aboutCopy } from '@/data/about'
import { teamMembers } from '@/data/team'

/**
 * About 05 (optional): people, ONLY when the client has confirmed each role and
 * approved name + photo (content/team.json enforces approved + consent).
 * With no approved people the section does not exist in production.
 */
export function AboutTeam() {
  if (teamMembers.length === 0) {
    if (!showContentMarkers) return null
    return (
      <Section tone="ivory" spacing="small" id="team">
        <Container>
          <ContentMarker kind="confirm">Optional team section: appears only after the client confirms people, roles and photo consent (content/team.json). Hidden in production until then</ContentMarker>
        </Container>
      </Section>
    )
  }
  return (
    <Section tone="ivory" id="team" labelledBy="team-title">
      <Container>
        <ChapterHeader eyebrow={aboutCopy.team.eyebrow} title={aboutCopy.team.title} headingId="team-title" />
        <Reveal as="ul" stagger className="mt-12 grid grid-cols-2 gap-(--spacing-gutter) gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((m) => (
            <li key={m.id}>
              <MediaReveal slot={`team.${m.id}`} shape="arch" sizes="(min-width: 1024px) 22vw, 45vw" />
              <h3 className="mt-4 font-display text-h4">{m.name}</h3>
              <p className="text-small text-fg-muted">{m.role}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  )
}
