import { expect, test } from '@playwright/test'
import { watchConsole } from './helpers'

test.describe('About page', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('static HTML: unique SEO, canonical, Open Graph, AboutPage + BreadcrumbList JSON-LD', async ({ request }) => {
    const html = await (await request.get('/about')).text()
    expect(html).toMatch(/<title[^>]*>About Classy \| Unisex Salon in Jagatpura, Jaipur<\/title>/)
    expect(html).toMatch(/rel="canonical" href="[^"]*\/about"/)
    expect(html).toMatch(/property="og:title" content="About Classy/)
    expect(html).toMatch(/"@type":"AboutPage"/)
    expect(html).toMatch(/"@type":"BreadcrumbList"/)
    expect(html).toMatch(/<h1[^>]*>Hair, skin and makeup, in one salon in Jagatpura\.<\/h1>/)
  })

  test('heading hierarchy: one h1, chapter h2s in order, h3s nested', async ({ page }) => {
    const problems = watchConsole(page)
    await page.goto('/about')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.getByRole('main').getByRole('heading', { level: 2 })).toHaveText([
      'The salon', 'Beauty is Personal.', 'Inside the salon', 'What Defines Classy', 'Our Commitment', 'Where Your Style Meets Our Craft.',
    ])
    const levels = await page.locator('main h1, main h2, main h3').evaluateAll((els) => els.map((e) => Number(e.tagName[1])))
    for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1)
    expect(problems).toEqual([])
  })

  test('breadcrumb marks the current page', async ({ page }) => {
    await page.goto('/about')
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(crumbs.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText('About')
  })

  test('calls to action: services, booking, WhatsApp (enquiry only, pending → no link)', async ({ page }) => {
    await page.goto('/about')
    const cta = page.locator('#plan-your-visit')
    await expect(cta.getByRole('link', { name: /Explore our services/i })).toHaveAttribute('href', '/services')
    await expect(cta.getByRole('link', { name: /Book an appointment/i })).toHaveAttribute('href', '/contact#book')
    const wa = cta.locator('a[href*="wa.me"]')
    await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\/918302555854\?text=/)
    expect(decodeURIComponent((await wa.getAttribute('href'))!)).not.toMatch(/booking confirmed/i)
  })

  test('client copy shown verbatim; no invented claims; team section removed', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('[data-about-story]')).toContainText('Established in 2021, Classy Unisex Salon was created with a vision')
    await expect(page.locator('[data-about-story]')).toContainText('Professional Expertise · Personalised Service · Refined Results')
    await expect(page.locator('#experience h3')).toHaveText(['Personalised Expertise', 'Precision & Craftsmanship', 'Client-Centred Service', 'Trust & Transparency', 'Contemporary Style'])
    await expect(page.locator('#commitment')).toContainText('built on expertise, refined by experience')
    // Visible content only: drop preview-only markers and placeholder size labels (e.g. "1600×2000").
    const text = await page.locator('main').evaluate((m) => {
      const clone = m.cloneNode(true) as HTMLElement
      clone.querySelectorAll('[data-content-marker], [data-media-placeholder]').forEach((n) => n.remove())
      return clone.innerText
    })
    // The only year is the client-supplied founding year.
    expect(text.match(/\b(19|20)\d{2}\b/g)?.every((y) => y === '2021')).toBe(true)
    expect(text).not.toMatch(/\byears? of\b|award|certified|best salon|no\.?\s?1|partner|founder|owner/i)
    await expect(page.locator('#team')).toHaveCount(0)
    await expect(page.locator('main [data-content-marker]')).toHaveCount(0)
  })

  test('approach columns come from the service data and link to each group', async ({ page }) => {
    await page.goto('/about')
    const cols = page.locator('#approach ol li')
    await expect(cols.locator('h3')).toHaveText(['Hair', 'Skin', 'Makeup'])
    await expect(cols.getByRole('link')).toHaveText([/9 hair services/i, /3 skin services/i, /3 makeup services/i])
  })

  test('uses only About media slots (plus no reference imagery)', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('main [data-media-placeholder]')).toHaveCount(0) // all About photos supplied
    const srcs = await page.locator('main img').evaluateAll((els) => els.map((e) => e.getAttribute('src')))
    for (const id of ['aboutHero', 'aboutStory', 'aboutStoryDetail', 'aboutApproach', 'aboutSpace01', 'aboutSpace02', 'aboutSpace03', 'aboutCta']) {
      expect(srcs).toContain(`/media/photos/${id}.jpg`)
    }
    await expect(page.locator('main img[src*="geetanjali"]')).toHaveCount(0)
  })

  test('reduced motion: all content visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/about')
    const hidden = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll<HTMLElement>('h1,h2,h3,p,li,dd')).filter((el) => getComputedStyle(el).opacity === '0').length)
    expect(hidden).toBe(0)
  })
})
