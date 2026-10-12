import { expect, test } from '@playwright/test'
import { watchConsole } from './helpers'

// Separate file: launch flags require their own browser worker.
test.use({ viewport: { width: 1440, height: 900 }, launchOptions: { args: ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] } })

test('WebGL unavailable: falls back to static media without errors', async ({ page }) => {
  const problems = watchConsole(page)
  await page.goto('/styleguide')
  await page.waitForLoadState('networkidle')
  const holder = page.locator('[data-3d]')
  await expect(holder).toHaveAttribute('data-3d', 'off')
  await expect(holder.locator('img[src="/media/photos/heroSlideSkin.jpg"]')).toBeAttached()
  await expect(holder.locator('canvas')).toHaveCount(0)
  expect(problems).toEqual([])
})
