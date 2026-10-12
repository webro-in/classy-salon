import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { Section, type Tone } from '@/components/layout/Section'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { Heading, Lead } from '@/components/typography/Typography'
import type { Crumb } from '@/config/seo'

interface PageHeroProps {
  /** Breadcrumb trail ending at this page. */
  trail: Crumb[]
  /** Optional small label above the h1. */
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  /** Full-bleed lead media slot (src/data/media.ts). */
  slot: string
  tone?: Tone
  /** Extra content beside the lead (actions, facts). */
  aside?: ReactNode
}

/**
 * Inner-page opening (About, Our Services, Gallery, …): breadcrumbs, the page
 * h1 with an editorial lead, then a full-bleed media frame with gentle parallax.
 * Text renders statically with a CSS-only entrance (no JS flash).
 */
export function PageHero({ trail, eyebrow, title, lead, slot, tone = 'ivory', aside }: PageHeroProps) {
  return (
    <Section tone={tone} spacing="none" labelledBy="page-title" className="pt-10 lg:pt-14">
      <Container>
        <Breadcrumbs trail={trail} className="hero-rise" />
        <div className="grid-editorial mt-10 items-end gap-y-8 pb-12 lg:mt-16 lg:pb-16">
          <div className="hero-rise col-span-full lg:col-span-9 [animation-delay:120ms]">
            {eyebrow && <p className="mb-5 label text-fg-muted">{eyebrow}</p>}
            <Heading as="h1" id="page-title" size="display-xl">
              {title}
            </Heading>
          </div>
          {(lead || aside) && (
            <div className="hero-rise col-span-full grid gap-8 border-t border-rule pt-8 md:grid-cols-2 lg:col-span-12 [animation-delay:240ms]">
              {lead && <Lead className="max-w-[46ch] text-fg-muted">{lead}</Lead>}
              {aside && <div className="md:justify-self-end">{aside}</div>}
            </div>
          )}
        </div>
      </Container>
      <MediaReveal slot={slot} parallax priority sizes="100vw" />
    </Section>
  )
}
