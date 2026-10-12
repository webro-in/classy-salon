# CHANGELOG

## [0.10.0] — 2026-10-02 — Client update: hero slider, story, services copy, reviews, new photos, brand logos

### Added
- Home hero is now a full-bleed **photo slider**: four photos (salon · model · salon · model), each holds 2 s then slides horizontally; seamless forward loop; dots + pause control; pauses only for keyboard focus; no autoplay with reduced motion. The "01 Hair / 02 Skin / 03 Makeup" text was removed from the hero and from the Home introduction.
- `CountUp` (`src/components/motion/CountUp.tsx`): Google rating and review count count up from zero when scrolled into view (Home intro, Home reviews, Our Services stats, Reviews page). Static HTML and reduced motion show the final figures; screen readers read only the final value.
- Client copy (verbatim): salon story (`business.story`), established 2021 (`business.established`, also `foundingDate` in JSON-LD), Home introduction, About philosophy ("Beauty is Personal."), approach, "What Defines Classy" (5 principles), commitment and tagline (`content/about.json`). New About chapter "Our Commitment".
- Four genuine Google reviews supplied by the client (two featured), shown with ★ rating, "Google Review" and the relative age as Google shows it (`dateLabel`).
- Brand logos: the client's logo sheet cut into one transparent PNG per brand (`public/media/brands/`).
- Gallery category **Looks** for client-selected licensed stock (Pexels), captioned neutrally; schema allows `license` only under Looks. Gallery now 48 items.
- `scripts/media/process-oct-update.py` (repeatable crops for every new image).

### Changed
- Service names confirmed by the client: Textured Hair Artistry, Kérastase Hair Rituals, Signature Hair Services; Skin – Hands & Feet Spa shown as written. New client descriptions for these, all Skin and all Makeup services, and the Makeup introduction.
- New images: Hair (staff hair wash), Skin, Makeup group photos; Hair Botox, Hair Glossing, Textured Hair; Bridal/HD/Airbrush (service rows and Home makeup cards); About closing image; salon strip image 1; Instagram tiles 1, 3, 6.
- Home Hair Treatments rail no longer shows Anti Dandruff Treatment (still listed on Our Services).
- About: optional team section removed; story shows the full multi-paragraph text with the client's signature line.

### Removed (client request, site-wide)
- The blow-dry "soft waves" photo and video, beard grooming photo and video, the emblem-in-marble-niche photo and video, the round-brush video, and the makeup-studio-with-ring-lights photo (gallery and every page where the same picture appeared).

## [0.9.0] — 2026-10-02 — Phase 8: Privacy Policy, Terms & Conditions, custom 404

### Added
- Privacy Policy and Terms & Conditions (`src/data/legal.ts`, shared `LegalPage` + `LegalText`): written only from what the site does; contact details filled from central data; legal facts as preview-only markers ([LEGAL BUSINESS NAME REQUIRED], [LEGAL DETAILS REQUIRED], [CLIENT POLICY REQUIRED]). Draft for client/legal review, not legal advice.
- `content/legal.json` (effectiveDate, governingLaw, optional appointmentPolicy) + `legalSchema`.
- Release gate: legal effective date and governing law required (legal name already was); enabling analytics without updating the Privacy Policy blocks release.
- New custom 404 (large numerals, arch image, Back home / Our Services / Contact; noindex; CSS-only entrance motion).
- Tests: `tests/unit/legal.test.tsx`, `tests/e2e/legal.spec.ts`, `tests/e2e/404.spec.ts`.

### Changed
- Titles: "Privacy Policy | Classy Unisex Salon", "Terms & Conditions | Classy Unisex Salon", "Page Not Found | Classy Unisex Salon"; new descriptions.
- Footer link label "Terms" → "Terms & Conditions".
- Preview server serves `/404` with status 404.
- `ContentMarker` detail text is optional; new kinds `legal`, `legalName`, `policy`.

