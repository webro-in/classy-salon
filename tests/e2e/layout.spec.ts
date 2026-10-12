import { expect, test } from '@playwright/test'
import { ALL_ROUTES, VIEWPORTS } from './helpers'

test.describe('no horizontal overflow', () => {
  for (const width of VIEWPORTS) {
    test(`all routes at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const route of [...ALL_ROUTES, '/missing-page']) {
        await page.goto(route)
        const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
        expect(scroll, `${route} @ ${width}px`).toBeLessThanOrEqual(client)
      }
    })
  }
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

  test('opens, traps focus, locks scroll, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden()
    const toggle = page.getByRole('button', { name: /menu/i })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()
    const dialog = page.getByRole('dialog', { name: 'Site menu' })
    await expect(dialog).toBeVisible()
    // Must cover the whole viewport (guards against fixed-position containing-block bugs).
    expect(await dialog.boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 })
    await expect(dialog.getByRole('link', { name: /Contact/ })).toBeInViewport()
    await expect(page.getByRole('button', { name: /close/i }).first()).toHaveAttribute('aria-expanded', 'true')
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')
    expect(await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement))).toBe(true)

    // Focus stays inside the dialog while tabbing.
    for (let i = 0; i < 25; i++) await page.keyboard.press('Tab')
    expect(await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement))).toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
    await expect(toggle).toBeFocused()
  })

  test('navigates and closes on link click', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /menu/i }).click()
    await page.getByRole('dialog').getByRole('link', { name: /Our Services/ }).click()
    await expect(page).toHaveURL(/\/services$/)
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('header shows only wordmark and menu toggle on mobile (no wrapping)', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('banner').getByRole('link', { name: 'Book Now' })).toBeHidden()
    const box = await page.getByRole('link', { name: 'Classy Unisex Salon, home' }).first().boundingBox()
    expect(box!.height).toBeLessThan(48)
  })

  test('quick-action bar is visible and never contains broken links', async ({ page }) => {
    await page.goto('/')
    const bar = page.getByRole('navigation', { name: 'Quick actions' })
    await expect(bar).toBeVisible()
    const hrefs = await bar.getByRole('link').evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    expect(hrefs.length).toBe(2)
    for (const h of hrefs) expect(h).toMatch(/^(\/|https:\/\/|tel:\+918302555854$)/)
  })
})

test('desktop navigation marks the current page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/services')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Our Services' })).toHaveAttribute('aria-current', 'page')
  await expect(nav.getByRole('link', { name: 'Menu' })).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden()
})
