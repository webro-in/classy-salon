import { ActionLink } from '@/components/buttons/ActionLink'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Media } from '@/components/media/Media'
import { Reveal } from '@/components/motion/Reveal'
import { hoursSummary, addressLines } from '@/data/business'
import { servicesPageCopy } from '@/data/services'

/** Closing WhatsApp enquiry chapter with the illuminated salon emblem. */
export function ServicesCta() {
  return (
    <Section tone="dark" labelledBy="services-cta-title">
      <Container>
        <div className="grid-editorial items-center gap-y-12">
          <Reveal className="col-span-full md:col-span-4 lg:col-span-5">
            <div className="mx-auto max-w-[26rem]">
              <Media slot="logoSign" shape="arch" aspect="4:5" sizes="(min-width: 1024px) 26rem, 80vw" />
            </div>
          </Reveal>
          <Reveal className="col-span-full md:col-span-4 lg:col-span-6 lg:col-start-7">
            <p className="label text-fg-muted">{servicesPageCopy.cta.eyebrow}</p>
            <h2 id="services-cta-title" className="mt-5 font-display text-h1">{servicesPageCopy.cta.title}</h2>
            <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">{servicesPageCopy.cta.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ActionLink kind="whatsapp" location="services-cta" variant="solid" label="Enquire on WhatsApp" />
              <ActionLink kind="call" location="services-cta" />
            </div>
            <dl className="mt-10 grid gap-6 border-t border-rule pt-6 text-small sm:grid-cols-2">
              {hoursSummary && (
                <div><dt className="label text-fg-muted">Hours</dt><dd className="mt-2">{hoursSummary.replace(/^Open /, 'Open ')}</dd></div>
              )}
              <div><dt className="label text-fg-muted">Visit</dt><dd className="mt-2">{addressLines.join(', ')}</dd></div>
            </dl>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
