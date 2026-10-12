import { expect, test } from '@playwright/test'
import { VIEWPORTS, watchConsole } from './helpers'

test.describe('Gallery page', () => {
  test('prerendered with SEO, CollectionPage JSON-LD and every item in the static HTML', async ({ page, request }) => {
    const html = await (await request.get('/gallery')).text()
    expect(html).toMatch(/<title[^>]*>Gallery \| Classy Unisex Salon in Jagatpura, Jaipur<\/title>/)
    expect(html).toMatch(/property="og:image" content="https:\/\/[^"]+\/icons\/og-gallery\.jpg"/)
    expect((html.match(/data-gallery-item=/g) ?? []).length).toBe(43)

    const problems = watchConsole(page)
    await page.goto('/gallery')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Classy Edit')
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)))
    const col = ld.find((j) => j['@type'] === 'CollectionPage')
    expect(col.mainEntity.numberOfItems).toBe(43)
    expect(col.mainEntity.itemListElement.filter((e: { item: { '@type': string } }) => e.item['@type'] === 'VideoObject')).toHaveLength(1)
    expect(ld.some((j) => j['@type'] === 'BreadcrumbList')).toBe(true)
    expect(problems.filter((p) => !/Failed to load resource|MEDIA_ERR|NotSupported/.test(p))).toEqual([])
  })

  test('bridal photos sit together as one block at the start of the grid', async ({ page }) => {
    await page.goto('/gallery')
    const ids = await page.locator('#gallery-grid [data-gallery-item]').evaluateAll((els) => els.map((e) => e.getAttribute('data-gallery-item') ?? ''))
    const bridal = ids.map((id, i) => [id, i] as const).filter(([id]) => /bride|bridal/.test(id)).map(([, i]) => i)
    expect(bridal.length).toBe(13)
    expect(bridal).toEqual(bridal.map((_, k) => k)) // one block at the start, no gaps
    for (const gone of ['work-makeup-kit', 'look-mens-style', 'work-bride-portrait', 'work-bride-closeup', 'work-bride-lehenga', 'work-nail-colours']) expect(ids).not.toContain(gone)
  })

  test('The Classy Edit: client copy, four editorial sections, hover captions, no developer notes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/gallery')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main')).toContainText('Where beauty, craftsmanship and individuality come together.')
    await expect(page.locator('main')).toContainText('Explore our latest work, transformations and salon moments')
    await expect(page.locator('#gallery-grid-title')).toHaveText('A visual showcase of our artistry, atmosphere & transformations.')
    await expect(page.locator('[data-gallery-count]')).toHaveText(/43 featured moments/i)
    await expect(page.locator('[data-gallery-section] h3')).toHaveText(['Bridal Beauty', 'Hair Artistry', 'Beauty & Transformation', 'Inside Classy'])
    await expect(page.locator('main [data-content-marker]')).toHaveCount(0)
    await expect(page.locator('main')).not.toContainText(/Everything|\bitems\b/)
    const tile = page.locator('[data-gallery-item="work-bride-full"]')
    await expect(tile).toHaveAttribute('data-location', 'Classy Unisex Salon')
    await expect(tile.locator('[data-gallery-caption]')).toContainText('Bridal Beauty')
    await expect(page.locator('[data-gallery-item="look-bridal-red"]')).not.toHaveAttribute('data-location', /.+/)
    // Editorial masonry: some tiles span two columns, one spans the full row.
    expect(await page.locator('.gallery-grid > li[data-wide]').count()).toBeGreaterThanOrEqual(3)
    await expect(page.locator('.gallery-grid > li[data-full]')).toHaveCount(1)
    const cta = page.locator('section[aria-labelledby="gallery-cta-title"]')
    await expect(cta.getByRole('heading', { level: 2 })).toHaveText('Ready for your Classy experience?')
    await expect(cta.getByRole('link', { name: /Book now/i })).toHaveAttribute('href', '/contact#book')
    await expect(cta.getByRole('link', { name: /Explore our services/i })).toHaveAttribute('href', '/services')
  })

  test('filters: only populated categories, aria-pressed, counts, deep link', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/gallery')
    await page.waitForLoadState('networkidle')
    const group = page.getByRole('group', { name: 'Filter the gallery' })
    await expect(group.getByRole('button')).toHaveText([/All\s*43/, /Our Work\s*8/, /The Space\s*14/, /Looks\s*20/, /Videos\s*1/])
    await expect(group.getByRole('button', { name: /Before/ })).toHaveCount(0)
    await expect(group.getByRole('button', { name: /All/ })).toHaveAttribute('aria-pressed', 'true')

    await group.getByRole('button', { name: /Videos/ }).click()
    await expect(group.getByRole('button', { name: /Videos/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#gallery-grid [data-gallery-item]')).toHaveCount(1)
    await expect(page).toHaveURL(/\?view=videos$/)
    for (const label of await page.locator('#gallery-grid [data-gallery-item]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')))) {
      expect(label).toMatch(/^Play video: /)
    }

    await page.goto('/gallery?view=space')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('#gallery-grid [data-gallery-item]')).toHaveCount(14)
    await expect(group.getByRole('button', { name: /The Space/ })).toHaveAttribute('aria-pressed', 'true')
  })

  test('viewer: opens as a modal, keyboard navigation wraps, Escape closes and returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/gallery')
    await page.waitForLoadState('networkidle')
    const tile = page.locator('[data-gallery-item]').first()
    await tile.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Gallery viewer' })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused()
    await expect(dialog.locator('[aria-live]')).toHaveText('1 of 43')
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')

    await page.keyboard.press('ArrowLeft')
    await expect(dialog.locator('[aria-live]')).toHaveText('43 of 43') // wraps
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(dialog.locator('[aria-live]')).toHaveText('2 of 43')
    await expect(dialog.locator('figcaption')).toContainText('Bridal Beauty')

    // Focus stays inside the dialog.
    for (let i = 0; i < 6; i++) await page.keyboard.press('Tab')
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[data-lightbox]')))).toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(tile).toBeFocused()
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  })

  test('viewer: buttons and swipe navigate; videos open with controls', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
    const page = await ctx.newPage()
    await page.goto('/gallery?view=videos')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-gallery-item]').first().click()
    const dialog = page.getByRole('dialog', { name: 'Gallery viewer' })
    await expect(dialog.locator('video')).toHaveAttribute('controls', '')
    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toHaveCount(0)

    await page.goto('/gallery?view=work')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-gallery-item]').first().click()
    await dialog.getByRole('button', { name: 'Next' }).click()
    await expect(dialog.locator('[aria-live]')).toHaveText('2 of 8')
    // Swipe left → next
    await dialog.dispatchEvent('touchstart', { touches: [{ identifier: 1, clientX: 300, clientY: 400 }], changedTouches: [{ identifier: 1, clientX: 300, clientY: 400 }] })
    await dialog.dispatchEvent('touchend', { touches: [], changedTouches: [{ identifier: 1, clientX: 120, clientY: 410 }] })
    await expect(dialog.locator('[aria-live]')).toHaveText('3 of 8')
    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toHaveCount(0)
    await ctx.close()
  })

  test('real Classy media only; no partner, price or invented-review wording', async ({ page }) => {
    await page.goto('/gallery')
    const srcs = await page.locator('main img').evaluateAll((els) => els.map((e) => e.getAttribute('src') ?? ''))
    for (const s of srcs) expect(s).toMatch(/^\/(media|logo)\//)
    expect(srcs.join()).not.toMatch(/geetanjali|klickpin|pinterest/i)
    // Visible content only (preview markers removed).
    const text = await page.locator('main').evaluate((m) => {
      const clone = m.cloneNode(true) as HTMLElement
      clone.querySelectorAll('[data-content-marker]').forEach((n) => n.remove())
      return clone.innerText
    })
    expect(text).not.toMatch(/partner|price|₹|testimonial|best salon|before & after/i)
  })

  for (const width of VIEWPORTS) {
    test(`no horizontal overflow at ${width}px; filter rail stays inside the viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/gallery')
      await page.waitForLoadState('networkidle')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      const box = await page.locator('[data-gallery-filters] [data-chip-rail]').boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
    })
  }

  test('reduced motion: tiles and headings visible without animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/gallery')
    await page.waitForLoadState('networkidle')
    const hidden = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll<HTMLElement>('h1,h2,[data-gallery-item]')).filter((el) => getComputedStyle(el).opacity === '0').length)
    expect(hidden).toBe(0)
  })
})
