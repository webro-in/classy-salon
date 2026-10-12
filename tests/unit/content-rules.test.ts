import { describe, expect, it } from 'vitest'
import { evaluateContent, type ContentInput } from '../../scripts/content-rules'
import { business } from '@/data/business'
import { brands } from '@/data/brands'
import { serviceGroups } from '@/data/services'
import { mediaSlots } from '@/data/media'
import { galleryItems } from '@/data/gallery'
import { consent } from '@/data/consent'
import type { Business } from '@/types/content'

const current: ContentInput = {
  business,
  serviceGroups,
  brands,
  mediaSlots,
  siteUrl: 'https://classy-unisex-salon.example',
  about: { philosophy: { status: 'pending', note: 'pending' } },
  galleryItems,
  peopleConsent: consent.peopleInMedia as ContentInput['peopleConsent'],
  rawContent: {},
}

/** A complete, verified dataset: what the site looks like once the client supplies everything. */
function complete(): ContentInput {
  const v = <T,>(value: T) => ({ status: 'verified' as const, value })
  const b: Business = {
    ...business,
    phone: v('+919812345678'),
    whatsapp: v('+919812345678'),
    email: v('hello@classysalon.in'),
    hours: v([{ days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], opens: '10:00', closes: '20:00' }]),
    rating: v({ value: 4.8, count: 300, countLabel: '300+', source: 'Google' as const }),
    geo: v({ lat: 26.8, lng: 75.86 }),
    story: { status: 'verified', value: 'Client-approved story.' },
    legalName: v('Classy Unisex Salon'),
    instagram: business.instagram.map((i) => ({ ...i, url: v(`https://www.instagram.com/${i.handle}/`) })),
  }
  return {
    business: b,
    serviceGroups: serviceGroups.map((g) => ({
      ...g,
      summary: { status: 'verified', value: 'Approved.' },
      items: g.items.map((s) => ({ ...s, labelStatus: s.labelStatus === 'needs-confirmation' ? 'confirmed' : s.labelStatus, description: { status: 'verified', value: 'Approved.' } })),
    })),
    brands,
    mediaSlots: mediaSlots.map((m) => ({ ...(m.required ? { ...m, src: `/media/${m.id}.jpg`, status: 'supplied' as const } : m), license: m.license?.replace(/licen[cs]e required/i, 'licensed') })),
    about: { philosophy: { status: 'verified', value: 'Approved philosophy.' } },
    siteUrl: 'https://www.classysalon.in',
    rawContent: { 'business.json': '{"$comment":"mentions Geetanjali as reference only","name":"Classy"}' },
  }
}

describe('release content rules', () => {
  it('blocks release with the current (incomplete) client content', () => {
    const r = evaluateContent(current)
    const text = r.blockers.join('\n')
    expect(text).not.toMatch(/business\.(email|instagram)/) // supplied by the client
    expect(text).toMatch(/business\.legalName/)
    expect(text).not.toMatch(/business\.(phone|whatsapp|rating|hours)/)
    expect(text).toMatch(/Anti Dandruff/) // hyphenation still to confirm
    expect(text).not.toMatch(/Hair Textures|Other Hair Serices/) // client named these on 2026-10-02
    expect(text).not.toMatch(/logo files missing/) // client logo sheet supplied
    expect(text).not.toMatch(/required media still placeholders/) // all required page media is supplied
    expect(text).toMatch(/consent\.peopleInMedia/)
    expect(text).toMatch(/media\.heroSlide04: iStock/) // preview image still needs a licence
    expect(text).toMatch(/VITE_SITE_URL/)
    expect(text).toMatch(/about\.philosophy/)
  })

  it('passes once every required item is verified (optional media may stay pending)', () => {
    const r = evaluateContent(complete())
    expect(r.blockers).toEqual([])
    expect(r.info.join('\n')).toMatch(/optional media/)
  })

  it('blocks fake contact data', () => {
    const input = complete()
    input.business = { ...input.business, phone: { status: 'verified', value: '+9100000000000' } }
    expect(evaluateContent(input).blockers.join()).toMatch(/business\.phone.*fake/)
  })

  it('fake-data heuristic does not flag plausible real values', async () => {
    const { looksFake } = await import('../../scripts/forbidden')
    for (const real of ['+919812345678', '+919876501234', 'hello@classysalon.in']) expect(looksFake(real)).toBe(false)
    for (const fake of ['+91XXXXXXXXXX', '+919876543210', '+911111111111', 'test@example.com']) expect(looksFake(fake)).toBe(true)
  })

  it('blocks reference-site and competitor content (comments excluded)', () => {
    const input = complete()
    input.rawContent = { 'services.json': '{"summary":"We are experts in all aspects of hair"}', 'brands.json': '{"heading":"Our Partner Brands"}' }
    const text = evaluateContent(input).blockers.join('\n')
    expect(text).toMatch(/competitor headline/)
    expect(text).toMatch(/partnership claim/)
  })

  it('blocks unconfirmed service names and partnership claims', () => {
    const input = complete()
    input.serviceGroups = serviceGroups
    input.brands = brands.map((b, i) => (i === 0 ? ({ ...b, claim: 'official-partner' } as unknown as typeof b) : b))
    const text = evaluateContent(input).blockers.join('\n')
    expect(text).toMatch(/Anti Dandruff|Hyphenation/)
    expect(text).toMatch(/brands\.kerastase: partnership claim/)
  })
})
