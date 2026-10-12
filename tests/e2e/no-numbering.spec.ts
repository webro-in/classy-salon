import { expect, test } from '@playwright/test'

/** Client request (2026-10-03): no decorative "01, 02, 03…" numbering anywhere on the site. */
const PAGES = ['/', '/about', '/services', '/gallery', '/reviews', '/contact', '/privacy', '/terms']

for (const path of PAGES) {
  test(`no 01/02/03-style numbering on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const text = await page.locator('body').evaluate((b) => {
      const clone = b.cloneNode(true) as HTMLElement
      clone.querySelectorAll('[data-content-marker], [data-media-placeholder], script, style').forEach((n) => n.remove())
      return clone.innerText
    })
    expect(text).not.toMatch(/(^|\s)0[1-9](\s|$|\s?[·—/])/m)
  })
}
