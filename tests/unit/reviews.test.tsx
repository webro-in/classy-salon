import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { business, googleRating } from '@/data/business'
import { featuredReviews, googleReviewsUrl, listReviews, reviews, reviewsPageCopy } from '@/data/reviews'
import { reviewSchema, type Review } from '@/types/content'
import { buildGeneralEnquiryMessage, getGeneralWhatsAppUrl } from '@/lib/links'
import { evaluateContent, reviewProblem } from '../../scripts/content-rules'
import { mediaSlots } from '@/data/media'
import { ReviewItem } from '@/sections/reviews/ReviewItem'
import { RatingSummary } from '@/sections/reviews/RatingSummary'

/** TEST FIXTURE ONLY (never content): exercises the component with every optional field. */
const fixture: Review = {
  id: 'fixture-one',
  quote: 'Fixture sentence used only inside this unit test.',
  author: 'Fixture Person',
  rating: 4.5,
  source: 'Google',
  date: '2026-09-14',
  approval: { permission: true, verbatim: true, sourceRef: 'unit test', approvedOn: '2026-10-01' },
}

describe('rating data (centralised in content/business.json)', () => {
  it('derives the display rating from business data', () => {
    expect(business.rating.status).toBe('verified')
    expect(googleRating).toMatchObject({ value: 4.8, display: '4.8', outOf: 5, count: 1500, countLabel: '1500+', source: 'Google' })
  })

  it('renders the numeral, "out of 5", the count and a proportional line (no five stars)', () => {
    const { container } = render(<MemoryRouter><RatingSummary /></MemoryRouter>)
    expect(container.querySelector('[data-rating-value]')).toHaveTextContent('4.8out of 5')
    expect(container.querySelector('[data-rating-count]')).toHaveTextContent('1500+')
    expect(container.querySelector('[data-rating-line]')?.getAttribute('data-rating-line')).toBe('96')
    expect(container.querySelectorAll('svg').length).toBeLessThanOrEqual(1) // one link icon, no star row
    expect(screen.getByRole('link', { name: /Read our Google reviews/ })).toHaveAttribute('href', googleReviewsUrl!)
  })
})

describe('review data (content/reviews.json)', () => {
  it('contains only the four genuine Google reviews supplied by the client, two featured', () => {
    expect(reviews.map((r) => r.author)).toEqual(['Swetha Suthar', 'Mishma Bijawat', 'Madhu Bhardwaj', 'Tanvi Gupta'])
    expect(featuredReviews.map((r) => r.id)).toEqual(['swetha-suthar', 'mishma-bijawat'])
    expect(listReviews.map((r) => r.id)).toEqual(['madhu-bhardwaj', 'tanvi-gupta'])
    for (const r of reviews) {
      expect(r.approval.verbatim).toBe(true)
      expect(r.source).toBe('Google')
      expect(r.date).toBeUndefined() // Google shows only a relative age
    }
  })

  it('schema requires verbatim + permission + provenance on every review', () => {
    expect(reviewSchema.safeParse(fixture).success).toBe(true)
    const { approval: _a, ...noApproval } = fixture
    void _a
    expect(reviewSchema.safeParse(noApproval).success).toBe(false)
    expect(reviewSchema.safeParse({ ...fixture, approval: { ...fixture.approval, permission: false } }).success).toBe(false)
    expect(reviewSchema.safeParse({ ...fixture, rating: 6 }).success).toBe(false)
    expect(reviewSchema.safeParse({ ...fixture, date: 'last week' }).success).toBe(false)
  })

  it('ReviewItem renders only the supplied fields, semantically', () => {
    const { container, rerender } = render(<ReviewItem review={fixture} />)
    expect(container.querySelector('figure blockquote')).toHaveTextContent(fixture.quote)
    expect(container.querySelector('figcaption cite')).toHaveTextContent('Fixture Person')
    expect(container.querySelector('[data-review-stars]')).toHaveAttribute('aria-label', 'Rated 4.5 out of 5')
    expect(container.querySelector('[data-review-stars]')).toHaveTextContent('★★★★½')
    expect(container.querySelector('figcaption')).toHaveTextContent('14 September 2026')
    expect(container.querySelector('figcaption')).toHaveTextContent('Google Review')
    rerender(<ReviewItem review={{ ...fixture, rating: 5, date: undefined, dateLabel: '8 months ago' }} />)
    expect(container.querySelector('[data-review-stars]')).toHaveTextContent('★★★★★')
    expect(container.querySelector('figcaption')).toHaveTextContent('8 months ago')
    const minimal: Review = { id: 'fixture-two', quote: 'Another fixture sentence for this test.', author: 'Fixture Two', approval: fixture.approval }
    rerender(<ReviewItem review={minimal} />)
    expect(container.querySelector('figcaption')).toHaveTextContent(/^Fixture Two$/)
  })
})

describe('review release rules', () => {
  const base = { business, serviceGroups: [], brands: [], mediaSlots, siteUrl: 'https://x.in', rawContent: {} }

  it('blocks production while no approved reviews exist', () => {
    expect(evaluateContent({ ...base, reviews: [] }).blockers.join('\n')).toMatch(/CLIENT REVIEWS REQUIRED/)
    expect(evaluateContent({ ...base, reviews: [fixture] }).blockers.join('\n')).not.toMatch(/reviews/)
  })

  it('flags placeholder text, generic/fake names and reference-site content', () => {
    expect(reviewProblem({ quote: 'Lorem ipsum dolor sit amet', author: 'Riya' })).toMatch(/placeholder/)
    expect(reviewProblem({ quote: '[CLIENT REVIEWS REQUIRED]', author: 'Riya' })).toMatch(/placeholder/)
    for (const author of ['John Doe', 'Customer', 'Anonymous', 'Happy customer', 'Test 2']) {
      expect(reviewProblem({ quote: 'A perfectly ordinary sentence.', author }), author).toMatch(/placeholder or generic/)
    }
    expect(reviewProblem({ quote: 'Lovely visit to Geetanjali.', author: 'Riya' })).toMatch(/reference-site/)
    expect(reviewProblem({ quote: 'Great experience, will come again.', author: 'Riya S' })).toBeNull()
  })

  it('blocks duplicates and future dates', () => {
    const dup = { ...fixture, id: 'fixture-dup' }
    expect(evaluateContent({ ...base, reviews: [fixture, dup] }).blockers.join('\n')).toMatch(/duplicate of fixture-one/)
    expect(evaluateContent({ ...base, reviews: [{ ...fixture, date: '2999-01-01' }] }).blockers.join('\n')).toMatch(/in the future/)
  })
})

describe('Reviews WhatsApp CTA', () => {
  it('uses the general appointment-enquiry message and never confirms a booking', () => {
    expect(buildGeneralEnquiryMessage()).toBe('Hello Classy Unisex Salon,\n\nI would like to enquire about an appointment.\n\nThank you.')
    const url = getGeneralWhatsAppUrl()!
    expect(url.startsWith('https://wa.me/918302555854?text=')).toBe(true)
    expect(decodeURIComponent(url.split('?text=')[1]!)).toBe(buildGeneralEnquiryMessage())
    expect(JSON.stringify(reviewsPageCopy).toLowerCase()).not.toMatch(/booking confirmed|best salon|partner/)
  })
})
