import { PATHS } from '@/app/paths'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Media } from '@/components/media/Media'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { homeCopy } from '@/data/home'
import { displayLabel, getGroup } from '@/data/services'
import { copyOf } from '@/lib/content'

const itemSlot: Record<string, string> = {
  'bridal-makeup': 'makeupBridal',
  'hd-makeup': 'makeupHD',
  'airbrush-makeup': 'makeupAirbrush',
}

/**
 * Chapter 6: Bridal & Makeup, the dark feature chapter. Only the client's three
 * makeup services, no packages or claims. WhatsApp enquiry pre-fills the service.
 */
export function MakeupFeature() {
  const makeup = getGroup('makeup')

  return (
    <Section tone="dark" id="makeup" labelledBy="makeup-title" spacing="none" className="pb-section">
      {/* Full-bleed lead image */}
      <div className="relative h-[min(78svh,52rem)] min-h-[26rem] overflow-hidden">
        <Media slot="makeupFeature" fit="fill" sizes="100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0)_55%,var(--color-night)_100%)]" />
      </div>

      <Container className="relative -mt-24 lg:-mt-32">
        <ChapterHeader
          eyebrow={homeCopy.makeup.eyebrow}
          title={homeCopy.makeup.title}
          headingId="makeup-title"
          size="h1"
          intro={homeCopy.makeup.intro}
          action={
            <>
              <ActionLink kind="whatsapp" location="makeup" variant="solid" label="Enquire about makeup" enquiry={{ service: makeup.title }} />
              <Button to={`${PATHS.services}#makeup`} variant="outline">Makeup services</Button>
            </>
          }
        />

        <Reveal as="ol" stagger className="mt-12 grid gap-10 md:grid-cols-3 md:gap-(--spacing-gutter)">
          {makeup.items.map((item) => {
            const description = copyOf(item.description)
            return (
              <li key={item.id}>
                <MediaReveal slot={itemSlot[item.id] ?? `service.${item.id}`} sizes="(min-width: 768px) 30vw, 100vw" />
                <div className="mt-5 border-t border-rule pt-4">
                  <h3 className="font-display text-h3">{displayLabel(item)}</h3>
                </div>
                {description && <p className="mt-3 text-small text-fg-muted">{description}</p>}
              </li>
            )
          })}
        </Reveal>
      </Container>
    </Section>
  )
}
