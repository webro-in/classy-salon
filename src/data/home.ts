/**
 * Home page UI copy (headings, intros, labels). WEBRO-written, factual only:
 * no history, founders, awards, claims or invented numbers. Client facts
 * (story, rating, contacts) come from content/*.json, never from here.
 * Status: draft, for client review alongside the content check.
 */
import { getGroup } from './services'
import { copyOf } from '@/lib/content'

export const homeCopy = {
  intro: {
    eyebrow: 'Introduction',
    title: 'A unisex salon for hair, skin and makeup in Jagatpura, Jaipur.',
  },
  services: {
    eyebrow: 'Our Services',
    title: 'Hair, skin and makeup',
    intro: 'Three areas of care, each with its own treatments and services.',
    action: 'View all services',
  },
  hairTreatments: {
    eyebrow: 'Hair Treatments',
    title: 'Treatments for hair and scalp',
    intro: copyOf(getGroup('hair').summary),
    /** Treatments left out of the Home rail at the client's request (still listed on Our Services). */
    hidden: ['anti-dandruff-treatment'] as readonly string[],
  },
  salon: {
    eyebrow: 'The Salon',
    title: 'Inside Classy',
    intro: 'The salon at Vishwa Vidhyalaya Nagar, Jagatpura.',
  },
  makeup: {
    eyebrow: 'Bridal & Makeup',
    title: 'Bridal, HD and airbrush makeup',
    intro: copyOf(getGroup('makeup').summary),
  },
  work: {
    eyebrow: 'Real Work',
    title: 'From the chair',
    intro: 'Recent work from the salon.',
    action: 'View the gallery',
  },
  brands: {
    eyebrow: 'Products & Brands',
    intro: 'Professional products and tools used at the salon.',
    alsoLabel: 'Also at the salon',
  },
  reviews: {
    eyebrow: 'Reviews',
    title: 'What clients say',
    action: 'Read Google reviews',
    more: 'All reviews',
  },
  instagram: {
    eyebrow: 'Instagram',
    title: 'Follow Classy on Instagram',
  },
  booking: {
    eyebrow: 'Book an Appointment',
    title: 'Book your visit',
    intro: 'Send an enquiry on WhatsApp with your preferred service, date and time. The salon will reply to confirm your appointment.',
  },
  visit: {
    eyebrow: 'Visit Us',
    title: 'Visit the salon',
  },
} as const
