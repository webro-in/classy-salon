# ARCHITECTURE — Where Everything Lives

## 1. Data flow
```
content/*.json ──► src/data/*.ts (zod-validated, typed) ──► sections/* ──► pages/* ──► app/routes.tsx
                                ▲
              src/lib/links.ts · src/lib/analytics.ts · src/lib/content.ts
```
Components never import JSON or asset paths directly.

## 2. Build flow (static site)
```
npm run build
  └─ content:check ─► vite-react-ssg build
                        ├─ client build → dist/assets/*
                        ├─ SSR build (temp) → render each route in Node
                        └─ write dist/<route>/index.html + dist/404.html
  └─ verify-dist (fails if any route HTML is missing or empty)
  └─ sitemap.ts → dist/sitemap.xml
Browser: static HTML shown immediately → client JS hydrates → client-side navigation
```
Details and the fallback strategy: DRD §3.

## 3. "Where is…?"
| Change | File |
|---|---|
| Phone, WhatsApp, email, hours, address, **rating** | `content/business.json` |
| Services, order, labels, confirmations | `content/services.json` |
| Brands / logos | `content/brands.json` + `public/media/brands/` |
| Reviews quotes | `content/reviews.json` |
| Gallery | `content/gallery.json` + `public/media/gallery/` |
| Any image/video slot | `src/data/media.ts` + `public/media/...` |
| WhatsApp message template, link builders | `src/lib/links.ts` |
| Page meta, OG, JSON-LD | `src/config/seo.ts` |
| Navigation | `src/data/navigation.ts` |
| Colours, type, spacing | `src/styles/tokens.css` |
| Animation timings | `src/config/motion.ts` |
| Routes / prerendered paths | `src/app/routes.tsx` (+ `ssgOptions` in `vite.config.ts`) |
| Hero (carousel, slides, state) | `src/sections/hero/Hero.tsx`, `heroSlides.ts`, `useCarousel.ts` |
| Home chapter order & tones | `src/pages/Home/index.tsx` (one component per chapter) |
| Home section components | `src/sections/{hero,intro-trust,services-preview,hair-treatments,salon,makeup,work,brands,reviews,instagram,booking,visit}/` |
| Home UI copy (headings, intros) | `src/data/home.ts` |
| Chapter heading pattern | `src/components/sections/ChapterHeader.tsx` |
| Scroll media reveal / parallax | `src/components/motion/MediaReveal.tsx` |
| WhatsApp enquiry form | `src/components/forms/EnquiryForm.tsx` |
| Inner-page hero + breadcrumbs | `src/components/sections/PageHero.tsx`, `src/components/navigation/Breadcrumbs.tsx` |
| About sections / copy | `src/sections/about/`, `src/data/about.ts` |
| About client content / people | `content/about.json`, `content/team.json` |
| Build modes / release rules | `scripts/build.ts`, `scripts/content-rules.ts`, `scripts/forbidden.ts` |
| Service accordion | `src/components/accordion/` + `src/pages/Services/` |
| Brand section | `src/sections/brands/` |
| Gallery + lightbox | `src/components/gallery/` |
| 3D | `src/components/three/` (gate `canRender3D.ts`) |
| Mobile menu / action bar | `src/components/navigation/` |
| Legal copy | `content/legal/*.md` |

## 4. Layer ownership
| Layer | Owns | Must not |
|---|---|---|
| `content/` | Facts, copy | Markup, styling |
| `src/data/` | Validation, typing, display-label logic | Render UI |
| `src/lib/` | Pure helpers | Touch the DOM at import time |
| `components/` | Reusable UI | Know business facts |
| `sections/` | Compose data + components | Define routes |
| `pages/` | Order sections, set SEO | Hold layout logic |

## 5. Navigation
`data/navigation.ts` → `Header` (desktop links ≥ 1024 px; mobile toggle below) → `MobileMenu` (scroll lock, focus trap, ESC, closes on route change, focus return). `aria-current="page"` on the active link. The mobile action bar and desktop WhatsApp bar live in `RootLayout`.

## 6. Booking
`EnquiryForm` (name, service from `services.ts`, date, time) → `getWhatsAppUrl()` → `wa.me/<number>?text=…` (editable message) in a new tab → `trackWhatsAppClick()`. Feedback: "Opening WhatsApp. The salon will reply to confirm your appointment." Never "confirmed". No WhatsApp number → falls back to Call. No phone either → section omitted.

## 7. 3D
`Hero` always renders media. `HeroScene` is lazy-loaded inside `<ClientOnly>` when `canRender3D()` returns true, wrapped in an error boundary that keeps the poster. It is never part of the SSR render. Delete `components/three/` + one import to remove it.

## 8. Extending
New service → `services.json`. New media → file + slot `src`. New page → page folder + `routes.tsx` + `navigation.ts` + `seo.ts` (and it is prerendered automatically).

## 9. Our Services page (Phase 4)

