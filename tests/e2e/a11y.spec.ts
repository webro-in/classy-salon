import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { ALL_ROUTES } from './helpers'

for (const width of [390, 1440]) {
  test.describe(`axe @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } })
    for (const route of [...ALL_ROUTES, '/missing-page']) {
      test(`${route}`, async ({ page }) => {
        await page.goto(route)
        await page.waitForLoadState('networkidle')
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze()
        const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)
        expect(summary).toEqual([])
      })
    }
  })
}

test('skip link moves focus to main content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/about')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})
