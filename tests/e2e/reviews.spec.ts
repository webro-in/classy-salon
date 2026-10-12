import { expect, test } from '@playwright/test'
import { VIEWPORTS, watchConsole } from './helpers'

test.describe('Reviews page', () => {
  test('prerendered SEO; WebPage JSON-LD without Review markup; no console errors', async ({ page, request }) => {
    const html = await (await request.get('/reviews')).text()
    expect(html).toMatch(/<title[^>]*>Reviews \| Classy Unisex Salon in Jagatpura, Jaipur<\/title>/)
    expect(html).toMatch(/<link[^>]*rel="canonical"[^>]*href="https:\/\/[^"]+\/reviews"/)
    expect(html).toMatch(/property="og:title" content="Reviews/)

    const problems = watchConsole(page)
    await page.goto('/reviews')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Reviews')
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => e.textContent ?? ''))
    expect(ld.some((t) => t.includes('"WebPage"'))).toBe(true)
    expect(ld.join()).not.toMatch(/"@type":"Review"/)
    expect(problems).toEqual([])
  })

  test('rating renders from the central data and counts up: numeral, out of 5, count', async ({ page }) => {
    await page.goto('/reviews')
    await expect(page.locator('[data-rating-value]')).toContainText('4.8')
    await expect(page.locator('[data-rating-value]')).toContainText('out of 5')
    await page.locator('[data-rating-count]').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-rating-count] [aria-hidden="true"]')).toHaveText('1500+', { timeout: 5000 })
    await expect(page.locator('[data-rating-count] .sr-only')).toHaveText('1500+')
    await expect(page.locator('[data-rating-line]')).toHaveAttribute('data-rating-line', '96')
  })

  test('heading hierarchy: one h1, sections use h2', async ({ page }) => {
    await page.goto('/reviews')
    const levels = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll('h1,h2,h3,h4')).map((h) => Number(h.tagName[1])))
    expect(levels[0]).toBe(1)
    for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1)
  })

  test('shows exactly the four client-supplied Google reviews: two featured, two in the list', async ({ page }) => {
    await page.goto('/reviews')
    await expect(page.locator('[data-review]')).toHaveCount(4)
    await expect(page.locator('section[aria-labelledby="highlights-title"] [data-review] cite')).toHaveText(['Swetha Suthar', 'Mishma Bijawat'])
    await expect(page.locator('#review-list [data-review] cite')).toHaveText(['Madhu Bhardwaj', 'Tanvi Gupta'])
    await expect(page.locator('section[aria-labelledby="highlights-title"]')).toContainText('Featured Review')
    await expect(page.locator('[data-review="swetha-suthar"]')).toContainText('8 months ago')
    await expect(page.locator('[data-review="swetha-suthar"] [data-review-stars]')).toHaveAttribute('aria-label', 'Rated 5 out of 5')
    await expect(page.locator('main [data-content-marker="reviews"]')).toHaveCount(0)
    await expect(page.locator('#list-title + p')).toHaveText('A selection of experiences shared by clients at Classy Unisex Salon, Jagatpura.')
  })

  test('Google reviews links use the verified listing and open safely', async ({ page }) => {
    await page.goto('/reviews')
    const links = page.getByRole('link', { name: /Read our Google reviews/i })
    expect(await links.count()).toBeGreaterThanOrEqual(2)
    for (let i = 0; i < (await links.count()); i++) {
      await expect(links.nth(i)).toHaveAttribute('href', 'https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw')
      await expect(links.nth(i)).toHaveAttribute('target', '_blank')
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/)
    }
  })

  test('Book and WhatsApp CTAs: enquiry message, never a confirmed booking', async ({ page }) => {
    await page.goto('/reviews')
    const cta = page.locator('section[aria-labelledby="reviews-book-title"]')
    await expect(cta.getByRole('link', { name: /Book an appointment/i })).toHaveAttribute('href', '/contact#book')
    const wa = cta.getByRole('link', { name: /WhatsApp us/i })
    const href = (await wa.getAttribute('href'))!
    expect(href).toMatch(/^https:\/\/wa\.me\/918302555854\?text=/)
    expect(decodeURIComponent(href.split('?text=')[1]!)).toBe('Hello Classy Unisex Salon,\n\nI would like to enquire about an appointment.\n\nThank you.')
    await expect(page.locator('main')).not.toContainText(/booking confirmed/i)
  })

  test('keyboard: every action is reachable with Tab and shows a visible focus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/reviews')
    await page.waitForLoadState('networkidle')
    const reached = new Set<string>()
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || !el.closest('main')) return null
        const s = getComputedStyle(el)
        return { text: (el.textContent ?? '').trim().slice(0, 40), outline: s.outlineStyle !== 'none' && s.outlineWidth !== '0px' }
      })
      if (info) {
        expect(info.outline, info.text).toBe(true)
        reached.add(info.text)
      }
    }
    expect([...reached].some((t) => /Google reviews/i.test(t))).toBe(true)
    expect([...reached].some((t) => /WhatsApp us/i.test(t))).toBe(true)
    expect([...reached].some((t) => /Book an appointment/i.test(t))).toBe(true)
  })

  test('visible copy makes no unsupported claims', async ({ page }) => {
    await page.goto('/reviews')
    const text = await page.locator('main').evaluate((m) => {
      const clone = m.cloneNode(true) as HTMLElement
      clone.querySelectorAll('[data-content-marker]').forEach((n) => n.remove())
      return clone.innerText
    })
    expect(text).not.toMatch(/best salon|no\.?\s?1|award|guarantee|partner|testimonial|live feed|lorem/i)
  })

  for (const width of VIEWPORTS) {
    test(`no horizontal overflow at ${width}px; rating and CTAs fit`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/reviews')
      await page.waitForLoadState('networkidle')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      for (const sel of ['[data-rating-value]', '[data-rating-count]', 'section[aria-labelledby="reviews-book-title"] h2']) {
        const box = await page.locator(sel).boundingBox()
        expect(box!.x, sel).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width, sel).toBeLessThanOrEqual(width + 1)
      }
    })
  }

  test('reduced motion: content visible and the rating line fully drawn', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/reviews')
    await page.waitForLoadState('networkidle')
    const hidden = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll<HTMLElement>('h1,h2,p,dd')).filter((el) => getComputedStyle(el).opacity === '0').length)
    expect(hidden).toBe(0)
    await page.locator('[data-rating-line]').scrollIntoViewIfNeeded()
    const transform = await page.locator('[data-rating-line] > div').evaluate((el) => (el as HTMLElement).style.transform)
    expect(transform).toBe('scaleX(1)')
  })
})
