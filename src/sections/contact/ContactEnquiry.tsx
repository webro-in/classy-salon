import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { Reveal } from '@/components/motion/Reveal'
import { ActionLink } from '@/components/buttons/ActionLink'
import { contactCopy } from '@/data/contact'

/** Appointment enquiry (#book: the target of every "Book Now"). Frontend-only → WhatsApp. */
export function ContactEnquiry() {
  return (
    <Section tone="dark" id="book" labelledBy="book-title" className="scroll-mt-4">
      <Container>
        <div className="grid-editorial gap-y-12">
          <Reveal className="col-span-full lg:col-span-5">
            <p className="label text-fg-muted">{contactCopy.enquiry.eyebrow}</p>
            <h2 id="book-title" className="mt-5 font-display text-h1">{contactCopy.enquiry.title}</h2>
            <p className="mt-6 max-w-[42ch] text-lead text-fg-muted">{contactCopy.enquiry.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink kind="call" location="contact-enquiry" label={contactCopy.details.call} />
            </div>
          </Reveal>
          <div className="col-span-full lg:col-span-6 lg:col-start-7">
            <EnquiryForm location="contact-enquiry" requireAll />
          </div>
        </div>
      </Container>
    </Section>
  )
}
