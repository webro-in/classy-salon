# QA CHECKLIST

Run before each release. Mark ✅ / ❌ / n/a with the date.

## A. 17 core checks
- [ ] 1. No horizontal scroll (automated at 390/430/768/1024/1280/1440/1920)
- [ ] 2. Meta description on every route
- [ ] 3. Favicon set (svg, ico, apple-touch, manifest icons)
- [ ] 4. Unique, correct page titles
- [ ] 5. Images optimised (AVIF/WebP, srcset, sizes, no originals served)
- [ ] 6. Email is a `mailto:` link
- [ ] 7. No broken internal or external links (link checker)
- [ ] 8. Mobile menu works (open, close, ESC, focus, scroll lock, route change)
- [ ] 9. No unintended placeholder text in production (`content:check` passes)
- [ ] 10. Tested on real mobile devices (iOS Safari, Android Chrome)
- [ ] 11. Empty states: empty gallery categories hidden, missing reviews handled
- [ ] 12. Mobile optimised (LCP, tap targets, font sizes ≥ 16 px inputs)
- [ ] 13. No mobile overflow from long words, service names or tables
- [ ] 14. Useful error messages (form validation, media failure)
- [ ] 15. Useful success states (WhatsApp hand-off, copy-to-clipboard)
- [ ] 16. Custom 404 served with a 404 status
- [ ] 17. Phone is a `tel:` link

## B. Content integrity
- [ ] Every service traces to CONTENT-MAP
- [ ] No prices, testimonials, awards, founder or year unless supplied
- [ ] No "best", "No. 1", "official partner", "certified"
- [ ] No Geetanjali / Style N Scissors / Amber text or images
- [ ] All 9 brand logos + Wella, Shea Butter, Brillare Professional shown; no "partner/official" wording, no badges
- [ ] Shea Butter not presented as part of any other brand
- [ ] Competitor sentence absent; no replacement claim
- [ ] No named people (incl. Anjani Thakur) unless approved
- [ ] Rating is `verified` with the client-supplied production value (not a candidate figure); `checkedOn` updated
- [ ] Every ⚑ service label confirmed (or kept as source wording, per client)
- [ ] No Blog / Posts / Updates feed
- [ ] No placeholder media in production (`content:check --strict`)
- [ ] Booking copy never says "confirmed"

## B2. Static generation
- [ ] `dist/` contains index.html for all 8 routes + 404.html
- [ ] `verify-dist` passes (title, description, canonical, h1, body text per file)
- [ ] View-source of each route shows real content and meta (not an empty root div)
- [ ] Unknown URL returns HTTP 404 with the custom page (no SPA fallback, no redirect to Home); `/404` shows it too
- [ ] 404 page is `noindex` and absent from sitemap and navigation
- [ ] No hydration warnings in the console

## B3. Legal pages
- [ ] `/privacy` and `/terms` reachable from the footer on every page ("Privacy Policy", "Terms & Conditions")
- [ ] Client/adviser has reviewed the draft wording (it is not legal advice)
- [ ] Legal business name, effective date and governing law supplied (`content:check --strict` passes)
- [ ] Appointment policy supplied or knowingly omitted
- [ ] Privacy Policy still matches the site (no analytics/cookies added without updating it)
- [ ] No `[LEGAL … REQUIRED]` / `[CLIENT POLICY REQUIRED]` text in the production HTML (verify-dist strict)

## C. Accessibility
- [ ] axe: 0 violations on every route
- [ ] One `h1` per page, no skipped heading levels
- [ ] Skip link works
- [ ] Visible focus on every interactive element
- [ ] Accordion: `aria-expanded`, `aria-controls`, keyboard Enter/Space
- [ ] Lightbox: focus trap, ESC, arrow keys, focus return, `aria-modal`
- [ ] Contrast AA for all token pairs, including text on media scrims
- [ ] Alt text meaningful, decorative media `alt=""`
- [ ] Touch targets ≥ 44×44
- [ ] Reduced motion: no parallax, no 3D, video paused

## D. Resilience
- [ ] WebGL disabled → poster shown, no errors
- [ ] Image 404 → placeholder surface
- [ ] Video fails / blocked autoplay → poster
- [ ] JS disabled → prerendered content readable, links work
- [ ] Slow 3G → hero poster visible < 3 s, no layout shift

## E. Browsers
- [ ] Chrome, Safari (macOS), Firefox, Edge: latest
- [ ] iOS Safari 16+ (safe-area insets, 100dvh, video autoplay)
- [ ] Android Chrome

## F. SEO
- [ ] Canonical on every route
- [ ] OG + Twitter tags; share preview tested (WhatsApp, Facebook debugger)
- [ ] JSON-LD `HairSalon` validates (Rich Results Test), only verified fields
- [ ] sitemap.xml + robots.txt
- [ ] Descriptive link text (no bare "click here")

## G. Performance
- [ ] Lighthouse mobile Perf ≥ 90 / A11y ≥ 95 / BP ≥ 95 / SEO 100
- [ ] LCP ≤ 2.0 s, CLS ≤ 0.05, INP ≤ 150 ms
- [ ] Initial JS ≤ 120 KB gz (excl. lazy 3D)
- [ ] Fonts preloaded, `font-display: swap`, ≤ 2 files
- [ ] Video payload within budget; not loaded on mobile/saveData
- [ ] 3D chunk ≤ 180 KB gz, pauses offscreen

## H. Code health
- [ ] `npm run typecheck`: 0 errors
- [ ] `npm run lint`: 0 errors, 0 warnings
- [ ] `npm test` + `npm run e2e` pass
- [ ] No console errors, React warnings or debug logs in production
- [ ] No unused dependencies (`knip`), no dead code
- [ ] No hard-coded contact data outside `content/`
- [ ] `npm run build && npm run preview` clean
