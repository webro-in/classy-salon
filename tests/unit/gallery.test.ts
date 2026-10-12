import { existsSync } from 'node:fs'
import { imageSize } from './helpers/image-size'
import { describe, expect, it } from 'vitest'
import { emptyGalleryCategories, galleryCategories, galleryItems, itemsFor } from '@/data/gallery'
import { consent } from '@/data/consent'
import { business } from '@/data/business'
import { mediaSlots } from '@/data/media'
import { evaluateContent } from '../../scripts/content-rules'

describe('gallery content', () => {
  it('shows only populated categories (Before & After hidden until supplied)', () => {
    expect(galleryCategories.map((c) => c.id)).toEqual(['work', 'space', 'looks', 'videos'])
    expect(emptyGalleryCategories.map((c) => c.id)).toEqual(['before-after'])
    expect(galleryCategories.reduce((n, c) => n + c.count, 0)).toBe(galleryItems.length)
  })

  it('every item is real Classy media that exists in public/, with alt text and a correct ratio', () => {
    expect(galleryItems.length).toBeGreaterThanOrEqual(30)
    const ids = new Set<string>()
    for (const item of galleryItems) {
      expect(ids.has(item.id), item.id).toBe(false)
      ids.add(item.id)
      for (const f of [item.src, item.thumb, item.poster].filter(Boolean) as string[]) {
        expect(f).toMatch(/^\/media\/gallery\//)
        expect(existsSync(`public${f}`), f).toBe(true)
      }
      expect(item.alt.length).toBeGreaterThan(10)
      const [w, h] = item.ratio.split(':').map(Number) as [number, number]
      const size = imageSize(`public${item.kind === 'image' ? item.src : item.thumb}`)
      expect(Math.abs(w / h - size.width / size.height), item.id).toBeLessThan(0.01)
      if (item.kind === 'video') expect(item.src).toMatch(/\.mp4$/)
    }
    // Licensed stock is declared in `license` (Looks only); no other field may point at stock/reference sources.
    expect(JSON.stringify(galleryItems.map((i) => ({ ...i, license: undefined })))).not.toMatch(/geetanjali|klickpin|pinterest|stock|unsplash/i)
    for (const item of galleryItems) if (item.license) expect(item.category, item.id).toBe('looks')
  })

  it('videos are only in the Videos category; filters return the right subsets', () => {
    expect(itemsFor('videos').every((i) => i.kind === 'video')).toBe(true)
    expect(itemsFor('work').every((i) => i.category === 'work')).toBe(true)
    expect(itemsFor('all')).toHaveLength(galleryItems.length)
    expect(new Set(itemsFor('all').map((i) => i.id))).toEqual(new Set(galleryItems.map((i) => i.id)))
  })
})

describe('people consent gate', () => {
  it('consent is pending and identifiable-people media is flagged', () => {
    expect(consent.peopleInMedia.status).toBe('pending')
    expect(galleryItems.filter((i) => i.people).length).toBeGreaterThan(0)
    expect(mediaSlots.filter((m) => m.people).length).toBeGreaterThan(0)
  })

  it('blocks release while consent is pending, and clears once verified', () => {
    const base = { business, serviceGroups: [], brands: [], mediaSlots, siteUrl: 'https://x.in', rawContent: {}, galleryItems }
    const pending = evaluateContent({ ...base, peopleConsent: consent.peopleInMedia as never })
    expect(pending.blockers.join('\n')).toMatch(/consent\.peopleInMedia/)
    const ok = evaluateContent({ ...base, peopleConsent: { status: 'verified' } })
    expect(ok.blockers.join('\n')).not.toMatch(/consent\.peopleInMedia/)
  })
})
