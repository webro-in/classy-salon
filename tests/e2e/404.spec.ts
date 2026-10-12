import { expect, test } from '@playwright/test'
import { VIEWPORTS } from './helpers'

test.describe('custom 404', () => {
  for (const url of ['/404', '/this-page-does-not-exist', '/services/nope', '/gallery/x/y']) {
    test(`${url} returns the custom 404 with HTTP 404 (no redirect to Home)`, async ({ page }) => {
      const res = await page.goto(url)
      expect(res!.status()).toBe(404)
      expect(new URL(page.url()).pathname).toBe(url)
      await expect(page).toHaveTitle('Page Not Found | Classy Unisex Salon')
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText('Page not found')
      await expect(page.locator('main')).toContainText('The page you’re looking for isn’t here.')
    })
  }

  test('noindex, real prerendered HTML, not in the navigation or sitemap', async ({ page, request }) => {
    const res = await request.get('/missing-page')
    const html = await res.text()
    expect(html).toMatch(/name="robots" content="noindex/)
    expect(html).toContain('data-404-numeral')
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).not.toMatch(/404/)
    await page.goto('/')
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /404|not found/i })).toHaveCount(0)
  })

  test('buttons lead back into the site', async ({ page }) => {
    for (const [name, path, h1] of [['Back home', '/', null], ['Our Services', '/services', 'Our Services'], ['Contact', '/contact', 'Contact / Visit']] as const) {
      await page.goto('/nowhere')
      await page.waitForLoadState('networkidle')
      await page.getByRole('navigation', { name: 'Back into the site' }).getByRole('link', { name }).click()
      await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/$' : `${path}$`}`))
      if (h1) await expect(page.locator('h1')).toHaveText(h1)
    }
  })

  test('only the expected document 404 appears in the console', async ({ page }) => {
    const problems: string[] = []
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(m.text()) })
    page.on('pageerror', (e) => problems.push(e.message))
    await page.goto('/unknown')
    await page.waitForLoadState('networkidle')
    expect(problems.filter((p) => !/status of 404/.test(p))).toEqual([])
  })

  test('keyboard reaches the three actions', async ({ page }) => {
    await page.goto('/unknown')
    await page.waitForLoadState('networkidle')
    const seen: string[] = []
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      const t = await page.evaluate(() => (document.activeElement?.closest('nav[aria-label="Back into the site"]') ? document.activeElement.textContent?.trim() : null))
      if (t && !seen.includes(t)) seen.push(t)
    }
    expect(seen).toEqual(['Back home', 'Our Services', 'Contact'])
  })

  for (const width of VIEWPORTS) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/unknown')
      await page.waitForLoadState('networkidle')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    })
  }

  test('reduced motion: everything visible immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/unknown')
    const anim = await page.locator('main .hero-rise').first().evaluate((el) => getComputedStyle(el).animationName)
    expect(anim).toBe('none')
  })
})
