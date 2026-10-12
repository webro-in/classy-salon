import { describe, expect, it } from 'vitest'
import { business } from '@/data/business'
import { brands, logoBrands, nameBrands } from '@/data/brands'
import { displayLabel, serviceGroups } from '@/data/services'
import { mediaSlots, getSlot } from '@/data/media'
import { buildLocalBusinessJsonLd, routeSeo } from '@/config/seo'

/** Exact wording from the client's handwritten sheet (docs/CONTENT-MAP.md §2). */
const SHEET = {
  hair: ['Keratin Treatment', 'Hair Botox Treatment', 'Anti Dandruff Treatment', 'Hair Glossing', 'Hair Repair Treatment', 'Hair Textures', 'Hair Kerastase', 'Hair Scalp Treatments', 'Other Hair Serices'],
  skin: ['Beauty Essentials', 'Skin – Hands & Feet Spa', 'Radiant Skin Solutions'],
  makeup: ['Bridal Makeup', 'HD Makeup', 'Airbrush Makeup'],
}

describe('services', () => {
  it('has exactly the three groups 01 Hair / 02 Skin / 03 Makeup', () => {
    expect(serviceGroups.map((g) => `${g.number} ${g.title}`)).toEqual(['01 Hair', '02 Skin', '03 Makeup'])
  })

  it('contains only services from the client sheet, in order, with no invented items', () => {
    for (const g of serviceGroups) expect(g.items.map((s) => s.sourceLabel)).toEqual(SHEET[g.id])
  })

  it('displays source wording until a correction is confirmed', () => {
    const all = serviceGroups.flatMap((g) => g.items)
    for (const s of all) {
      if (s.labelStatus !== 'confirmed') expect(displayLabel(s)).toBe(s.sourceLabel)
    }
    expect(displayLabel(all.find((s) => s.id === 'other-hair-serices')!)).toBe('Signature Hair Services') // client-confirmed name
    expect(displayLabel(all.find((s) => s.id === 'anti-dandruff-treatment')!)).toBe('Anti Dandruff Treatment') // still unconfirmed
  })

  it('never contains prices', () => {
    expect(JSON.stringify(serviceGroups)).not.toMatch(/₹|rs\.?\s?\d|inr|\bprice/i)
  })
})

describe('brands', () => {
  it('shows exactly the client-selected brands: six green-dot brands plus Wella, Shea Butter and Brillare Professional', () => {
    expect(brands.map((b) => b.name)).toEqual(['Kérastase', "L'Oréal Professionnel", 'Kanpeki', 'Redken', 'Olaplex', 'K18', 'Wella', 'Shea Butter', 'Brillare Professional'])
    expect(logoBrands).toHaveLength(9)
    expect(nameBrands).toHaveLength(0)
    expect(brands.map((b) => b.name).join()).not.toMatch(/Guinot|Thalgo|Dyson/)
  })

  it('uses one client-supplied logo file per brand (from the client logo sheet)', async () => {
    const { existsSync } = await import('node:fs')
    for (const b of brands) {
      const slot = mediaSlots.find((s) => s.id === `brand.${b.id}`)!
      expect(slot.src, b.name).toBe(`/media/brands/${b.id}.png`)
      expect(existsSync(`public${slot.src}`), b.name).toBe(true)
      expect(slot.required, b.name).toBe(true)
    }
  })

  it('makes no partnership claims', () => {
    expect(brands.every((b) => b.claim === 'none')).toBe(true)
    expect(JSON.stringify(brands)).not.toMatch(/partner|official|verified/i)
  })
})

describe('business facts', () => {
  it('uses the client-verified rating (4.8 · 1500+), hours and WhatsApp number', () => {
    expect(business.rating).toMatchObject({ status: 'verified', value: { value: 4.8, count: 1500, countLabel: '1500+', source: 'Google' } })
    expect(business.hours).toMatchObject({ status: 'verified', value: [{ days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], opens: '09:30', closes: '21:30' }] })
    expect(business.whatsapp).toMatchObject({ status: 'verified', value: '+918302555854' })
  })

  it('JSON-LD includes only verified fields', () => {
    const ld = buildLocalBusinessJsonLd()
    expect(ld['@type']).toBe('HairSalon')
    expect(ld).toMatchObject({ aggregateRating: { ratingValue: 4.8, reviewCount: 1500 }, telephone: '+918302555854' })
    expect(ld).toHaveProperty('openingHoursSpecification')
    expect(ld).toMatchObject({ email: 'Classysalonjaipur@gmail.com', hasMap: 'https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw' })
    expect(ld.sameAs).toEqual(['https://www.instagram.com/classysalonjaipur/', 'https://www.instagram.com/classy_salonjaipur/'])
    expect(ld).not.toHaveProperty('geo') // still pending
    expect(ld).toHaveProperty('address')
  })

  it('SEO copy avoids unverified claims', () => {
    const copy = JSON.stringify(routeSeo)
    expect(copy).not.toMatch(/\bbest\b|no\.?\s?1|award|certified|partner|world.class|luxury/i)
  })
})

describe('media slots', () => {
  it('have unique ids, alt text and valid ratios', () => {
    const ids = mediaSlots.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const s of mediaSlots) {
      expect(s.alt.length).toBeGreaterThan(2)
      expect(s.ratio).toMatch(/^\d+:\d+$/)
    }
  })

  it('include a logo slot for every brand and an image slot for every service', () => {
    for (const b of brands) expect(getSlot(`brand.${b.id}`).kind).toBe('logo')
    for (const s of serviceGroups.flatMap((g) => g.items)) expect(getSlot(`service.${s.id}`)).toBeTruthy()
  })

  it('throws on unknown slots so typos fail loudly', () => {
    expect(() => getSlot('nope')).toThrow(/Unknown media slot/)
  })
})
