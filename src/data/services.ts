import raw from '@content/services.json'
import { parseContent } from '@/lib/content'
import { servicesSchema, type ServiceGroupId, type ServiceItem } from '@/types/content'

export const serviceGroups = parseContent('services', servicesSchema, raw).groups

/**
 * Display label rule (docs/PRD.md §7): the client's exact wording is shown
 * until a proposed correction is explicitly confirmed.
 */
export function displayLabel(item: ServiceItem): string {
  return item.labelStatus === 'confirmed' && item.proposedLabel ? item.proposedLabel : item.sourceLabel
}

export const allServices = serviceGroups.flatMap((g) => g.items.map((item) => ({ ...item, groupId: g.id })))

export const serviceOptions = allServices.map((s) => ({ id: s.id, label: displayLabel(s), groupId: s.groupId }))

export function getGroup(id: ServiceGroupId) {
  const group = serviceGroups.find((g) => g.id === id)
  if (!group) throw new Error(`Unknown service group: ${id}`)
  return group
}

/** Lead image per category (Our Services page + Home services preview). */
export const groupMedia: Record<ServiceGroupId, string> = {
  hair: 'serviceHairImage',
  skin: 'serviceSkinImage',
  makeup: 'serviceMakeupImage',
}

export const countServices = allServices.length

/**
 * Our Services page copy (WEBRO draft, client review). Positioning: a focused
 * menu of signature services. No prices, memberships, durations or results
 * promises; no "best salon" style claims.
 */
export const servicesPageCopy = {
  hero: {
    title: 'Our Services',
    lead: 'Signature hair, skin and makeup services, chosen with care. No long list of basics, only the treatments we are proud to put our name to.',
  },
  intro: {
    eyebrow: 'The Classy menu',
    statement: 'Hair, from the first cut to the final finish. Skin that looks rested and radiant. Makeup made for the moments you will remember.',
    note: 'Not sure which service is right for you? Send us a message on WhatsApp and we will guide you.',
  },
  nav: { label: 'Service categories' },
  row: { enquire: 'Enquire on WhatsApp', details: 'Details', close: 'Close' },
  brands: {
    eyebrow: 'On our shelves',
    title: 'Professional brands we use',
    intro: 'Our treatments and aftercare are built around professional ranges from these brands.',
  },
  cta: {
    eyebrow: 'Enquire',
    title: 'Tell us what you have in mind.',
    lead: 'Message us on WhatsApp with the service you are interested in and your preferred day and time. We will reply to confirm availability.',
  },
} as const
