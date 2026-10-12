import { describe, expect, it } from 'vitest'
import { aboutContent, aboutCopy, salonFacts } from '@/data/about'
import { teamMembers } from '@/data/team'
import { getSlot } from '@/data/media'

describe('about content', () => {
  it('uses the client-supplied philosophy, approach and principles verbatim', () => {
    expect(aboutContent.philosophy.status).toBe('verified')
    expect(aboutContent.philosophyTitle).toBe('Beauty is Personal.')
    expect(aboutContent.defines.items.map((i) => i.title)).toEqual(['Personalised Expertise', 'Precision & Craftsmanship', 'Client-Centred Service', 'Trust & Transparency', 'Contemporary Style'])
    expect(aboutContent.tagline).toBe('Where Your Style Meets Our Craft.')
  })

  it('UI copy is marked draft and contains no invented claims', () => {
    expect(aboutCopy.status).toBe('draft')
    const copy = JSON.stringify(aboutCopy)
    expect(copy).not.toMatch(/\b(since|founded|established)\b|\b(19|20)\d{2}\b|years? of|award|certified|best|leading|partner|founder|owner|expert/i)
  })

  it('every experience point cites an approved data source', () => {
    for (const p of aboutCopy.experience.points) expect(p.source).toMatch(/^(business\.|content\/)/)
  })

  it('salon facts use verified data only', () => {
    expect(salonFacts.map((f) => f.value)).toEqual(['Classy Unisex Salon', '2021', 'Unisex Salon', 'Jagatpura, Jaipur', 'Hair · Skin · Makeup'])
  })

  it('no people are published without approval', () => {
    expect(teamMembers).toEqual([])
  })

  it('About media slots exist with correct ratios', () => {
    expect(getSlot('aboutHero').mobileRatio).toBe('4:5')
    expect(getSlot('aboutStory').ratio).toBe('4:5')
    expect(getSlot('aboutApproach').ratio).toBe('21:9')
    expect(getSlot('aboutCta').ratio).toBe('4:5')
    for (const id of ['aboutStoryDetail', 'aboutSpace01', 'aboutSpace02', 'aboutSpace03']) expect(getSlot(id).required).toBe(true)
  })
})
