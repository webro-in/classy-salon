import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { business } from '@/data/business'
import { legal, missingLegalFacts, privacyPolicy, termsAndConditions, type LegalDocument } from '@/data/legal'
import { mediaSlots } from '@/data/media'
import { isOptionalPending, LegalPage } from '@/sections/legal/LegalPage'
import { legalNav, primaryNav } from '@/data/navigation'
import { evaluateContent } from '../../scripts/content-rules'

vi.mock('@/components/seo/JsonLd', () => ({ JsonLd: () => null })) // Head needs the SSG helmet context

/** Published wording only (pending-placeholder notes excluded). */
const allText = (doc: LegalDocument) => JSON.stringify(doc.sections.flatMap((s) => [s.title, ...s.blocks.filter((b) => b.kind !== 'pending')]))
const docs = [privacyPolicy, termsAndConditions]

describe('legal data', () => {
  it('required legal facts are pending (nothing invented)', () => {
    expect(business.legalName.status).toBe('pending')
    expect(legal.effectiveDate.status).toBe('pending')
    expect(legal.governingLaw.status).toBe('pending')
    expect(missingLegalFacts()).toEqual(['legal business name', 'effective date', 'governing law and jurisdiction'])
  })

  it('contains no fabricated legal or policy details', () => {
    for (const doc of docs) {
      const t = allText(doc)
      expect(t).not.toMatch(/\bGST(IN)?\b|\bCIN\b|\bPAN\b|Pvt\.? Ltd|Private Limited|\bLLP\b|registered office|company (number|registration)/i)
      expect(t).not.toMatch(/courts? (of|in) |laws of india|rajasthan law|jaipur courts/i)
      expect(t).not.toMatch(/refund|deposit|cancellation fee|no-show|membership|guarantee|\bprice[sd]? (are|is|from)\b/i)
      expect(t).not.toMatch(/database|our servers store|we store your|account creation|payment processing|automated booking/i)
      expect(t).not.toMatch(/google analytics|plausible|cookie banner/i)
    }
  })

  it('privacy policy describes what the site actually does', () => {
    const t = allText(privacyPolicy)
    expect(t).toMatch(/opens WhatsApp/)
    expect(t).toMatch(/does not keep a copy/)
    expect(t).toMatch(/only after you press “Show map”/)
    expect(t).toMatch(/set cookies, or use analytics or advertising trackers/)
  })

  it('terms state that an enquiry is not a booking and do not claim brand partnerships', () => {
    const t = allText(termsAndConditions)
    expect(t).toMatch(/An enquiry is a request, not a booking/)
    expect(t).toMatch(/does not mean that any brand endorses or is partnered/)
    expect(t).not.toMatch(/booking confirmed/i)
  })

  it('pending optional sections are recognised (omitted in production); required ones are not', () => {
    const policy = termsAndConditions.sections.find((s) => s.id === 'appointment-policy')!
    const law = termsAndConditions.sections.find((s) => s.id === 'governing-law')!
    expect(isOptionalPending(policy)).toBe(true)
    expect(isOptionalPending(law)).toBe(false)
  })
})

describe('<LegalPage> (development/preview)', () => {
  it('fills contact details from central data and shows legal placeholders', () => {
    const { container } = render(<MemoryRouter><LegalPage doc={privacyPolicy} trail={[{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy' }]} /></MemoryRouter>)
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelector('h1')).toHaveTextContent('Privacy Policy')
    expect(container.textContent).toContain('[LEGAL BUSINESS NAME REQUIRED]')
    expect(container.querySelector('[data-effective-date]')).toHaveTextContent('[LEGAL DETAILS REQUIRED: effective date]')
    expect(container.querySelector('a[href^="mailto:Classysalonjaipur@gmail.com"]')).not.toBeNull()
    expect(container.querySelector('a[href="tel:+918302555854"]')).not.toBeNull()
    expect(container.textContent).toContain('Plot no. 210, Vishwa Vidhyalaya Nagar, Jagatpura, Jaipur, Rajasthan 302017')
    expect(container.textContent).not.toMatch(/\{\{\w+\}\}/)
  })
})

describe('legal release gate', () => {
  const base = { business, serviceGroups: [], brands: [], mediaSlots, siteUrl: 'https://x.in', rawContent: {} }
  it('blocks production while the legal name, effective date or governing law is missing', () => {
    const b = evaluateContent({ ...base, legal }).blockers.join('\n')
    expect(b).toMatch(/business\.legalName/)
    expect(b).toMatch(/legal\.effectiveDate: LEGAL DETAILS REQUIRED/)
    expect(b).toMatch(/legal\.governingLaw: LEGAL DETAILS REQUIRED/)
    expect(b).not.toMatch(/appointmentPolicy/) // optional
  })

  it('clears once supplied', () => {
    const v = <T,>(value: T) => ({ status: 'verified' as const, value })
    const ok = evaluateContent({ ...base, business: { ...business, legalName: v('Fixture Legal Name') }, legal: { ...legal, effectiveDate: v('2026-10-02'), governingLaw: v('Fixture governing law sentence.') } })
    expect(ok.blockers.join('\n')).not.toMatch(/legal/i)
  })

  it('blocks release if analytics are switched on without updating the privacy policy', () => {
    expect(evaluateContent({ ...base, analyticsProvider: 'ga4' }).blockers.join()).toMatch(/analytics/)
    expect(evaluateContent({ ...base, analyticsProvider: 'none' }).blockers.join()).not.toMatch(/analytics/)
  })
})

describe('navigation', () => {
  it('legal pages live in the footer only', () => {
    expect(legalNav).toEqual([{ label: 'Privacy Policy', to: '/privacy' }, { label: 'Terms & Conditions', to: '/terms' }])
    expect(primaryNav.map((n) => n.to)).not.toContain('/privacy')
    expect(primaryNav.map((n) => n.to)).not.toContain('/terms')
  })
})
