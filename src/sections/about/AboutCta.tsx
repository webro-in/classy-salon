import { PATHS } from '@/app/paths'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { Eyebrow, Heading, Lead } from '@/components/typography/Typography'
import { aboutCopy } from '@/data/about'
import { bookingCta } from '@/data/navigation'
import { trackBookingClick } from '@/lib/analytics'

/** About closing chapter: Explore our services · Book an appointment · WhatsApp (enquiry only). */
export function AboutCta() {
  return (
    <Section tone="taupe" id="plan-your-visit" labelledBy="cta-title">
      <Container className="grid-editorial items-center gap-y-12">
        <Reveal className="col-span-full lg:col-span-6">
          <Eyebrow>{aboutCopy.cta.eyebrow}</Eyebrow>
          <Heading id="cta-title" size="display" className="mt-5">{aboutCopy.cta.title}</Heading>
          <Lead className="mt-6 max-w-[42ch] text-fg-muted">{aboutCopy.cta.intro}</Lead>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to={PATHS.services} variant="solid" icon="arrow" iconPosition="end">{aboutCopy.cta.services}</Button>
            <Button to={bookingCta.to} variant="outline" onClick={() => trackBookingClick('about-cta')}>{aboutCopy.cta.book}</Button>
            <ActionLink kind="whatsapp" location="about-cta" />
          </div>
        </Reveal>
        <MediaReveal slot="aboutCta" shape="arch" sizes="(min-width: 1024px) 34vw, 80vw" wrapperClassName="col-span-full mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-9 lg:max-w-none" />
      </Container>
    </Section>
  )
}
