/**
 * Privacy Policy and Terms & Conditions wording (WEBRO draft for client/legal
 * review — not legal advice). Written only from what this website actually
 * does (docs/CONTENT-MAP.md §10):
 *  - no accounts, payments, online booking system or server-side form storage;
 *  - the appointment enquiry builds a WhatsApp message in the browser;
 *  - no cookies, analytics or advertising trackers are set by the site;
 *  - fonts are self-hosted; Google Maps loads only when the visitor asks.
 *
 * Inline tokens are filled from central data at render time (LegalText):
 *   {{tradingName}} {{legalName}} {{address}} {{email}} {{phone}} {{whatsapp}}
 * Pending legal facts render as [LEGAL BUSINESS NAME REQUIRED] /
 * [LEGAL DETAILS REQUIRED] / [CLIENT POLICY REQUIRED] in preview only, and
 * block `npm run build:production` (scripts/content-rules.ts §10).
 */
import raw from '@content/legal.json'
import { parseContent, valueOf } from '@/lib/content'
import { legalSchema } from '@/types/content'
import { business } from './business'

export const legal = parseContent('legal', legalSchema, raw)

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  /** A fact only the client/adviser can supply. `required` items block production. */
  | { kind: 'pending'; marker: 'legal' | 'policy'; note: string; required: boolean }

export interface LegalSection {
  id: string
  title: string
  blocks: LegalBlock[]
}

export interface LegalDocument {
  title: string
  intro: string
  sections: LegalSection[]
}

