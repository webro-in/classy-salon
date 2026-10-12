import { expect, test } from '@playwright/test'
import { watchConsole } from './helpers'

test.describe('Home hero', () => {
  test.use({ viewport: { width: 1440, height: 900 } })
  const track = '[data-hero-track]'

  test('static HTML contains the photo slider on slide 1 and the h1, with no per-slide text', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toMatch(/aria-roledescription="carousel"/)
    expect(html).toMatch(/<h1[^>]*>.*Classy.*Unisex Salon.*<\/h1>/s)
    expect(html).toMatch(/data-position="0"/)
    expect(html).not.toMatch(/hero-tab-|Explore Hair/)
  })

  test('semantics: one h1, four photo slides, inactive slides hidden and inert', async ({ page }) => {
    const problems = watchConsole(page)
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Classy Unisex Salon')
    const slides = page.locator('[data-hero-slide]')
    await expect(slides).toHaveCount(4)
    expect(await slides.evaluateAll((els) => els.map((e) => e.querySelector('img')?.getAttribute('src')))).toEqual(
      ['/media/photos/heroSlide01.jpg', '/media/photos/heroSlide02.jpg', '/media/photos/heroSlide03.jpg', '/media/photos/heroSlide04.jpg'],
    )
    await expect(slides.nth(1)).toHaveAttribute('aria-hidden', 'true')
    await expect(slides.nth(1)).toHaveAttribute('inert', '')
    // No dots or visible slider controls, and no "01 Hair / 02 Skin / 03 Makeup" text.
    await expect(page.getByRole('group', { name: 'Choose a photo' })).toHaveCount(0)
    await expect(page.locator('section[aria-roledescription="carousel"]')).not.toContainText(/01|Hair|Skin|Makeup/)
    expect(problems).toEqual([])
  })

  test('media covers the whole hero (fill mode regression guard)', async ({ page }) => {
    await page.goto('/')
    const hero = await page.locator('section[aria-roledescription="carousel"]').boundingBox()
    const media = await page.locator('[data-hero-slide="1"] img').boundingBox()
    expect(media!.width).toBeCloseTo(hero!.width, 0)
    expect(media!.height).toBeGreaterThanOrEqual(hero!.height - 1)
  })

  test('autoplays every ~2 s (hold) and loops forward; keyboard users can pause it', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator(track)).toHaveAttribute('data-position', '1', { timeout: 6000 })
    await expect(page.locator(track)).toHaveAttribute('data-position', '2', { timeout: 6000 })
    // The pause control is invisible until it receives keyboard focus.
    const pause = page.getByRole('button', { name: 'Pause slideshow' })
    expect(await pause.evaluate((el) => el.getBoundingClientRect().width)).toBeLessThanOrEqual(1)
    await pause.focus()
    expect(await pause.evaluate((el) => el.getBoundingClientRect().width)).toBeGreaterThan(20)
    await page.keyboard.press('Enter')
    await page.locator('body').click({ position: { x: 5, y: 5 } }) // move focus out
    const at = await page.locator(track).getAttribute('data-position')
    await page.waitForTimeout(4500)
    await expect(page.locator(track)).toHaveAttribute('data-position', at!)
  })

  test('loops from the last photo to the first by sliding forward (no rewind), every photo already loaded', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // All slide images load eagerly, so none fades in mid-slide.
    expect(await page.locator('[data-hero-track] img').evaluateAll((els) => els.every((e) => e.getAttribute('loading') === 'eager'))).toBe(true)
    await expect(page.locator(track)).toHaveAttribute('data-position', '3', { timeout: 12000 })
    await expect(page.locator(track)).toHaveAttribute('data-position', '4', { timeout: 5000 }) // the copy of photo 1
    await expect(page.locator(track)).toHaveAttribute('data-position', '0', { timeout: 3000 })
  })

  test('keeps sliding while the pointer rests on the hero', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('section[aria-roledescription="carousel"]').hover({ position: { x: 900, y: 300 } })
    await expect(page.locator(track)).not.toHaveAttribute('data-position', '0', { timeout: 5000 })
  })

  test('reduced motion: no autoplay, no pause control, text visible immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.getByRole('button', { name: /slideshow/ })).toHaveCount(0)
    expect(await page.locator('h1 span').first().evaluate((e) => getComputedStyle(e).opacity)).toBe('1')
    await page.waitForTimeout(4000)
    await expect(page.locator(track)).toHaveAttribute('data-position', '0')
  })
})

test.describe('Home chapters', () => {
  test('all 12 chapters render in the approved order', async ({ page }) => {
    await page.goto('/')
    const ids = await page.locator('main > section').evaluateAll((els) => els.map((e) => e.id || e.getAttribute('aria-roledescription')))
    expect(ids).toEqual(['carousel', 'introduction', 'services', 'hair-treatments', 'the-salon', 'makeup', 'real-work', 'brands', 'reviews', 'instagram', 'book', 'visit'])
    await expect(page.getByRole('main').getByRole('heading', { level: 2 })).toHaveCount(11)
  })
})
