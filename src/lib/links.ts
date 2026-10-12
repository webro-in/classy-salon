/**
 * Contact URL builders. Every external/contact link on the site comes from here.
 * Each returns null while the underlying client data is pending, so callers
 * can omit the action instead of rendering a broken link.
 */
import { business } from '@/data/business'
import { valueOf } from '@/lib/content'

export interface EnquiryDetails {
  name?: string
  service?: string
  date?: string
  time?: string
}

/** Pre-filled, editable WhatsApp enquiry. It never implies a confirmed booking. */
export function buildEnquiryMessage(d: EnquiryDetails = {}): string {
  return [
    `Hello ${business.name},`,
    '',
    'I would like to enquire about an appointment.',
    '',
    `Name: ${d.name?.trim() ?? ''}`,
    `Service: ${d.service?.trim() ?? ''}`,
    `Preferred Date: ${d.date?.trim() ?? ''}`,
    `Preferred Time: ${d.time?.trim() ?? ''}`,
    '',
    'Thank you.',
  ].join('\n')
}

/**
 * Service-specific WhatsApp enquiry (Our Services rows). Enquiry only: it never
 * states or implies that an appointment is booked or confirmed.
 */
export function buildServiceEnquiryMessage(service: string): string {
  return [
    `Hello ${business.name},`,
    '',
    'I would like to enquire about:',
    '',
    `Service: ${service.trim()}`,
    '',
    'Name:',
    'Preferred Date:',
    'Preferred Time:',
    '',
    'Thank you.',
  ].join('\n')
}

export function getServiceWhatsAppUrl(service: string, number = valueOf(business.whatsapp)): string | null {
  if (!number) return null
  return `https://wa.me/${digitsOnly(number)}?text=${encodeURIComponent(buildServiceEnquiryMessage(service))}`
}

/** General appointment enquiry (Reviews page CTA). Enquiry only, never a confirmed booking. */
export function buildGeneralEnquiryMessage(): string {
  return [`Hello ${business.name},`, '', 'I would like to enquire about an appointment.', '', 'Thank you.'].join('\n')
}

export function getGeneralWhatsAppUrl(number = valueOf(business.whatsapp)): string | null {
  if (!number) return null
  return `https://wa.me/${digitsOnly(number)}?text=${encodeURIComponent(buildGeneralEnquiryMessage())}`
}

export function digitsOnly(e164: string): string {
  return e164.replace(/\D/g, '')
}

export function getWhatsAppUrl(details?: EnquiryDetails, number = valueOf(business.whatsapp)): string | null {
  if (!number) return null
  return `https://wa.me/${digitsOnly(number)}?text=${encodeURIComponent(buildEnquiryMessage(details))}`
}

export function getPhoneUrl(number = valueOf(business.phone)): string | null {
  return number ? `tel:${number.replace(/[^\d+]/g, '')}` : null
}

export function getEmailUrl(email = valueOf(business.email), subject = 'Enquiry'): string | null {
  return email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : null
}

export function getMapsUrl(): string | null {
  return valueOf(business.mapsUrl)
}

export function getInstagramUrl(id: 'primary' | 'secondary' = 'primary'): string | null {
  const account = business.instagram.find((a) => a.id === id)
  return account ? valueOf(account.url) : null
}

export function formatPhoneDisplay(e164: string): string {
  const d = digitsOnly(e164)
  // Indian mobile: +91 98765 43210
  if (d.length === 12 && d.startsWith('91')) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`
  return e164
}
