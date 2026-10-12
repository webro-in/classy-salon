import { expect, test } from '@playwright/test'
import { watchConsole } from './helpers'

test.describe('Home sections', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('services preview: three group rows linking to /services anchors, no prices', async ({ page }) => {
    await page.goto('/')
    const rows = page.locator('#services ol > li a')
    await expect(rows).toHaveCount(3)
    expect(await rows.evaluateAll((els) => els.map((e) => e.getAttribute('href')))).toEqual(['/services#hair', '/services#skin', '/services#makeup'])
    await expect(page.locator('main')).not.toContainText(/₹|Rs\.?\s?\d|price/i)
  })

  test('hair treatments rail: only sheet names, keyboard focusable, buttons scroll it', async ({ page }) => {
    await page.goto('/')
    const rail = page.getByRole('region', { name: /Hair treatments, scroll horizontally/ })
    // Anti Dandruff Treatment is left out of the Home rail at the client's request (still on Our Services).
    await expect(rail.locator('li h3')).toHaveText(['Keratin Treatment', 'Hair Botox Treatment', 'Hair Glossing', 'Hair Repair Treatment', 'Textured Hair Artistry', 'Kérastase Hair Rituals', 'Hair Scalp Treatments', 'Signature Hair Services'])
    await rail.scrollIntoViewIfNeeded()
    await expect(page.getByRole('button', { name: 'Previous treatments' }).first()).toBeDisabled()

    await page.getByRole('button', { name: 'Next treatments' }).first().click()
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100)
    await expect(page.getByRole('button', { name: 'Previous treatments' }).first()).toBeEnabled()

    // Keyboard: focus the region and scroll with the arrow keys.
    await rail.evaluate((el) => (el.scrollLeft = 0))
    await rail.focus()
    await expect(rail).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
  })

  test('rail never causes page overflow on mobile and supports touch scrolling', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
    const page = await ctx.newPage()
    await page.goto('/')
    const rail = page.getByRole('region', { name: /Hair treatments/ })
    expect(await rail.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    await ctx.close()
  })

  test('brands: the nine client-selected brands, logos where supplied, no partnership wording', async ({ page }) => {
    await page.goto('/')
    const brands = page.locator('#brands')
    const cells = brands.locator('ul').first().locator('li')
    await expect(cells).toHaveCount(9)
    const names = await cells.evaluateAll((els) => els.map((li) => li.querySelector('img')?.getAttribute('alt') ?? li.querySelector('[data-logo-placeholder] > span')?.textContent?.trim()))
    // Client-supplied logo files for all nine brands.
    await expect(brands.locator('[data-logo-placeholder]')).toHaveCount(0)
    await expect(brands.locator('img')).toHaveCount(9)
    expect(names).toEqual(['Kérastase', "L'Oréal Professionnel", 'Kanpeki', 'Redken', 'Olaplex', 'K18', 'Wella', 'Shea Butter', 'Brillare Professional'])
    await expect(brands).not.toContainText(/Guinot|Thalgo|Dyson/)
    await expect(page.locator('main')).not.toContainText(/partner|official|verified brand/i)
  })

  test('reviews and rating: verified 4.8 · 1500+, genuine client-supplied quotes only, figures count up', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#reviews blockquote').first()).toContainText('I have done my haircut services with classy salon')
    await expect(page.locator('#reviews')).toContainText('Swetha Suthar')
    await expect(page.locator('#reviews')).toContainText('4.8')
    await expect(page.locator('#reviews')).toContainText('1500+')
    const count = page.locator('#introduction [data-count-up="1500+"]')
    await expect(count).toHaveCount(1)
    await count.scrollIntoViewIfNeeded()
    await expect(count.locator('[aria-hidden="true"]')).toHaveText('1500+', { timeout: 5000 })
    await expect(page.locator('#introduction [data-count-up="4.8"] [aria-hidden="true"]')).toHaveText('4.8', { timeout: 5000 })
    await expect(page.getByRole('link', { name: /Read Google reviews/ })).toHaveAttribute('href', 'https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw')
  })

  test('instagram: both client-supplied accounts, no fake feed', async ({ page }) => {
    await page.goto('/')
    const ig = page.locator('#instagram')
    await expect(ig.locator('a[href="https://www.instagram.com/classysalonjaipur/"]').first()).toBeVisible()
    await expect(ig.locator('a[href="https://www.instagram.com/classy_salonjaipur/"]').first()).toBeVisible()
    await expect(ig.locator('a[href*="instagram.com/p/"]')).toHaveCount(0)
  })

  test('booking: frontend-only WhatsApp enquiry to the verified number', async ({ page }) => {
    const problems = watchConsole(page)
    await page.goto('/')
    const form = page.locator('#book form')
    await expect(form.getByLabel('Name')).toBeVisible()
    await expect(form.getByLabel('Service')).toBeVisible()
    await expect(form.getByLabel('Preferred date')).toHaveAttribute('type', 'date')
    await expect(form.getByLabel('Preferred time')).toHaveAttribute('type', 'time')
    await expect(form.getByRole('option')).toHaveCount(16) // 15 sheet services + placeholder option
    await expect(form.getByRole('button', { name: /Send enquiry on WhatsApp/ })).toBeEnabled()
    await expect(form).toContainText('not a confirmed booking')
    await expect(page.locator('#book')).not.toContainText(/booking confirmed/i)
    expect(problems).toEqual([])
  })

  test('visit: verified address, map loads only on request', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => requests.push(r.url()))
    await page.goto('/')
    const visit = page.locator('#visit')
    await expect(visit.locator('address')).toContainText('Plot no. 210, Vishwa Vidhyalaya Nagar')
    await expect(visit.locator('address')).toContainText('302017')
    expect(requests.some((u) => u.includes('maps.google.com'))).toBe(false)
    await expect(visit.locator('iframe')).toHaveCount(0)
    await visit.getByRole('button', { name: /Show map/ }).click()
    await expect(visit.locator('iframe[title*="Map"]')).toHaveAttribute('src', /maps\.google\.com\/maps\?q=.*output=embed/)
    await expect(visit.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:+918302555854')
    await expect(visit.locator('a[href^="mailto:"]')).toHaveAttribute('href', /^mailto:Classysalonjaipur@gmail\.com/)
    await expect(visit).toContainText('Every day')
    await expect(visit).toContainText('9:30 AM – 9:30 PM')
  })

  test('footer: five columns, services anchors, legal links', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('heading', { level: 2 })).toHaveText(['Explore', 'Services', 'Contact', 'Visit', 'Follow'])
    await expect(footer.getByRole('link', { name: 'Skin' })).toHaveAttribute('href', '/services#skin')
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
  })

  test('unrevealed sections stay in the accessibility tree (no visibility: hidden)', async ({ page }) => {
    await page.goto('/')
    // Without scrolling, every chapter heading must still be exposed to assistive tech.
    await expect(page.getByRole('main').getByRole('heading', { level: 2 })).toHaveCount(11)
    const hidden = await page.locator('main [style*="visibility"]').evaluateAll((els) => els.filter((e) => getComputedStyle(e).visibility === 'hidden').length)
    expect(hidden).toBe(0)
  })

  test('reduced motion: all section content visible without scrolling animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const hidden = await page.locator('main section').evaluateAll((sections) =>
      sections.flatMap((s) => Array.from(s.querySelectorAll<HTMLElement>('h2, h3, p, li')).filter((el) => getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden').map((el) => el.textContent?.slice(0, 40))),
    )
    expect(hidden).toEqual([])
  })

  test('scroll reveals play as sections enter (motion allowed) and leave content visible', async ({ page }) => {
    await page.goto('/')
    for (const id of ['introduction', 'services', 'brands', 'visit']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1300)
      const opacity = await page.locator(`#${id} h2`).first().evaluate((el) => getComputedStyle(el.closest('[class]')!).opacity)
      expect(Number(opacity), id).toBe(1)
    }
  })
})
