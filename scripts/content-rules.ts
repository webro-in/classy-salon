/**
 * Release rules for client content (docs/DRD.md §6). Pure function, unit-tested.
 *
 *  blockers → fail `npm run build:production`
 *  warnings → WEBRO draft copy awaiting client sign-off (does not block)
 *  info     → optional items not yet supplied
 */
import type { Business, Brand, CopyField, Review, ServiceGroup } from '../src/types/content'
import type { MediaSlot } from '../src/data/media'
import { FORBIDDEN_CONTENT, looksFake } from './forbidden'

export interface ContentInput {
  business: Business
  serviceGroups: ServiceGroup[]
  brands: Brand[]
  mediaSlots: MediaSlot[]
  siteUrl: string
  /** Approved client reviews (content/reviews.json). Undefined = not checked. */
  reviews?: Review[]
  /** FAQ items (content/faq.json). Optional section: empty = hidden; supplied items must be real. */
  faqItems?: Array<{ id: string; question: string; answer: string }>
  /** Legal inputs (content/legal.json); undefined = not checked. */
  legal?: { effectiveDate: { status: string; note?: string }; governingLaw: { status: string; note?: string }; appointmentPolicy: { status: string; note?: string } }
  /** Analytics provider configured for this build ('none' unless set). */
  analyticsProvider?: string
  /** Gallery items (content/gallery.json). */
  galleryItems?: Array<{ id: string; people: boolean; license?: string | undefined }>
  /** Publishing consent for identifiable people (content/consent.json). */
  peopleConsent?: { status: 'verified' } | { status: 'pending'; note: string }
  /** About page client content (content/about.json). */
  about?: { philosophy: CopyField }
  /** Raw JSON of every content file, scanned for forbidden/fake content. */
  rawContent: Record<string, string>
}

export interface ContentReport {
  blockers: string[]
  warnings: string[]
  info: string[]
}

export const PLACEHOLDER_DOMAIN = 'classy-unisex-salon.example'
const OPTIONAL_BUSINESS_FIELDS = new Set(['geo'])

