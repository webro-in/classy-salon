import { expect, test } from '@playwright/test'
import { PUBLIC_ROUTES, watchConsole } from './helpers'

test.describe('static prerendered build', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} is served as finished HTML with SEO and no console errors`, async ({ page, request }) => {
      // 1. The raw HTML (before any JS) already contains the page.
      const raw = await request.get(route)
      expect(raw.status()).toBe(200)
      const html = await raw.text()
      expect(html).toMatch(/<h1[\s>]/)
      expect(html).toMatch(/<title[^>]*>[^<]*Classy[^<]*<\/title>/)
      expect(html).toMatch(/rel="canonical"/)
      expect(html).toMatch(/name="description"/)

      // 2. Hydrated page: no errors, warnings or hydration mismatches.
      const problems = watchConsole(page)
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      const mains = await page.locator('main').count()
      // Regression guard: the app must hydrate into the static HTML exactly once (see src/main.tsx).
      expect({ mains, problems }).toEqual({ mains: 1, problems: [] })
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toBeVisible()
      expect(problems).toEqual([])
    })
  }

  test('every page has a unique title and meta description', async ({ request }) => {
    const titles = new Set<string>()
    const descriptions = new Set<string>()
    for (const route of PUBLIC_ROUTES) {
      const html = await (await request.get(route)).text()
      titles.add(html.match(/<title[^>]*>([^<]+)<\/title>/)![1]!)
      descriptions.add(html.match(/name="description" content="([^"]+)"/)![1]!)
    }
    expect(titles.size).toBe(PUBLIC_ROUTES.length)
    expect(descriptions.size).toBe(PUBLIC_ROUTES.length)
  })

  test('unknown URLs return the custom 404 page with HTTP 404', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    await expect(page.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/')
  })

  test('trailing slashes redirect to the canonical URL', async ({ request }) => {
    const res = await request.get('/about/', { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(res.headers().location).toBe('/about')
  })

  test('favicon, manifest, share image, sitemap and robots resolve', async ({ request, page }) => {
    await page.goto('/')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toMatch(/\/icons\/og-default\.jpg$/)
    for (const path of ['/icons/favicon.svg', '/icons/favicon-32.png', '/icons/apple-touch-icon.png', '/site.webmanifest', '/icons/og-default.jpg', '/sitemap.xml', '/robots.txt']) {
      expect((await request.get(path)).status(), path).toBe(200)
    }
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).not.toContain('/styleguide')
    expect((sitemap.match(/<url>/g) ?? []).length).toBe(PUBLIC_ROUTES.length)
  })

  test('home includes HairSalon JSON-LD with verified fields only', async ({ page }) => {
    await page.goto('/')
    const json = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? '{}')
    expect(json['@type']).toBe('HairSalon')
    expect(json.address.postalCode).toBe('302017')
    expect(json.aggregateRating).toEqual({ '@type': 'AggregateRating', ratingValue: 4.8, reviewCount: 1500 })
    expect(json.telephone).toBe('+918302555854')
    expect(json.openingHoursSpecification[0]).toMatchObject({ opens: '09:30', closes: '21:30' })
    expect(json.email).toBe('Classysalonjaipur@gmail.com')
    expect(json.hasMap).toBe('https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw')
  })

  test('content is readable with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/services')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Our Services' })).toHaveAttribute('href', '/services')
    await context.close()
  })
})