/** "2026-10-02" → "2 October 2026". */
export function formatLegalDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${d} ${months[m - 1]} ${y}`
}

export const effectiveDate = valueOf(legal.effectiveDate)
export const legalName = valueOf(business.legalName)

const governingLaw: LegalBlock[] = legal.governingLaw.status === 'verified'
  ? [{ kind: 'p', text: legal.governingLaw.value }]
  : [{ kind: 'pending', marker: 'legal', note: 'governing law and jurisdiction, confirmed by the salon or its legal adviser', required: true }]

const appointmentPolicy: LegalBlock[] = legal.appointmentPolicy.status === 'pending'
  ? [{ kind: 'pending', marker: 'policy', note: 'the salon’s own appointment policy (for example cancellation, late arrival or deposits), only if it has one. This section is left out of the live site until supplied', required: false }]
  : [{ kind: 'p', text: legal.appointmentPolicy.value }]

const contactBlocks: LegalBlock[] = [
  { kind: 'list', items: ['Email: {{email}}', 'Phone: {{phone}}', 'WhatsApp: {{whatsapp}}', 'Post or in person: {{address}}'] },
]

export const privacyPolicy: LegalDocument = {
  title: 'Privacy Policy',
  intro: 'How the Classy Unisex Salon website handles information, in plain language.',
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      blocks: [
        { kind: 'p', text: 'This website is run by {{legalName}}, trading as {{tradingName}}, {{address}}. In this policy, “we” and “us” mean the salon.' },
        { kind: 'p', text: 'If you have a question about this policy or about information you have shared with us, contact us using the details at the end of this page.' },
      ],
    },
    {
      id: 'what-the-website-collects',
      title: 'What this website collects',
      blocks: [
        { kind: 'p', text: 'You can use this website without telling us who you are. The website itself does not:' },
        { kind: 'list', items: [
          'create accounts or ask you to log in;',
          'take payments;',
          'store appointment enquiries or any other form data on our servers;',
          'set cookies, or use analytics or advertising trackers.',
        ] },
        { kind: 'p', text: 'Like any website, the service that hosts it may record standard technical information when pages are requested (such as IP address, browser type and the time of the request) to deliver the site and keep it secure.' },
      ],
    },
    {
      id: 'appointment-enquiries',
      title: 'Appointment enquiries and WhatsApp',
      blocks: [
        { kind: 'p', text: 'The appointment enquiry form asks for your name, the service you are interested in and your preferred date and time. When you press “Send enquiry on WhatsApp”, your browser turns these details into a message and opens WhatsApp. Nothing is sent to us until you choose to send that message in WhatsApp, and the website does not keep a copy.' },
        { kind: 'p', text: 'Messages you send us on WhatsApp are delivered through WhatsApp, which is operated by WhatsApp LLC (Meta) under its own terms and privacy policy. We receive them in the salon’s WhatsApp account.' },
        { kind: 'p', text: 'If you call or email us using the links on this site, your phone or email app handles the call or message in the usual way.' },
      ],
    },
    {
      id: 'how-we-use-information',
      title: 'How we use what you send us',
      blocks: [
        { kind: 'p', text: 'We use the details you send us by WhatsApp, phone or email to reply to your enquiry and to arrange your appointment.' },
      ],
    },
    {
      id: 'third-party-services',
      title: 'Other services this website links to',
      blocks: [
        { kind: 'p', text: 'Some features open or load services run by other companies, each under its own privacy policy:' },
        { kind: 'list', items: [
          'Google Maps: the map on the Contact page loads from Google only after you press “Show map”. The “Get directions” and Google reviews links open Google Maps.',
          'WhatsApp: the enquiry form and WhatsApp links open WhatsApp.',
          'Instagram: links to the salon’s Instagram accounts open Instagram.',
        ] },
        { kind: 'p', text: 'Fonts and images on this website are served from the website itself, not from third-party services.' },
      ],
    },
    {
      id: 'photos',
      title: 'Photos on this website',
      blocks: [
        { kind: 'p', text: 'This website shows photographs and videos taken at the salon and of the salon’s work. If you appear in one of them and would like it removed, please contact us.' },
      ],
    },
    {
      id: 'your-choices',
      title: 'Your choices',
      blocks: [
        { kind: 'p', text: 'You can ask us what information you have sent us, and ask us to correct or delete it, by contacting us using the details below.' },
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      blocks: [
        { kind: 'p', text: 'If the website changes how it handles information (for example, if analytics are added), this policy will be updated first. The date at the top of this page shows when it last changed.' },
      ],
    },
    { id: 'contact', title: 'Contact', blocks: contactBlocks },
  ],
}

export const termsAndConditions: LegalDocument = {
  title: 'Terms & Conditions',
  intro: 'The terms for using the Classy Unisex Salon website.',
  sections: [
    {
      id: 'about',
      title: 'About these terms',
      blocks: [
        { kind: 'p', text: 'This website is run by {{legalName}}, trading as {{tradingName}}, {{address}}. By using the website you agree to these terms. In these terms, “we” and “us” mean the salon.' },
      ],
    },
    {
      id: 'using-the-website',
      title: 'Using this website',
      blocks: [
        { kind: 'p', text: 'This website gives information about the salon, its services and how to contact us. Please use it lawfully and do not try to disrupt it or access it in ways it is not designed for.' },
      ],
    },
    {
      id: 'appointment-enquiries',
      title: 'Appointment enquiries',
      blocks: [
        { kind: 'p', text: 'The enquiry form and WhatsApp links help you send us an appointment enquiry. An enquiry is a request, not a booking: an appointment is only arranged when the salon replies to you to confirm it.' },
      ],
    },
    { id: 'appointment-policy', title: 'Appointment policy', blocks: appointmentPolicy },
    {
      id: 'services-and-availability',
      title: 'Service information and availability',
      blocks: [
        { kind: 'p', text: 'Service descriptions on this website are general information. Which service is right for you is discussed with you at the salon. This website does not publish prices.' },
        { kind: 'p', text: 'Opening hours shown are the salon’s regular hours. Services, hours and availability can change, so please contact us to check before you visit.' },
      ],
    },
    {
      id: 'content',
      title: 'Photos, content and brand names',
      blocks: [
        { kind: 'p', text: 'The text, photographs, videos and logo on this website belong to the salon or are used with permission. Please do not copy or reuse them without our written permission.' },
        { kind: 'p', text: 'Product brand names shown on this website belong to their owners. Showing them describes products used at the salon and does not mean that any brand endorses or is partnered with the salon.' },
      ],
    },
    {
      id: 'external-links',
      title: 'Links to other websites',
      blocks: [
        { kind: 'p', text: 'This website links to services such as WhatsApp, Google Maps and Instagram. We are not responsible for the content or practices of other websites.' },
      ],
    },
    {
      id: 'accuracy',
      title: 'Accuracy of information',
      blocks: [
        { kind: 'p', text: 'We try to keep this website accurate and up to date, but information may occasionally be incomplete or out of date, and the website may sometimes be unavailable. To the extent the law allows, we are not responsible for loss caused by relying on information on this website.' },
      ],
    },
    { id: 'governing-law', title: 'Governing law', blocks: governingLaw },
    {
      id: 'changes',
      title: 'Changes to these terms',
      blocks: [{ kind: 'p', text: 'We may update these terms from time to time. The date at the top of this page shows when they last changed.' }],
    },
    { id: 'contact', title: 'Contact', blocks: contactBlocks },
  ],
}

/** Required legal facts still missing (used by the release gate and tests). */
export function missingLegalFacts(): string[] {
  const missing: string[] = []
  if (business.legalName.status === 'pending') missing.push('legal business name')
  if (legal.effectiveDate.status === 'pending') missing.push('effective date')
  if (legal.governingLaw.status === 'pending') missing.push('governing law and jurisdiction')
  return missing
}
