import { PATHS } from '@/app/paths'
import { ActionLink } from '@/components/buttons/ActionLink'
import { PageHero } from '@/components/sections/PageHero'
import { contactCopy } from '@/data/contact'

/** Contact / Visit opening: h1, practical lead, Call + WhatsApp, salon exterior at night. */
export function ContactHero() {
  return (
    <PageHero
      trail={[{ name: 'Home', path: PATHS.home }, { name: 'Contact', path: PATHS.contact }]}
      title={contactCopy.hero.title}
      lead={contactCopy.hero.lead}
      slot="contactHero"
      aside={
        <div className="flex flex-wrap gap-3">
          <ActionLink kind="call" location="contact-hero" variant="solid" label={contactCopy.details.call} />
          <ActionLink kind="whatsapp" location="contact-hero" label={contactCopy.details.whatsappAction} />
        </div>
      }
    />
  )
}
