import { expect, test } from '@playwright/test'
import { VIEWPORTS, watchConsole } from './helpers'

const MAPS = 'https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw'

test.describe('Contact / Visit page', () => {
  test('prerendered SEO + LocalBusiness and ContactPage JSON-LD; no console errors', async ({ page, request }) => {
    const html = await (await request.get('/contact')).text()
    expect(html).toMatch(/<title[^>]*>Contact Classy \| Unisex Salon in Jagatpura, Jaipur<\/title>/)
    expect(html).toMatch(/<link[^>]*rel="canonical"[^>]*href="https:\/\/[^"]+\/contact"/)
    expect(html).toContain('Plot no. 210, Vishwa Vidhyalaya Nagar')

    const problems = watchConsole(page)
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Contact / Visit')
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)))
    const salon = ld.find((j) => j['@type'] === 'HairSalon')
    expect(salon).toMatchObject({ telephone: '+918302555854', email: 'Classysalonjaipur@gmail.com', hasMap: MAPS })
    expect(salon.openingHoursSpecification[0]).toMatchObject({ opens: '09:30', closes: '21:30' })
    expect(ld.some((j) => j['@type'] === 'ContactPage')).toBe(true)
    expect(problems).toEqual([])
  })

  test('address, hours, phone, WhatsApp, email, Instagram and Maps come from central data', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('[data-address]')).toHaveText(/Plot no\. 210, Vishwa Vidhyalaya Nagar\s*Jagatpura\s*Jaipur, Rajasthan 302017/)
    await expect(page.locator('[data-hours]')).toContainText('Every day')
    await expect(page.locator('[data-hours]')).toContainText('9:30 AM – 9:30 PM')
    await expect(page.locator('[data-open-status]')).toContainText(/(Open now|Closed now)/)

    const rows = page.locator('[data-contact-rows]')
    await expect(rows.getByRole('link', { name: '+91 83025 55854', exact: true })).toHaveAttribute('href', 'tel:+918302555854')
    await expect(rows.getByRole('link', { name: /on WhatsApp/ })).toHaveAttribute('href', /^https:\/\/wa\.me\/918302555854\?text=/)
    await expect(rows.getByRole('link', { name: 'Classysalonjaipur@gmail.com' })).toHaveAttribute('href', /^mailto:Classysalonjaipur@gmail\.com/)
    await expect(rows.getByRole('link', { name: /@classysalonjaipur/ })).toHaveAttribute('href', 'https://www.instagram.com/classysalonjaipur/')
    await expect(rows.getByRole('link', { name: /@classy_salonjaipur/ })).toHaveAttribute('href', 'https://www.instagram.com/classy_salonjaipur/')
    await expect(rows).toContainText('1500+ Google reviews')

    await expect(page.getByRole('link', { name: /Call now/ }).first()).toHaveAttribute('href', 'tel:+918302555854')
    for (const name of [/Get directions/, /Open in Google Maps/]) {
      const link = page.getByRole('link', { name }).first()
      await expect(link).toHaveAttribute('href', MAPS)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
    await expect(page.locator('main [data-content-marker="data"]')).toHaveCount(0) // no contact data pending
  })

  test('copy address works', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-copy-address]').click()
    await expect(page.locator('[data-copy-address]')).toHaveText('Address copied')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('Classy Unisex Salon, Plot no. 210, Vishwa Vidhyalaya Nagar, Jagatpura, Jaipur, Rajasthan 302017')
  })

  test('map loads only on request', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => requests.push(r.url()))
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    expect(requests.some((u) => /google\.com\/maps|maps\.google/.test(u))).toBe(false)
    const map = page.locator('[data-map]')
    await expect(map.locator('iframe')).toHaveCount(0)
    await map.getByRole('button', { name: 'Show map' }).click()
    await expect(map.locator('iframe')).toHaveAttribute('title', /Map: Classy Unisex Salon/)
    await expect(map.locator('iframe')).toHaveAttribute('src', /maps\.google\.com\/maps\?q=Classy%20Unisex%20Salon.*output=embed/)
  })

  test('enquiry form: validation, service list, WhatsApp handoff, no confirmation language', async ({ page, context }) => {
    await page.goto('/contact#book')
    await page.waitForLoadState('networkidle')
    const form = page.locator('#book form')
    await form.getByRole('button', { name: /Send enquiry on WhatsApp/ }).click()
    await expect(form.locator('[data-field-error]')).toHaveCount(4)
    await expect(form.getByLabel(/^Name/)).toBeFocused()
    await expect(form.getByLabel(/^Name/)).toHaveAttribute('aria-invalid', 'true')

    const options = await form.locator('select[name="service"] option').allTextContents()
    expect(options.slice(1)).toEqual([
      'Keratin Treatment', 'Hair Botox Treatment', 'Anti Dandruff Treatment', 'Hair Glossing', 'Hair Repair Treatment', 'Textured Hair Artistry', 'Kérastase Hair Rituals', 'Hair Scalp Treatments', 'Signature Hair Services',
      'Beauty Essentials', 'Skin – Hands & Feet Spa', 'Radiant Skin Solutions', 'Bridal Makeup', 'HD Makeup', 'Airbrush Makeup',
    ])

    await form.getByLabel(/^Name/).fill('Asha')
    await form.getByLabel(/^Service/).selectOption('HD Makeup')
    const d = new Date(Date.now() + 2 * 864e5)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    await form.getByLabel(/^Preferred date/).fill(iso)
    await form.getByLabel(/^Preferred time/).fill('07:00')
    await form.getByRole('button', { name: /Send enquiry on WhatsApp/ }).click()
    await expect(form.locator('[data-field-error="time"]')).toContainText('between 9:30 AM and 9:30 PM')
    await form.getByLabel(/^Preferred time/).fill('16:30')

    await context.route('https://wa.me/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<title>wa</title>' }))
    const popupPromise = context.waitForEvent('page')
    await form.getByRole('button', { name: /Send enquiry on WhatsApp/ }).click()
    const popup = await popupPromise
    await popup.waitForLoadState()
    const url = popup.url()
    await popup.close()
    const decoded = decodeURIComponent(url.split('text=')[1] ?? '')
    expect(url).toMatch(/^https:\/\/wa\.me\/918302555854\?text=/)
    expect(decoded).toContain('Service: HD Makeup')
    expect(decoded).toContain('Name: Asha')
    expect(decoded).toContain('Preferred Time: 16:30')
    await expect(form.getByRole('status')).toContainText('WhatsApp opened')
    await expect(page.locator('main')).not.toContainText(/booking confirmed|appointment (is )?confirmed|online booking/i)
  })

  test('FAQ: no fabricated content; preview shows only the pending marker', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('[data-faq]')).toHaveCount(0)
    await expect(page.locator('[data-faq-pending] [data-content-marker="faq"]')).toHaveCount(3)
    const text = await page.locator('main').evaluate((m) => {
      const clone = m.cloneNode(true) as HTMLElement
      clone.querySelectorAll('[data-content-marker]').forEach((n) => n.remove())
      return clone.innerText
    })
    expect(text).not.toMatch(/cancell|refund|walk-?in|payment|₹|price|award|certified|best salon|partner/i)
  })

  test('final chapter routes back to Services, Gallery and Reviews', async ({ page }) => {
    await page.goto('/contact')
    const cta = page.locator('section[aria-labelledby="explore-title"]')
    await expect(cta.getByRole('link')).toHaveCount(3)
    for (const [name, href] of [['Our Services', '/services'], ['Gallery', '/gallery'], ['Reviews', '/reviews']] as const) {
      await expect(cta.getByRole('link', { name: new RegExp(name) })).toHaveAttribute('href', href)
    }
  })

  test('footer legal links exist; mobile menu and quick actions work', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    const page = await ctx.newPage()
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    await expect(footer.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
    const bar = page.getByRole('navigation', { name: 'Quick actions' })
    await expect(bar).toBeVisible()
    await expect(bar.getByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:+918302555854')
    await page.getByRole('button', { name: /Menu/ }).click()
    await expect(page.getByRole('dialog').getByRole('link', { name: 'Gallery' })).toBeVisible()
    await ctx.close()
  })

  for (const width of VIEWPORTS) {
    test(`no horizontal overflow at ${width}px; address, form and actions fit`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      for (const sel of ['[data-address]', '[data-contact-rows]', '[data-enquiry-form]', '[data-map]']) {
        const box = await page.locator(sel).boundingBox()
        expect(box!.x, sel).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width, sel).toBeLessThanOrEqual(width + 1)
      }
    })
  }

  test('reduced motion: everything visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    const hidden = await page.locator('main').evaluate((m) => Array.from(m.querySelectorAll<HTMLElement>('h1,h2,h3,address,dd,label')).filter((el) => getComputedStyle(el).opacity === '0').length)
    expect(hidden).toBe(0)
  })

  test('failed media falls back gracefully (map preview image)', async ({ page }) => {
    await page.route('**/media/photos/aboutHero*.jpg', (r) => r.abort())
    const problems = watchConsole(page)
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-map]').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-map] [data-media-placeholder="contactVisit"]')).toBeAttached()
    await expect(page.locator('[data-map]').getByRole('button', { name: 'Show map' })).toBeVisible()
    expect(problems.filter((p) => !/Failed to load resource|ERR_FAILED/.test(p))).toEqual([])
  })
})
