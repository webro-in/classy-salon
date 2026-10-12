import { Seo } from '@/components/seo/Seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildContactPageJsonLd, buildLocalBusinessJsonLd } from '@/config/seo'
import { ContactHero } from '@/sections/contact/ContactHero'
import { ContactDetails } from '@/sections/contact/ContactDetails'
import { ContactMap } from '@/sections/contact/ContactMap'
import { ContactEnquiry } from '@/sections/contact/ContactEnquiry'
import { ContactFaq } from '@/sections/contact/ContactFaq'
import { ContactCta } from '@/sections/contact/ContactCta'

/**
 * Contact / Visit. Tone cadence: white hero · white address/hours/contact ·
 * cream map · dark appointment enquiry (#book) · white FAQ (client content
 * only) · taupe "explore" links → dark footer.
 */
export function Component() {
  return (
    <>
      <Seo route="contact" />
      <JsonLd data={buildLocalBusinessJsonLd()} />
      <JsonLd data={buildContactPageJsonLd()} />
      <ContactHero />
      <ContactDetails />
      <ContactMap />
      <ContactEnquiry />
      <ContactFaq />
      <ContactCta />
    </>
  )
}
