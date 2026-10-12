import { expect, test } from '@playwright/test'
import { watchConsole } from './helpers'

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('reveals leave content visible and 3D stays off', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/styleguide')
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
    await page.getByRole('heading', { name: 'Motion & 3D' }).scrollIntoViewIfNeeded()
    const opacities = await page.locator('text=/^Reveal 0/').evaluateAll((els) => els.map((e) => getComputedStyle(e.parentElement!).opacity))
    expect(opacities).toEqual(['1', '1', '1'])
    await expect(page.locator('[data-3d]')).toHaveAttribute('data-3d', 'off')
  })
})

test.describe('WebGL available', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('loads the lazy 3D scene only on capable desktops', async ({ page }) => {
    const problems = watchConsole(page)
    await page.goto('/styleguide')
    const supported = await page.evaluate(() => Boolean(document.createElement('canvas').getContext('webgl2')))
    test.skip(!supported, 'Headless browser has no WebGL2')
    await expect(page.locator('[data-3d="on"] canvas')).toBeAttached({ timeout: 15_000 })
    // GPU-less CI renderers may log driver performance notices; only real errors fail.
    expect(problems.filter((p) => !/GPU stall|software WebGL|swiftshader|ReadPixels/i.test(p))).toEqual([])
  })

  test('mobile never downloads the 3D chunk', async ({ page }) => {
    const requested: string[] = []
    page.on('request', (r) => requested.push(r.url()))
    // Scene chunks follow the *.scene naming convention (never preloaded).
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/styleguide')
    await page.waitForLoadState('networkidle')
    expect(requested.filter((u) => /\.scene-/.test(u))).toEqual([])
  })
})
