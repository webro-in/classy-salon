import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { faqItems } from '@/data/faq'
import { faqSchema } from '@/types/content'
import { FaqRow } from '@/sections/contact/ContactFaq'
import { evaluateContent } from '../../scripts/content-rules'
import { business } from '@/data/business'
import { mediaSlots } from '@/data/media'

/** TEST FIXTURE ONLY (never content). */
const fixture = { id: 'fixture-q', question: 'Fixture question for this unit test?', answer: 'Fixture answer used only in this unit test.' }

describe('FAQ data', () => {
  it('has no questions or answers until the client supplies them', () => {
    expect(faqItems).toEqual([])
    expect(faqSchema.safeParse({ items: [fixture] }).success).toBe(true)
  })

  it('release rules: empty FAQ is allowed (section hidden); placeholder answers block release', () => {
    const base = { business, serviceGroups: [], brands: [], mediaSlots, siteUrl: 'https://x.in', rawContent: {} }
    expect(evaluateContent({ ...base, faqItems: [] }).blockers.join()).not.toMatch(/faq/)
    expect(evaluateContent({ ...base, faqItems: [{ ...fixture, answer: '[CLIENT FAQ CONTENT REQUIRED]' }] }).blockers.join()).toMatch(/faq\.fixture-q: placeholder/)
    expect(evaluateContent({ ...base, faqItems: [{ ...fixture, answer: 'TBD' }] }).blockers.join()).toMatch(/placeholder/)
    expect(evaluateContent({ ...base, faqItems: [fixture] }).blockers.join()).not.toMatch(/faq/)
  })
})

describe('<FaqRow> accordion', () => {
  it('is a heading-wrapped button with aria-expanded/aria-controls; collapsed panel is inert', () => {
    render(<ul><FaqRow item={fixture} /></ul>)
    const button = screen.getByRole('button', { name: fixture.question })
    expect(button.closest('h3')).not.toBeNull()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    const panel = document.getElementById(button.getAttribute('aria-controls')!)!
    expect(panel).toHaveAttribute('role', 'region')
    expect(panel).toHaveAttribute('inert')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('inert')
    expect(screen.getByRole('region', { name: fixture.question })).toHaveTextContent(fixture.answer)
  })

  it('several items can be open at once', () => {
    render(<ul><FaqRow item={fixture} /><FaqRow item={{ ...fixture, id: 'fixture-r', question: 'Second fixture question?' }} /></ul>)
    fireEvent.click(screen.getByRole('button', { name: fixture.question }))
    fireEvent.click(screen.getByRole('button', { name: 'Second fixture question?' }))
    expect(screen.getAllByRole('button').every((b) => b.getAttribute('aria-expanded') === 'true')).toBe(true)
  })
})
