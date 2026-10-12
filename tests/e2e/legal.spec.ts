import { expect, test } from '@playwright/test'
import { VIEWPORTS, watchConsole } from './helpers'

const PAGES = [
  { path: '/privacy', title: 'Privacy Policy | Classy Unisex Salon', h1: 'Privacy Policy', footer: 'Privacy Policy' },
  { path: '/terms', title: 'Terms & Conditions | Classy Unisex Salon', h1: 'Terms & Conditions', footer: 'Terms & Conditions' },
] as const

for (const p of PAGES) {
  test.describe(`${p.h1} page`, () => {
    test('prerendered with title, description, canonical; one h1; no console errors', async ({ page, request }) => {
      const res = await request.get(p.path)
      expect(res.status()).toBe(200)
      const html = await res.text()
      expect(html).toContain(`<title data-rh="true">${p.title.replace('&', '&amp;')}</title>`)
      expect(html).toMatch(/<meta[^>]+name="description"[^>]+content="[^"]{80,}"/)
      expect(html).toMatch(new RegExp(`<link[^>]*rel="canonical"[^>]*href="https://[^"]+${p.path}"`))
      expect(html).toMatch(/name="robots" content="index, follow"/)

      const problems = watchConsole(page)
      await page.goto(p.path)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(p.h1)
      expect(problems).toEqual([])
    })

    test('heading hierarchy and contents links', async ({ page }) => {
      await page.goto(p.path)
      const levels = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll('h1,h2,h3')).map((h) => Number(h.tagName[1])))
      expect(levels[0]).toBe(1)
      for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1)
      const toc = page.getByRole('navigation', { name: 'On this page' })
      const first = toc.getByRole('link').first()
      const target = (await first.getAttribute('href'))!
      await first.click()
      await expect(page).toHaveURL(new RegExp(`${target}$`))
      await expect(page.locator(target)).toBeInViewport()
    })

    test('footer link reaches the page', async ({ page }) => {
      await page.goto('/')
      await page.getByRole('contentinfo').getByRole('link', { name: p.footer, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${p.path}$`))
      await expect(page.locator('h1')).toHaveText(p.h1)
    })

    test('preview shows legal placeholders; no fake legal details; contact details from data', async ({ page }) => {
      await page.goto(p.path)
      await expect(page.locator('main')).toContainText('[LEGAL BUSINESS NAME REQUIRED]')
      await expect(page.locator('[data-effective-date]')).toContainText('LEGAL DETAILS REQUIRED')
      await expect(page.locator('main a[href^="mailto:Classysalonjaipur@gmail.com"]')).toHaveCount(1)
      await expect(page.locator('main a[href="tel:+918302555854"]')).toHaveCount(1)
      const text = await page.locator('main').evaluate((m) => {
        const c = m.cloneNode(true) as HTMLElement
        c.querySelectorAll('[data-content-marker]').forEach((n) => n.remove())
        return c.innerText
      })
      expect(text).not.toMatch(/\bGST|\bCIN\b|Pvt\.? Ltd|Private Limited|registered office|courts of|refund|deposit|booking confirmed|\{\{/i)
    })

    test('keyboard: skip link and contents links are reachable with visible focus', async ({ page }) => {
      await page.goto(p.path)
      await page.waitForLoadState('networkidle')
      let sawToc = false
      for (let i = 0; i < 25 && !sawToc; i++) {
        await page.keyboard.press('Tab')
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement
          const s = getComputedStyle(el)
          return { inToc: Boolean(el.closest('nav[aria-label="On this page"]')), outline: s.outlineStyle !== 'none' }
        })
        if (info.inToc) { sawToc = true; expect(info.outline).toBe(true) }
      }
      expect(sawToc).toBe(true)
    })

    for (const width of VIEWPORTS) {
      test(`no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(p.path)
        await page.waitForLoadState('networkidle')
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      })
    }
  })
}

test('terms: optional appointment policy is a marked placeholder in preview', async ({ page }) => {
  await page.goto('/terms')
  await expect(page.locator('#appointment-policy [data-content-marker="policy"]')).toContainText('CLIENT POLICY REQUIRED')
  await expect(page.locator('#governing-law [data-content-marker="legal"]')).toContainText('LEGAL DETAILS REQUIRED')
})

test('footer email never overlaps the next column on small phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/privacy')
  const overlap = await page.evaluate(() => {
    const a = document.querySelector('footer a[href^="mailto:"]')!.getBoundingClientRect()
    const visit = [...document.querySelectorAll('footer h2')].find((h) => h.textContent === 'Visit')!.parentElement!.getBoundingClientRect()
    return a.right > visit.left && a.bottom > visit.top && a.top < visit.bottom
  })
  expect(overlap).toBe(false)
})

test('reduced motion: legal content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/privacy')
  const hidden = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll<HTMLElement>('h1,h2,p,li')).filter((el) => getComputedStyle(el).opacity === '0').length)
  expect(hidden).toBe(0)
})
