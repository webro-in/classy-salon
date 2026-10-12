# PRD — Classy Unisex Salon Website

Status: **Phase 0 APPROVED (rev. 2, corrections applied)**
Owner: WEBRO · Last updated: 2026-10-01

---

## 1. Overview

A new, frontend-only, multi-page brand website for **Classy Unisex Salon**, Jagatpura, Jaipur.

The site uses **Geetanjali Salon** as its primary reference for depth, information architecture, page experience, service presentation, editorial layout, content hierarchy, gallery, testimonials, contact/booking flow and footer depth. Its code, copy, images, logos and exact layouts are never copied.

Not used as references: Ishita Kapoor, any previous Classy concept, Style N Scissors copy, and Amber by Bhavikaa content.

The site should feel like an **established premium salon brand**: rich photography, strong typography, editorial storytelling, refined motion and subtle 3D. It is not a sparse minimalist portfolio.

---

## 2. Source audit

### 2.1 Supplied material

| # | Attachment | Classification |
|---|---|---|
| A1 | Handwritten service sheet "Products from Classy Salon in Jaipur" | **Source of truth for services** |
| A2 | stylenscissors.com screenshots | Competitor. **Nothing used** |
| A3 | Amber by Bhavikaa "Latest Posts & Updates" screenshots | **Nothing used.** No blog/posts feed |
| A4 | "Partner Brands" 3×3 logo image | Defines the **9 brands to show**. The image itself is not used. Logos come later as clean files |
| A5 | WhatsApp thread | Adds **Wella**, **Shea Butter**, **Brillare Professional** |
| A6 | Geetanjali screen recording | Primary UX/IA reference |
| A7 | Geetanjali design-token dumps | Reference only. Not the Classy identity |
| A8 | Business facts in the brief | Configurable data (rating pending, see §8) |

### 2.2 Reference behaviour adopted from Geetanjali (adapted, original execution)

- A rich, multi-chapter homepage: hero → story/trust → services → feature chapters → brands → gallery/work → testimonials → booking → visit → deep footer.
- A full-bleed hero media carousel.
- Stats presented with thin rules and large numerals.
- A service page with numbered categories (`01/02/03`), title, summary, vertical hairline and `+` toggle, revealing **nested sub-service rows** (image, name, description).
- A persistent "Message us on WhatsApp" action.
- A curated gallery with categories and a full-screen viewer.
- A deep footer (navigation, contact, social, booking, legal).

Not adopted: founder feature, awards, sister brands, franchise, membership, academy, CSR, PR, blog, multi-location.

---

## 3. Goals

**Business:** more WhatsApp enquiries and calls from Jaipur searchers. Present Classy as an established premium salon. Make content maintainable from one place.

**Conversions (priority):** 1. WhatsApp enquiry · 2. Call · 3. Directions · 4. Google reviews · 5. Instagram.
A booking action is visible on every viewport, and WhatsApp is never more than one tap away.

---