export function evaluateContent(input: ContentInput): ContentReport {
  const blockers: string[] = []
  const warnings: string[] = []
  const info: string[] = []
  const { business, serviceGroups, brands, mediaSlots, siteUrl, rawContent } = input

  // 1. Business / contact facts must be verified.
  for (const [key, field] of Object.entries(business)) {
    if (field && typeof field === 'object' && 'status' in field && field.status === 'pending') {
      const line = `business.${key}: ${(field as { note: string }).note}`
      if (OPTIONAL_BUSINESS_FIELDS.has(key)) info.push(line)
      else blockers.push(line)
    }
  }
  for (const ig of business.instagram) {
    if (ig.url.status === 'pending') blockers.push(`business.instagram.${ig.id}: ${ig.url.note}`)
  }
  for (const key of ['phone', 'whatsapp', 'email'] as const) {
    const f = business[key]
    if (f.status === 'verified' && looksFake(f.value)) blockers.push(`business.${key}: "${f.value}" looks like test/fake data`)
  }

  // 2. Services: names confirmed, descriptions present.
  for (const g of serviceGroups) {
    if (g.summary.status === 'pending') blockers.push(`services.${g.id}.summary: ${g.summary.note}`)
    if (g.summary.status === 'draft') warnings.push(`services.${g.id}.summary: draft copy awaiting client review`)
    for (const s of g.items) {
      if (s.labelStatus === 'needs-confirmation') blockers.push(`services.${s.id}: "${s.sourceLabel}". ${s.flag ?? 'needs client confirmation'}`)
      if (s.description.status === 'pending') blockers.push(`services.${s.id}.description: ${s.description.note}`)
      if (s.description.status === 'draft') warnings.push(`services.${s.id}.description: draft copy awaiting client review`)
    }
  }

  // 2b. About page client content.
  if (input.about) {
    const p = input.about.philosophy
    if (p.status === 'pending') blockers.push(`about.philosophy: ${p.note}`)
    if (p.status === 'draft') warnings.push('about.philosophy: draft copy awaiting client review')
  }

  // 3. Brands: no unverified claims.
  for (const b of brands) if (b.claim !== 'none') blockers.push(`brands.${b.id}: partnership claim requires client-supplied proof`)

  // 4. Media: required slots must hold real assets.
  const missingRequired = mediaSlots.filter((m) => m.required && m.status !== 'supplied')
  const missingLogos = missingRequired.filter((m) => m.kind === 'logo')
  const missingMedia = missingRequired.filter((m) => m.kind !== 'logo')
  if (missingLogos.length) blockers.push(`logo files missing (${missingLogos.length}): ${missingLogos.map((m) => m.id).join(', ')}`)
  if (missingMedia.length) blockers.push(`required media still placeholders (${missingMedia.length}): ${missingMedia.map((m) => m.id).join(', ')}`)
  const optional = mediaSlots.filter((m) => !m.required && m.status !== 'supplied')
  if (optional.length) info.push(`optional media not supplied (${optional.length}); components fall back gracefully`)

  // 5. Fake or reference-site content anywhere in the content files.
  for (const [file, text] of Object.entries(rawContent)) {
    const withoutComments = text.replace(/"\$comment"\s*:\s*"(?:[^"\\]|\\.)*"/g, '')
    for (const { pattern, reason } of FORBIDDEN_CONTENT) {
      if (pattern.test(withoutComments)) blockers.push(`content/${file}: ${reason} (${pattern})`)
    }
  }

  // 5b. Licensing: preview/comp images that still need a purchased licence block release.
  for (const m of mediaSlots) {
    const lic = (m as { license?: string }).license
    if (m.status === 'supplied' && lic && /licen[cs]e required/i.test(lic)) blockers.push(`media.${m.id}: ${lic}`)
  }

  for (const g of input.galleryItems ?? []) {
    if (g.license && /licen[cs]e required/i.test(g.license)) blockers.push(`gallery.${g.id}: ${g.license}`)
  }

  // 6. Consent: identifiable people in supplied media need the client's confirmation.
  const peopleSlots = mediaSlots.filter((m) => m.status === 'supplied' && m.people).map((m) => m.id)
  const peopleGallery = (input.galleryItems ?? []).filter((g) => g.people).map((g) => g.id)
  if (input.peopleConsent?.status === 'pending' && peopleSlots.length + peopleGallery.length > 0) {
    blockers.push(`consent.peopleInMedia: ${input.peopleConsent.note} (${peopleSlots.length} page photos, ${peopleGallery.length} gallery items)`)
  }

  // 7. Reviews: genuine, approved, verbatim client reviews are required; nothing fake or placeholder.
  if (input.reviews) {
    const list = input.reviews
    if (list.length === 0) blockers.push('reviews: CLIENT REVIEWS REQUIRED — genuine, approved client reviews (content/reviews.json)')
    const seen = new Map<string, string>()
    const today = new Date().toISOString().slice(0, 10)
    for (const r of list) {
      const problem = reviewProblem(r)
      if (problem) blockers.push(`reviews.${r.id}: ${problem}`)
      const key = r.quote.toLowerCase().replace(/\W+/g, ' ').trim()
      if (seen.has(key)) blockers.push(`reviews.${r.id}: duplicate of ${seen.get(key)}`)
      seen.set(key, r.id)
      if (r.date && r.date > today) blockers.push(`reviews.${r.id}: date ${r.date} is in the future`)
      if (r.approval.approvedOn > today) blockers.push(`reviews.${r.id}: approval date ${r.approval.approvedOn} is in the future`)
    }
  }

  // 8. FAQ: optional (hidden when empty), but supplied items must be genuine client answers.
  for (const f of input.faqItems ?? []) {
    if (PLACEHOLDER_TEXT.test(f.question) || PLACEHOLDER_TEXT.test(f.answer) || /client faq content required/i.test(f.answer)) blockers.push(`faq.${f.id}: placeholder text`)
    if (f.answer.trim().length < 3) blockers.push(`faq.${f.id}: empty answer`)
  }

  // 10. Legal pages: required facts must be supplied; the privacy policy must match what the site does.
  if (input.legal) {
    for (const key of ['effectiveDate', 'governingLaw'] as const) {
      const f = input.legal[key]
      if (f.status === 'pending') blockers.push(`legal.${key}: LEGAL DETAILS REQUIRED — ${f.note}`)
    }
    if (input.legal.appointmentPolicy.status === 'pending') info.push('legal.appointmentPolicy: CLIENT POLICY REQUIRED (optional: the Terms section is omitted until supplied)')
    if (input.legal.appointmentPolicy.status === 'draft') warnings.push('legal.appointmentPolicy: draft copy awaiting client review')
  }
  if (input.analyticsProvider && input.analyticsProvider !== 'none') {
    blockers.push(`analytics: provider "${input.analyticsProvider}" is configured, but the Privacy Policy states that no analytics are used. Update src/data/legal.ts (and add cookie consent if required) before release.`)
  }

  // 11. Production domain.
  if (siteUrl.includes(PLACEHOLDER_DOMAIN) || !/^https:\/\//.test(siteUrl)) blockers.push(`VITE_SITE_URL: production https domain not set (currently ${siteUrl})`)

  return { blockers, warnings, info }
}

const PLACEHOLDER_TEXT = /lorem|ipsum|\[client|client reviews required|placeholder|sample review|dummy|test review|tbd|xxx|asdf|your review here|review text/i
const FAKE_AUTHOR = /^(john|jane) doe$|^(test|tester|user|customer|client|guest|anonymous|happy customer|satisfied client|reviewer|name|author)\s*\d*$|^(a |an )?(happy|satisfied|regular) (customer|client)$|lorem|placeholder|\[|xxx/i

/** Returns why a review cannot ship, or null when it looks genuine. Exported for tests. */
export function reviewProblem(r: Pick<Review, 'quote' | 'author'>): string | null {
  if (PLACEHOLDER_TEXT.test(r.quote)) return 'quote looks like placeholder/sample text'
  if (FAKE_AUTHOR.test(r.author.trim())) return `author "${r.author}" looks like a placeholder or generic name`
  for (const { pattern, reason } of FORBIDDEN_CONTENT) {
    if (pattern.test(r.quote) || pattern.test(r.author)) return reason
  }
  return null
}
