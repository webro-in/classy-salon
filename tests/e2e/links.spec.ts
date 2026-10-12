import { expect, test } from '@playwright/test'
import { ALL_ROUTES } from './helpers'

test('no broken internal links, and every external link is safe', async ({ page, request }) => {
  const internal = new Set<string>()
  for (const route of ALL_ROUTES) {
    await page.goto(route)
    const links = await page.locator('a').evaluateAll((els) =>
      els.map((a) => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel') })),
    )
    for (const l of links) {
      expect(l.href, `empty/placeholder href on ${route}`).toBeTruthy()
      expect(l.href).not.toBe('#')
      if (l.href!.startsWith('/')) internal.add(l.href!.split('#')[0]!)
      if (/^https?:/.test(l.href!)) {
        expect(l.target, l.href!).toBe('_blank')
        expect(l.rel, l.href!).toContain('noopener')
      }
    }
  }
  for (const href of internal) {
    expect((await request.get(href)).status(), href).toBe(200)
  }
})

test('contact actions use verified data and pending data never renders a link', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByRole('link', { name: /get directions/i }).first()).toHaveAttribute('href', 'https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw')
  await expect(page.getByRole('link', { name: /instagram/i }).first()).toHaveAttribute('href', 'https://www.instagram.com/classysalonjaipur/')
  // Phone, WhatsApp and email are client-supplied.
  for (const href of await page.locator('a[href^="tel:"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')))) expect(href).toBe('tel:+918302555854')
  for (const href of await page.locator('a[href*="wa.me"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')))) expect(href).toMatch(/^https:\/\/wa\.me\/918302555854\?text=/)
  await expect(page.locator('a[href*="wa.me"]').first()).toBeAttached()
  for (const href of await page.locator('a[href^="mailto:"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')))) expect(href).toMatch(/^mailto:Classysalonjaipur@gmail\.com/)
  await expect(page.locator('[data-content-marker="data"]')).toHaveCount(0) // no contact data is pending any more
})
