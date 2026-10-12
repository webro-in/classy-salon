import { expect, test } from '@playwright/test'
import { VIEWPORTS, watchConsole } from './helpers'

const HAIR = ['Keratin Treatment', 'Hair Botox Treatment', 'Anti Dandruff Treatment', 'Hair Glossing', 'Hair Repair Treatment', 'Textured Hair Artistry', 'Kérastase Hair Rituals', 'Hair Scalp Treatments', 'Signature Hair Services']
const SKIN = ['Beauty Essentials', 'Skin – Hands & Feet Spa', 'Radiant Skin Solutions']
const MAKEUP = ['Bridal Makeup', 'HD Makeup', 'Airbrush Makeup']

test.describe('Our Services page', () => {
  test('prerendered with title, canonical, OG and structured data; no console errors', async ({ page, request }) => {
    const html = await (await request.get('/services')).text()
    expect(html).toMatch(/<title[^>]*>Our Services \| Classy Unisex Salon in Jagatpura, Jaipur<\/title>/)
    expect(html).toMatch(/<link[^>]*rel="canonical"[^>]*href="https:\/\/[^"]+\/services"/)
    expect(html).toMatch(/property="og:title" content="Our Services/)
    expect(html).toMatch(/property="og:image" content="https:\/\/[^"]+\/icons\/og-services\.jpg"/)
    expect(html).toContain('Keratin Treatment') // service names are in the static HTML

    const problems = watchConsole(page)
    await page.goto('/services')
    await page.waitForLoadState('networkidle')
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)))
    const pageLd = ld.find((j) => j['@type'] === 'WebPage')
    expect(pageLd.mainEntity['@type']).toBe('OfferCatalog')
    const names = pageLd.mainEntity.itemListElement.flatMap((g: { itemListElement: Array<{ itemOffered: { name: string } }> }) => g.itemListElement.map((o) => o.itemOffered.name))
    expect(names).toHaveLength(15)
    expect(JSON.stringify(pageLd)).not.toMatch(/price/i)
    expect(ld.some((j) => j['@type'] === 'BreadcrumbList')).toBe(true)
    expect(problems).toEqual([])
  })

  test('hero, three groups and all 15 services render with exact names', async ({ page }) => {
    await page.goto('/services')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Our Services')
    await expect(page.locator('section[id="hair"] h2, section[id="skin"] h2, section[id="makeup"] h2')).toHaveText(['Hair', 'Skin', 'Makeup'])
    await expect(page.locator('#hair [data-service-name]')).toHaveText(HAIR)
    await expect(page.locator('#skin [data-service-name]')).toHaveText(SKIN)
    await expect(page.locator('#makeup [data-service-name]')).toHaveText(MAKEUP)
    await expect(page.locator('[data-service-row]')).toHaveCount(15)
  })

  test('every service has a WhatsApp enquiry with its name, encoded correctly, enquiry only', async ({ page }) => {
    await page.goto('/services')
    const links = page.locator('[data-service-row] a[href*="wa.me"]')
    await expect(links).toHaveCount(15)
    for (const [i, name] of [...HAIR, ...SKIN, ...MAKEUP].entries()) {
      const href = (await links.nth(i).getAttribute('href'))!
      expect(href).toMatch(/^https:\/\/wa\.me\/918302555854\?text=/)
      const text = decodeURIComponent(href.split('?text=')[1]!)
      expect(text).toBe(`Hello Classy Unisex Salon,\n\nI would like to enquire about:\n\nService: ${name}\n\nName:\nPreferred Date:\nPreferred Time:\n\nThank you.`)
      await expect(links.nth(i)).toHaveAttribute('target', '_blank')
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/)
    }
    await expect(page.locator('main')).not.toContainText(/booking confirmed/i)
  })

  test('no prices, memberships or fake reviews', async ({ page }) => {
    await page.goto('/services')
    const text = await page.locator('main').innerText()
    expect(text).not.toMatch(/₹|\bRs\.?\s?\d|\bINR\b|price|pricing|\bmembership/i)
    expect(text).not.toMatch(/testimonial|best salon|no\.?\s?1|guarantee/i)
    await expect(page.locator('main blockquote')).toHaveCount(0)
    await expect(page.locator('main')).not.toContainText(/Guinot|Thalgo|Dyson|partner/i)
    // Only the verified Google figures appear.
    await expect(page.locator('main')).toContainText('4.8')
    await expect(page.locator('main')).toContainText('1500+')
  })

  for (const id of ['hair', 'skin', 'makeup'] as const) {
    test(`/services#${id} lands on the category below the sticky header and category nav`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`/services#${id}`)
      await page.waitForLoadState('networkidle')
      await expect.poll(async () => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeGreaterThanOrEqual(0)
      const { top, navBottom } = await page.evaluate((sid) => ({
        top: document.getElementById(sid)!.querySelector('h2')!.getBoundingClientRect().top,
        navBottom: document.querySelector('[data-category-nav]')!.getBoundingClientRect().bottom,
      }), id)
      expect(top).toBeGreaterThanOrEqual(navBottom) // heading not hidden under sticky bars
      expect(top).toBeLessThan(900)
      await expect(page.locator(`[data-category-nav] a[href="#${id}"]`)).toHaveAttribute('aria-current', 'true')
    })
  }

  test('category nav links jump to each group', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/services')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-category-nav] a[href="#makeup"]').click()
    await expect(page).toHaveURL(/#makeup$/)
    await expect(page.locator('[data-category-nav] a[href="#makeup"]')).toHaveAttribute('aria-current', 'true')
  })

  test('details disclosure is keyboard operable', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/services')
    await page.waitForLoadState('networkidle')
    const toggle = page.getByRole('button', { name: 'Show details: Keratin Treatment' })
    await toggle.focus()
    await page.keyboard.press('Enter')
    const open = page.getByRole('button', { name: 'Hide details: Keratin Treatment' })
    await expect(open).toHaveAttribute('aria-expanded', 'true')
    const panel = page.locator(`[id="${await open.getAttribute('aria-controls')}"]`)
    await expect(panel).toContainText('Calms frizz and flyaways')
    await expect(panel).not.toHaveAttribute('inert', /.*/)
  })

  for (const width of VIEWPORTS) {
    test(`no horizontal page overflow at ${width}px (mobile chip rail scrolls inside itself)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/services')
      await page.waitForLoadState('networkidle')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      const rail = page.locator('[data-chip-rail]')
      const box = await rail.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1)
      await expect(rail.locator('a')).toHaveCount(3)
    })
  }

  test('reduced motion: all content visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/services')
    const hidden = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll<HTMLElement>('h1,h2,h3,[data-service-row] p')).filter((el) => getComputedStyle(el).opacity === '0').length)
    expect(hidden).toBe(0)
  })

  test('uses real Classy photos only (no reference-site imagery)', async ({ page }) => {
    await page.goto('/services')
    const srcs = await page.locator('main img').evaluateAll((els) => els.map((e) => e.getAttribute('src') ?? ''))
    expect(srcs.length).toBeGreaterThan(5)
    for (const s of srcs) expect(s).toMatch(/^\/(media|logo)\//)
    expect(srcs.join()).not.toMatch(/geetanjali|klickpin|pinterest/i)
  })
})

test('brand wall: nine client-supplied logos, no placeholders, no partner wording', async ({ page }) => {
  await page.goto('/services')
  const wall = page.locator('section[aria-labelledby="services-brands-title"]')
  expect(await wall.locator('img').evaluateAll((els) => els.map((e) => e.getAttribute('alt')))).toEqual(['Kérastase', "L'Oréal Professionnel", 'Kanpeki', 'Redken', 'Olaplex', 'K18', 'Wella', 'Shea Butter', 'Brillare Professional'])
  await expect(wall.locator('[data-logo-placeholder]')).toHaveCount(0)
  await expect(wall).not.toContainText(/Guinot|Thalgo|Dyson|partner/i)
})
