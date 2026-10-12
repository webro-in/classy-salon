/**
 * About page: client content adapters + UI copy.
 *
 * Client facts (story, philosophy, people) come from content/*.json and are
 * never written here. The UI copy below is WEBRO-written, factual only
 * (no history, years, founders, awards or claims). Status: DRAFT, for client review.
 */
import raw from '@content/about.json'
import { parseContent, valueOf } from '@/lib/content'
import { aboutSchema } from '@/types/content'
import { business, locationLine } from './business'
import { brands, logoBrands } from './brands'
import { allServices, serviceGroups } from './services'

export const aboutContent = parseContent('about', aboutSchema, raw)

/** Verified facts about the salon, shown as a fact list (all from approved data). */
const established = business.established ? valueOf(business.established) : null

export const salonFacts: Array<{ label: string; value: string }> = [
  { label: 'Salon', value: business.name },
  ...(established ? [{ label: 'Established', value: established }] : []),
  { label: 'For', value: business.descriptor },
  { label: 'Location', value: valueOf(business.address) ? `${valueOf(business.address)!.locality}, ${valueOf(business.address)!.city}` : locationLine },
  { label: 'Services', value: serviceGroups.map((g) => g.title).join(' · ') },
]

export const aboutCopy = {
  status: 'draft' as const,
  hero: {
    eyebrow: 'About Classy',
    title: 'Hair, skin and makeup, in one salon in Jagatpura.',
    lead: `${business.name} is a unisex salon at Vishwa Vidhyalaya Nagar, Jagatpura, Jaipur.`,
  },
  story: {
    eyebrow: 'Our story',
    title: 'The salon',
  },
  approach: {
    eyebrow: 'Our philosophy',
    approachEyebrow: 'Our approach',
    action: 'Explore our services',
  },
  space: {
    eyebrow: 'The space',
    title: 'Inside the salon',
    intro: 'The salon at Plot no. 210, Vishwa Vidhyalaya Nagar, Jagatpura.',
    action: 'View the gallery',
  },
  experience: {
    eyebrow: 'The Classy standard',
    /** Legacy derived points (kept for reference; the page shows the client's "What Defines Classy" list). */
    points: [
      {
        title: 'A unisex salon',
        text: 'Hair, skin and makeup services for every client.',
        source: 'business.descriptor',
      },
      {
        title: 'Everything in one place',
        text: `${allServices.length} services across hair, skin and makeup.`,
        source: 'content/services.json',
      },
      {
        title: 'Professional products',
        text: `Products and tools from brands including ${logoBrands.slice(0, 4).map((b) => b.name).join(', ')} and ${brands.length - 4} more.`,
        source: 'content/brands.json',
      },
      {
        title: 'Easy to reach',
        text: 'Find us in Jagatpura, Jaipur, and send an appointment enquiry on WhatsApp.',
        source: 'business.address',
      },
    ],
  },
  team: {
    eyebrow: 'The people',
    title: 'Meet the team',
  },
  commitment: {
    eyebrow: 'Our commitment',
  },
  cta: {
    eyebrow: 'Classy Unisex Salon',
    title: aboutContent.tagline,
    intro: 'Explore the services, then send an enquiry on WhatsApp. The salon will reply to confirm your appointment.',
    services: 'Explore our services',
    book: 'Book an appointment',
  },
}