## 4. Page structure (final)

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/services` | Our Services |
| `/gallery` | Gallery |
| `/reviews` | Reviews |
| `/contact` | Contact |
| `/privacy` | Privacy Policy |
| `/terms` | Terms |
| `404` | Not Found |

**Never added:** Membership, Franchise, Academy, CSR, PR & Press, Blog, Latest Posts/Updates, multi-location, unrelated brand/program pages.
A small "Salon Updates" area may be considered later **only** if the client supplies Classy content for it.

---

## 5. Navigation (final)

```
[CLASSY logo]   Home · About · Our Services · Gallery · Reviews · Contact     [BOOK NOW]
```
- Desktop: logo left, links centre/right, solid "Book Now".
- Mobile: logo + menu toggle → full-screen menu (links, contact actions, Instagram).
- Persistent mobile action bar: **WhatsApp** · **Call** (safe-area aware). Desktop: a slim "Message us on WhatsApp" bar at the bottom of the viewport.
- The services label is always "Our Services", never "Menu".

---

## 6. Homepage section order (final)

| # | Section | Content source |
|---|---|---|
| 1 | **Hero**: full-bleed media carousel (3 slides: Hair / Skin / Makeup), name, location, Book Now + WhatsApp | Business facts + media slots |
| 2 | **Introduction & Trust**: editorial statement about the salon + rating stats (thin-rule numerals) | Factual copy + rating (pending) |
| 3 | **Our Services**: 01 Hair / 02 Skin / 03 Makeup preview rows with imagery → "View all services" | A1 groups |
| 4 | **Hair Treatments**: horizontal editorial rail of the sheet's hair treatments | A1 hair items |
| 5 | **The Salon**: immersive interior media strip | Media slots |
| 6 | **Bridal & Makeup**: full-bleed feature chapter (Bridal / HD / Airbrush) | A1 makeup items |
| 7 | **Real Work**: asymmetric photo + video grid → Gallery | Media slots |
| 8 | **Products & Brands**: 9-logo editorial matrix + Wella, Shea Butter, Brillare Professional | A4 + A5 |
| 9 | **Reviews**: rating, genuine quotes when supplied, Google link → Reviews | Rating (pending) |
| 10 | **Instagram**: curated mosaic + both handles | Brief + media slots |
| 11 | **Book an Appointment**: dark chapter, WhatsApp enquiry builder, Call | Links config |
| 12 | **Visit Us**: address, hours, map, directions | Business facts |
| 13 | **Footer** (global) | |

Homepage service content stays concise: group summaries and names only. The complete list lives on `/services`.

---

## 7. Service groups (from A1 only)

| # | Group | Items (as written on the sheet; ⚑ = flagged) |
|---|---|---|
| 01 | **Hair** | Keratin Treatment · Hair Botox Treatment · Anti Dandruff Treatment · Hair Glossing · Hair Repair Treatment · Hair Textures ⚑ · Hair Kerastase ⚑ · Hair Scalp Treatments · Other Hair Serices ⚑ |
| 02 | **Skin** | Skin Services = Beauty Essentials ⚑ · Skin – Hands & Feet Spa ⚑ · Radiant Skin Solutions |
| 03 | **Makeup** | Bridal Makeup · HD Makeup · Airbrush Makeup |

Rules:
- No invented services and no prices, ever.
- **Unclear spellings and wording are not silently changed.** Each ⚑ item stores its exact `sourceLabel` and an optional `proposedLabel`. The proposed label is used only after the client confirms it. All ⚑ items are **launch blockers** (see DRD §6), so the site can't go live with an unconfirmed label.
- Normalising capitalisation (e.g. "Bridal makeup" → "Bridal Makeup") is the only automatic change.
- Items whose meaning is unclear (Hair Textures, Hair Kerastase) get **no invented description**. The description field is marked `[CLIENT DESCRIPTION REQUIRED]`.

### Service presentation (`/services`)
- Page intro + a sticky category index (01 Hair · 02 Skin · 03 Makeup).
- Each category is an expandable editorial block: large number, vertical hairline, title, short summary, group image, `+` toggle.
- Expanded: **nested rows**, each with an image slot, service name, short description and "Enquire on WhatsApp" (pre-fills that service name).
- Deep links: `/services#hair`, `#skin`, `#makeup` open the matching block.

---

## 8. Brand / products section

Heading: **"Products & Brands"** (alternative: "Professional Brands"). Never "partner" or "official".

**Logo matrix (all nine shown):** Kérastase · L'Oréal Professionnel · Guinot · Kanpeki · Redken · Thalgo · Olaplex · K18 · Dyson.
**Client-supplied names:** Wella · Shea Butter · Brillare Professional. These are three separate entries, shown as typographic names (logo slots available). No assumed relationship between Shea Butter and Wella.

- Logo files: placeholders until the client supplies them. Nothing is downloaded from Geetanjali or screenshotted from A4.
- No check/dot markers, verification badges or endorsement wording.

---

## 9. Rating

The rating value and review count are **configurable and unresolved**. Two candidate figures exist (4.7 / 232+ and 4.9 / 1500+), and **neither is chosen** until the client supplies the verified production value. Until then, rating UI shows a dev marker and is omitted from production and JSON-LD. This is a launch blocker.

---

## 10. Content rules

1. Only client-approved facts. Missing content shows dev markers and is **omitted in production**.
2. The competitor sentence "We are experts in all aspects of Hair, from cutting to styling" is **removed**. No replacement claim is invented. Copy is limited to approved facts: name, unisex salon, Jagatpura/Jaipur, the service names, and the brands used.
3. No superlatives or unverified claims (best, No. 1, award-winning, certified, official partner, internationally trained, years of experience).
4. No people: no Anjani Thakur, owner, founder, team or credentials unless the client confirms the role and approves the name/photo.
5. No Geetanjali, Style N Scissors or Amber text or media. No stock or AI imagery.
6. Production media is real Classy photos/video only. Until it arrives, marked placeholders at final dimensions are used.
7. Copy tone: confident, concise, factual. No filler, no em-dash habits.

---

## 11. Acceptance criteria

- [ ] 9 routes, each served as a prerendered static HTML file with a unique title, description and canonical.
- [ ] Every service traces to A1. Every ⚑ resolved before launch.
- [ ] All 9 logos + 3 names rendered. No partnership wording.
- [ ] Rating renders only once verified.
- [ ] A single data edit updates a phone number, service, brand or media slot everywhere.
- [ ] WhatsApp builder produces a correct `wa.me` URL and never says "confirmed".
- [ ] No horizontal scroll at 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920.
- [ ] Lighthouse mobile (with real media): Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO 100.
- [ ] Fully usable by keyboard, with reduced motion, with WebGL off, and with JS off (content readable).
- [ ] Zero console errors. Typecheck, lint, tests and `content:check --strict` pass.
