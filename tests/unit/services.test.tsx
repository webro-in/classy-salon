import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { allServices, displayLabel, serviceGroups, servicesPageCopy } from '@/data/services'
import { buildServiceEnquiryMessage, getServiceWhatsAppUrl } from '@/lib/links'
import { ServiceCategory } from '@/sections/services/ServiceCategory'

const EXPECTED = {
  hair: ['Keratin Treatment', 'Hair Botox Treatment', 'Anti Dandruff Treatment', 'Hair Glossing', 'Hair Repair Treatment', 'Textured Hair Artistry', 'Kérastase Hair Rituals', 'Hair Scalp Treatments', 'Signature Hair Services'],
  skin: ['Beauty Essentials', 'Skin – Hands & Feet Spa', 'Radiant Skin Solutions'],
  makeup: ['Bridal Makeup', 'HD Makeup', 'Airbrush Makeup'],
}

describe('Our Services data', () => {
  it('has exactly three groups: Hair, Skin, Makeup (01–03)', () => {
    expect(serviceGroups.map((g) => [g.id, g.number, g.title])).toEqual([
      ['hair', '01', 'Hair'],
      ['skin', '02', 'Skin'],
      ['makeup', '03', 'Makeup'],
    ])
  })

  it('has the 15 client services, in sheet order, with display names exactly as written', () => {
    expect(allServices).toHaveLength(15)
    for (const g of serviceGroups) expect(g.items.map(displayLabel)).toEqual(EXPECTED[g.id])
  })

  it('shows the client-confirmed names and keeps still-unconfirmed wording as written', () => {
    const names = allServices.map(displayLabel)
    for (const n of ['Anti Dandruff Treatment', 'Textured Hair Artistry', 'Kérastase Hair Rituals', 'Signature Hair Services', 'Beauty Essentials', 'Skin – Hands & Feet Spa']) {
      expect(names).toContain(n)
    }
    expect(names).not.toContain('Other Hair Serices')
    expect(names).not.toContain('Kérastase Hair Treatment')
  })

  it('contains no prices, memberships, packages, durations or fake reviews', () => {
    const text = JSON.stringify({ serviceGroups, servicesPageCopy })
    expect(text).not.toMatch(/₹|\brs\.?\s?\d|\binr\b|price|pricing|\btier\b|\bmember(ship)?s?\b|package/i)
    expect(text).not.toMatch(/\b\d+\s?(min|mins|minutes|hours?|hrs?)\b/i)
    expect(text).not.toMatch(/review(ed)? by|★★|testimonial/i)
    expect(text).not.toMatch(/best salon|no\.?\s?1|guarantee|booking confirmed|partner/i)
  })
})

describe('service WhatsApp enquiry', () => {
  it('uses the exact Phase 4 message format and never confirms a booking', () => {
    expect(buildServiceEnquiryMessage('Hair Kerastase')).toBe(
      'Hello Classy Unisex Salon,\n\nI would like to enquire about:\n\nService: Hair Kerastase\n\nName:\nPreferred Date:\nPreferred Time:\n\nThank you.',
    )
    expect(buildServiceEnquiryMessage('Bridal Makeup').toLowerCase()).not.toMatch(/confirm|booked/)
  })

  it('encodes special characters correctly for wa.me', () => {
    const url = getServiceWhatsAppUrl('Skin – Hands & Feet Spa')!
    expect(url.startsWith('https://wa.me/918302555854?text=')).toBe(true)
    const raw = url.split('?text=')[1]!
    expect(raw).not.toMatch(/[ &\n–]/) // spaces, ampersand, newline and en dash are all percent-encoded
    expect(decodeURIComponent(raw)).toContain('Service: Skin – Hands & Feet Spa')
  })

  it('returns null while the WhatsApp number is pending', () => {
    expect(getServiceWhatsAppUrl('HD Makeup', null)).toBeNull()
  })
})

describe('<ServiceCategory>', () => {
  it('renders every row with its name and an enquiry link for that service', () => {
    const group = serviceGroups.find((g) => g.id === 'skin')!
    render(<MemoryRouter><ServiceCategory group={group} tone="ivory" /></MemoryRouter>)
    const list = screen.getByRole('list', { name: 'Skin services' })
    const rows = within(list).getAllByRole('listitem').filter((li) => li.hasAttribute('data-service-row'))
    expect(rows).toHaveLength(3)
    rows.forEach((row, i) => {
      const name = EXPECTED.skin[i]!
      expect(within(row).getByRole('heading', { level: 3 })).toHaveTextContent(name)
      const link = within(row).getByRole('link', { name: new RegExp(`Enquire on WhatsApp.*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i') })
      expect(decodeURIComponent(link.getAttribute('href')!)).toContain(`Service: ${name}`)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('disclosure buttons expose aria-expanded and toggle the details panel', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    const group = serviceGroups.find((g) => g.id === 'makeup')!
    render(<MemoryRouter><ServiceCategory group={group} tone="ivory" /></MemoryRouter>)
    const toggle = screen.getByRole('button', { name: 'Show details: Bridal Makeup' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    const panel = document.getElementById(toggle.getAttribute('aria-controls')!)!
    expect(panel).toHaveAttribute('inert')
    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Hide details: Bridal Makeup' })).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('inert')
  })
})