### Fixed
- Footer: the (now supplied) email address overflowed into the next column on phones; it wraps now (shared footer, all pages).

## [0.8.0] — 2026-10-02 — Phase 7: Contact / Visit + client contact details

### Added
- Contact / Visit page: hero (Call now, WhatsApp us), editorial address (copy address, Get directions), opening hours with live open/closed status (salon time), contact rows (phone, WhatsApp, email, both Instagram accounts, rating), click-to-load map with a real photo preview, appointment enquiry (#book) with full validation and WhatsApp handoff, FAQ accordion (client content only), links back to Services / Gallery / Reviews.
- `openStatus`, `hoursOn`, `addressSingleLine`; `validateEnquiry`; `EnquiryForm requireAll`; `FaqRow`; `buildContactPageJsonLd`; `contactVisit` media slot; tone-aware form error colour (`text-error-on-tone`, AA on every tone).
- FAQ release rule: supplied FAQ items with placeholder text block release (empty FAQ stays optional/hidden).
- Tests: `tests/unit/contact.test.tsx`, `tests/unit/faq.test.tsx`, `tests/e2e/contact.spec.ts`.

### Changed
- Client-supplied: email `Classysalonjaipur@gmail.com`, Maps link `https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw`, second Instagram account `@classy_salonjaipur` (verified). These feed every page, the footer, SEO and all links from `content/business.json`.
- Enquiry form status copy no longer says "reply to confirm" (now "reply about availability"); date minimum uses the visitor's local date.

### Fixed
- `<Media>`: an image whose request failed before hydration stayed invisible instead of showing the placeholder (onError missed). Confirmed on mount with a probe.

## [0.7.0] — 2026-10-02 — Phase 6: Reviews

### Added
- Reviews page: PageHero ("Reviews"), RatingSummary (large 4.8 numeral, "out of 5", 1500+ Google reviews, proportional hairline that draws in once; last-checked date), ReviewHighlights (featured pull-quotes), ReviewList (editorial two-column list, show more), GoogleReviewsCta, ReviewsCta (Book an appointment · WhatsApp us).
- Review data model (`reviewSchema`: verbatim quote, author, optional rating/source/date, required `approval`), `googleRating` helper (single source: business.json), `buildGeneralEnquiryMessage` / `getGeneralWhatsAppUrl`, `buildReviewsPageJsonLd`, ContentMarker kind `reviews` ("CLIENT REVIEWS REQUIRED").
- Release gate: no approved reviews, placeholder text, fake/generic names, reference-site content, duplicates or future dates fail `npm run build:production`.
- Tests: `tests/unit/reviews.test.tsx`, `tests/e2e/reviews.spec.ts`.

### Changed
- `content/reviews.json`: `quotes` → `reviews` (new schema; still empty). Home reviews chapter reads the new fields (no visual change).
- `Button`: optional `ariaExpanded` / `ariaControls` for disclosure buttons (no visual change).

## [0.6.0] — 2026-10-01 — Phase 5: Gallery

### Added
- Gallery page: hero with the featured bridal image and counts, sticky filters (All · Work · The Space · Videos, populated categories only; `?view=` deep links), row-major editorial masonry grid (natural ratios, landscape tiles double-width on desktop), full-screen viewer (modal dialog, focus trap and return, Esc, arrow keys, swipe, wrap-around, neighbour preload, videos with controls), Instagram/WhatsApp closing chapter.
- 29 photos + 6 short videos from the client's folders (`public/media/gallery`), `content/gallery.json` entries with alt text, ratio and `people` flag.
- Consent gate: `content/consent.json` (`peopleInMedia`, pending) + release rule blocking production while identifiable people appear without confirmed consent; `people` flag on media slots.
- `buildGalleryPageJsonLd` (CollectionPage), gallery title/description, `og-gallery.jpg`; analytics events `gallery_filter`, `gallery_open`.
- Tests: `tests/unit/gallery.test.ts`, `tests/e2e/gallery.spec.ts`.

### Changed
- `beforeAfter01–03` slots are optional (the category is hidden until supplied), so they no longer block release.
- Gallery video badge uses a solid background (axe colour-contrast).

### Fixed
- QA scripts used `tsc -p .`, which checks nothing in this project-references setup; `npm run typecheck` (`tsc -b`) is the real check and is now used.

## [0.5.1] — 2026-10-01 — Phase 4 content-integrity correction

### Removed
- The six brand logos vector-traced from a reference-site image (Kérastase, L'Oréal Professionnel, Kanpeki, Redken, Olaplex, K18). `public/media/brands/` is now empty.

### Changed
- All nine brands render as clearly marked logo placeholders (`BrandLogo`: name in type + "Logo placeholder" tag in preview) on Home and Our Services, until the client supplies official/approved files. Layout and data structure unchanged.
- Tests: no brand logo files / no brand `src` until supplied; nine placeholder cells on Home and Services; no partner wording.

## [0.5.0] — 2026-10-01 — Phase 4: Our Services + client updates

### Added
- Our Services page: hero ("Our Services"), intro statement with verified trust facts, sticky category nav (desktop 01/02/03, mobile chip rail), Hair / Skin / Makeup editorial numbered rows (name, description, "Enquire on WhatsApp", Details disclosure with highlights + photo), brand wall, dark WhatsApp CTA. Files: `src/sections/services/*`, `src/pages/Services/index.tsx`.
- Service-specific WhatsApp enquiry (`buildServiceEnquiryMessage`, exact Phase 4 format); `buildServicesPageJsonLd`; services title "Our Services | Classy Unisex Salon in Jagatpura, Jaipur"; `og-services.jpg`.
- `highlights` field on service items (draft); `hoursRows` / `hoursSummary` / `formatTime` helpers.
- Real Classy media in 60+ slots (photos, two videos, logo sign); real logo (emblem + plaque); favicons and share images generated from the logo (`scripts/generate-icons.ts`, replaces the placeholder-icon script).
- Tests: `tests/unit/services.test.tsx`, `tests/e2e/services.spec.ts`.

### Changed
- Client-verified data: WhatsApp/phone +91 83025 55854, hours every day 09:30–21:30, Google rating 4.8 · 1500+.
- Brands: six green-dot brands + Wella, Shea Butter, Brillare Professional (Guinot, Thalgo, Dyson removed). (Six traced logos were added here and removed in 0.5.1.)
- White-first theme: ivory → white, lighter cream/taupe/lines (token values only; architecture unchanged).
- Header lockup: emblem + serif "CLASSY / Unisex Salon"; footer adds the emblem and the official plaque.

### Fixed
- `<Media>`: an image that finished loading before hydration stayed at opacity 0 (onLoad missed). Checked on mount now. Affected every page once real photos existed.
- Home hero legibility on bright photos (stronger scrims; mobile tint). Home brands: logos rendered tiny inside placeholder boxes.

## [0.4.0] — 2026-10-01 — Phase 3: About page

### Added
- About page (`src/pages/About`): PageHero → 01 Story (client story + verified salon facts) → 02 Approach (client philosophy pull-quote + Hair/Skin/Makeup columns from services data) → 03 The space → 04 What to expect (4 points, each citing an approved data source) → optional Team (only approved people) → closing CTA (Explore our services · Book an appointment · WhatsApp).
- Reusable `PageHero` and `Breadcrumbs` (visible trail + BreadcrumbList JSON-LD) for all inner pages; `AboutPage` JSON-LD; new About title/description.
- Content: `content/about.json` (philosophy, pending; blocks release), `content/team.json` (schema requires `approved: true` and `consent: true`), `src/data/about.ts` (central About copy, `status: 'draft'`), `src/data/team.ts`.
- Media: replaced generic `aboutChapter01–03` with `aboutStory`, `aboutStoryDetail`, `aboutApproach`, `aboutSpace01–03`, `aboutCta` (+ `team.<id>` generated per approved person).
- Tests: `tests/e2e/about.spec.ts`, `tests/unit/about.test.ts`; site-wide unique title/description test.

### Fixed
- Hero: if the pointer rested on the hero before hydration, rotation never paused (no mouseenter after hydrate). Now detected via `:hover` on mount. Found through a flaky e2e run.

## [0.3.0] — 2026-10-01 — Phase 2: Home page complete

### Added
- Home chapters 2–12 replacing the scaffolds, in the approved order and tone cadence: Introduction + Trust, Our Services (hover/focus image preview), Hair Treatments rail, The Salon, Bridal & Makeup, Real Work, Products & Brands, Reviews, Instagram, Book an Appointment, Visit Us. Redesigned global footer (5 columns, oversized wordmark).
- Shared: `ChapterHeader`, `MediaReveal` (clip reveal, eased inner scale, optional desktop parallax), `EnquiryForm` (frontend-only WhatsApp), `useRail` (snap, buttons, progress, mouse drag), `src/data/home.ts` (centralised factual UI copy, draft).
- `<Media aspect>` presentation crop; placeholders label "shown X (slot Y)".
- Click-to-load Google map (no third-party request until asked).
- E2E: `home-sections.spec.ts` (services links, rail keyboard/buttons/touch, brands, no invented reviews, Instagram, enquiry form, map, footer, reduced motion, accessibility-tree check).

### Fixed
- **Reveal used GSAP `autoAlpha`** (visibility: hidden): unrevealed sections were removed from the accessibility tree, so screen readers could not reach them by heading. Now opacity-only; regression test added.
- `window.open(..., 'noopener')` returns null by spec: the enquiry form would have opened WhatsApp twice. Opener is now cleared manually.
- Brand cells: dev marker overlapped names on mobile; 3-column grid at all sizes, single marker below.
- Decorative 5 stars removed from the rating display (would imply 5/5 for any value).
- Composition fixes found in browser QA: Salon/Real Work grids, Visit column stretch, footer wordmark descender, Instagram tile ratios, intro arch size on tablet.

### Removed
- `ChapterScaffold` and `pages/Home/chapters.ts` (all chapters built).

## [0.2.0] — 2026-10-01 — Phase 2: content validation modes + Home foundation & hero

### Added
- **Build modes:** `npm run dev` (no checks), `npm run build` (preview: placeholders allowed, never fails on missing client data), `npm run build:production` (release gate). Orchestrated by `scripts/build.ts` (cross-platform).
- Release rules as a pure, unit-tested function (`scripts/content-rules.ts`): pending business/contact data, fake-looking contacts, unconfirmed service names, missing descriptions, required placeholder media and logos, reference/competitor wording and partnership claims in `content/`, missing production domain. Second check in verify-dist rejects markers, placeholders and scaffolds in production HTML.
- `required` flag on every media slot (optional: per-service images, hero video, text-brand logos).
- Home page foundation: chapter registry (`src/pages/Home/chapters.ts`) with the 12 chapters in approved order and tone cadence; `ChapterScaffold` for chapters 2–12 (preview only).
- Home hero (`src/sections/hero/`): full-bleed three-slide carousel (Hair/Skin/Makeup) from services data, WAI-ARIA tabbed carousel, arrow/Home/End keys, inert inactive slides, autoplay 6 s with progress line, pause control, pause on hover/focus, no autoplay under reduced motion, CSS-only entrance (no JS flash), slow crossfade + Ken Burns.
- Tests: release-rule unit tests (incl. "complete data passes"), hero and chapter e2e.

### Fixed
- `<Media fit="fill">` collapsed to 32 px (combined `relative` + `absolute`): real hero photos would have been invisible. Regression tests added.
- Brass accent on taupe failed AA (4.1:1): new `--color-brass-deep` (#6E5130, 4.8:1) for the taupe tone; contrast tests now cover accent on every tone.
- Horizontal rails are now focusable, labelled regions (keyboard scrolling).

### Deferred
- Hero 3D depth layer → Phase 11 decision (bundle over budget).

## [0.1.0] — 2026-10-01 — Phase 1: foundation

### Added
- Project setup: React 19, TypeScript 6, Vite 8, Tailwind 4, React Router 6, GSAP, R3F (lazy).
- Static generation with vite-react-ssg: 8 public routes + 404 + internal styleguide prerendered to HTML; `scripts/verify-dist.ts` CI gate.
- Design tokens (colour, fluid type, spacing, breakpoints, radius, shadow, motion) and section tones (ivory/cream/taupe/dark).
- Typography, layout (Container, Section, Rule, 12-col editorial grid), Button, ActionLink, Icon set, arched mask.
- Content layer: `content/*.json` validated by zod; business, services (exact sheet wording + flags), brands (9 logos + 3 names, `claim: none`), reviews, gallery, FAQ.
- Media slot registry (71 slots) + `<Media>` with placeholder, skeleton, lazy loading, error fallback.
- SEO: per-route meta/OG/Twitter/canonical, HairSalon JSON-LD (verified fields only), sitemap, robots, temporary typographic favicon + share image.
- Accessibility: skip link, focus ring, focus-trapped mobile menu, reduced motion, landmarks.
- Header, mobile menu, mobile quick-action bar, footer (data wiring final; visual refinement in Phase 2/9).
- Optional 3D (arched mirror) behind capability gate + error boundary.
- `content:check` (launch-blocker report; `--strict` fails) and a static preview server that mirrors static-host behaviour.
- Tests: 31 unit (links, content integrity, contrast, media) + 52 e2e (static HTML, 404, overflow at 7 widths, mobile nav, links, axe at 390/1440, reduced motion, WebGL on/off).

### Fixed during Phase 1
- 404 generation (catch-all skipped by SSG), charset beyond 1024 bytes, 3D chunk preloaded on every visit, intermittent double mount on hydration, mobile menu clipped by header backdrop-filter, Book Now visible/wrapping on mobile.

### Known / deferred
- 3D chunk is 242 KB gz (budget 180 KB). Decide in Phase 11: keep, slim (vanilla three), or remove.

## [0.0.2] — 2026-10-01 — Phase 0 corrections (APPROVED)

### Changed
- Reference direction: Geetanjali Salon is primary for depth, IA, services, gallery, testimonials, booking flow and footer. Ishita Kapoor and previous Classy concepts excluded.
- Design: "quiet atelier" kept as the base, made **richer**: 12-chapter homepage, hero carousel, Hair Treatments rail, Bridal & Makeup chapter, density rules (DESIGN §1).
- Services: unclear wording is no longer relabelled. `sourceLabel` is shown; `proposedLabel` is used only after client confirmation. Every ⚑ item is a launch blocker.
- Brands: **all nine logos shown** (incl. Guinot, Thalgo, Dyson). Wella, Shea Butter and Brillare Professional are three separate entries with no assumed relationship. Heading "Products & Brands". No partnership claims.
- Rating: now **pending/configurable**. Candidates 4.7/232+ and 4.9/1500+; neither chosen.
- Routing pinned to **React Router 6**: `vite-react-ssg` 0.9.2 requires peer `react-router-dom ^6.14.1`.
- Static generation documented exactly (DRD §3), with a `verify-dist` CI gate, a Phase 1 spike and a custom Vite-SSR prerender fallback.
- DEPLOYMENT rewritten around the exact `dist/` output; no SPA rewrites.

### Removed
- The competitor sentence "We are experts in all aspects of Hair, from cutting to styling". No replacement claim.
- Proposed "Salon Updates" strip (only if the client later supplies content). No blog/posts.
- Any reference to named people.

## [0.0.1] — 2026-10-01 — Phase 0 (documentation)
- Initial source audit, PRD, DRD, DESIGN, ARCHITECTURE, CONTENT-MAP, MEDIA-MANIFEST, QA-CHECKLIST, DEPLOYMENT.
