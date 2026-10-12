import { ActionLink } from '@/components/buttons/ActionLink'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { Reveal } from '@/components/motion/Reveal'
import { Eyebrow, Heading, Lead } from '@/components/typography/Typography'
import { homeCopy } from '@/data/home'

/** Chapter 11: Book an Appointment (dark chapter). WhatsApp enquiry + Call; frontend only. */
export function BookingSection() {
  return (
    <Section tone="dark" id="book" labelledBy="book-title">
      <Container className="grid-editorial gap-y-14">
        <Reveal className="col-span-full lg:col-span-5">
          <Eyebrow>
            {homeCopy.booking.eyebrow}
          </Eyebrow>
          <Heading id="book-title" size="display" className="mt-5">{homeCopy.booking.title}</Heading>
          <Lead className="mt-6 max-w-prose text-fg-muted">{homeCopy.booking.intro}</Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink kind="call" location="home-booking" />
          </div>
        </Reveal>
        <Reveal className="col-span-full border-t border-rule pt-10 lg:col-span-6 lg:col-start-7 lg:border-l lg:border-t-0 lg:pl-(--spacing-gutter) lg:pt-0">
          <EnquiryForm location="home-booking" />
        </Reveal>
      </Container>
    </Section>
  )
}