```
content/services.json ──► src/data/services.ts (serviceGroups, displayLabel, groupMedia, servicesPageCopy)
                                   │
src/pages/Services/index.tsx ──────┤
  ├─ ServiceHero / ServiceIntro    (PageHero, verified trust facts)
  ├─ ServiceCategoryNav            (sticky under header; desktop 01/02/03, mobile chip rail; scroll-based active state)
  ├─ ServiceCategory ×3            (#hair #skin #makeup, scroll-mt for the sticky bars; sticky arched photo crossfades to the row in focus)
  │    └─ ServiceRow               (number · name · description · ServiceWhatsApp · Details disclosure → highlights + ServiceMedia)
  ├─ ServicesBrands                (brand wall from content/brands.json)
  └─ ServicesCta                   (dark WhatsApp chapter)
src/lib/links.ts → buildServiceEnquiryMessage / getServiceWhatsAppUrl (enquiry only)
src/config/seo.ts → routeSeo.services + buildServicesPageJsonLd (WebPage + OfferCatalog, no prices)
```

Service names never appear in JSX: everything renders from `content/services.json`. Adding a service = add an item there (+ optional `service.<id>` photo in `src/data/media.ts`).

## 10. Gallery (Phase 5)

```
content/gallery.json ──► src/data/gallery.ts (galleryItems, galleryCategories [populated only], itemsFor, galleryPageCopy)
content/consent.json ──► src/data/consent.ts (peopleInMedia) ──► scripts/content-rules.ts §6 (release blocker)
src/pages/Gallery/index.tsx
  ├─ GalleryHero      (PageHero + counts + Instagram/WhatsApp)
  ├─ GalleryGrid      (state: filter + open index; ?view= deep link read after hydration)
  │    ├─ GalleryFilters  (sticky toggle buttons, aria-pressed)
  │    ├─ GalleryItem ×n  (tile button, natural ratio, lazy grid image)
  │    └─ Lightbox        (src/components/gallery: portal, aria-modal dialog, focus trap, Esc, ←/→, swipe, preload)
  └─ GalleryCta
src/styles/base.css .gallery-grid → row-major CSS-grid masonry (container-query row unit; landscape tiles span 2 columns at ≥1024 px)
src/config/seo.ts → buildGalleryPageJsonLd (CollectionPage + ImageObject/VideoObject list)
```

## 11. Reviews (Phase 6)

```
content/business.json → rating ──► src/data/business.ts (googleRating: value, display, count, countLabel, checkedOn)
content/reviews.json ───────────► src/data/reviews.ts (reviews, featuredReviews, listReviews, googleReviewsUrl, reviewsPageCopy)
src/pages/Reviews/index.tsx
  ├─ ReviewsHero        (PageHero + Google link + WhatsApp)
  ├─ RatingSummary      (numeral + "out of 5" + count + proportional hairline; no star row)
  ├─ ReviewHighlights   (featured pull-quotes; dev-only pending layout when empty; nothing in production)
  ├─ ReviewList         (two editorial columns, "Show more" after 8; ReviewItem = figure/blockquote/figcaption/cite)
  ├─ GoogleReviewsCta   (static link to the listing, no scraped/embedded feed)
  └─ ReviewsCta         (Book an appointment + WhatsApp us → buildGeneralEnquiryMessage)
scripts/content-rules.ts §7 → review release gate (reviewProblem)
src/config/seo.ts → buildReviewsPageJsonLd (WebPage only; aggregate rating stays on the salon entity; no Review markup)
```
Adding a review: append to `content/reviews.json → reviews` with the exact text, the name as shown, optional rating/source/date only if the source shows them, and `approval`. `featured: true` puts it in Highlights (max 3; first two by default).

## 12. Contact / Visit (Phase 7)

```
content/business.json ─► src/data/business.ts (addressLines, addressSingleLine, hoursRows, openStatus, hoursOn, googleRating)
                       └► src/lib/links.ts (getPhoneUrl, getWhatsAppUrl/buildEnquiryMessage, getEmailUrl, getMapsUrl, getInstagramUrl)
src/pages/Contact/index.tsx
  ├─ ContactHero      (PageHero + Call now / WhatsApp us)
  ├─ ContactDetails   (large copyable address + Get directions · hours + live open status · contact rows · rating)
  ├─ ContactMap       (photo preview → click-to-load embed; "Open in Google Maps" = client link)
  ├─ ContactEnquiry   (#book; EnquiryForm requireAll: inline accessible errors, hours-bounded time, WhatsApp handoff)
  ├─ ContactFaq       (FaqRow accordion; client content only; dev-only placeholders)
  └─ ContactCta       (links back to Services / Gallery / Reviews)
src/config/seo.ts → buildContactPageJsonLd + buildLocalBusinessJsonLd
```
`EnquiryForm` stays optional-field on Home (`requireAll` is off by default).

## 13. Legal pages and 404 (Phase 8)

```
content/legal.json + business.json → legalName ─► src/data/legal.ts (privacyPolicy, termsAndConditions, missingLegalFacts)
src/pages/Privacy, src/pages/Terms ─► src/sections/legal/LegalPage (header + "On this page" + numbered article)
                                      └─ LegalText: fills {{tradingName}} {{legalName}} {{address}} {{email}} {{phone}} {{whatsapp}} from data
src/pages/NotFound ─► prerendered from /404 → moved to dist/404.html (src/app/prerender.ts); noindex; copy in src/data/notFound.ts
scripts/content-rules.ts §10 → legal release gate + analytics/privacy consistency check
```
Pending legal facts render as `ContentMarker` kinds `legalName` / `legal` / `policy` (preview only). Optional pending sections (appointment policy) are filtered out when markers are off. Legal links live in the footer (`legalNav`) only.
