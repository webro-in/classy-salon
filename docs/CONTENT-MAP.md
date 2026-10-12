# CONTENT MAP — Source → Data → Page

Legend: ✅ approved · ⚑ needs confirmation (launch blocker) · ⛔ missing (CLIENT DATA REQUIRED) · ✖ never shipped

## 1. Business facts → `content/business.json`

| Field | Source | Status | Rendered on |
|---|---|---|---|
| Name: Classy Unisex Salon | Brief | ✅ | Global, SEO |
| Address: Plot no. 210, Vishwa Vidhyalaya Nagar, Jagatpura, Jaipur, Rajasthan 302017 | Brief | ✅ | Visit, Contact, Footer, JSON-LD |
| Rating + review count: **4.8 · 1500+ (Google)** | Client message 2026-10-01 | ✅ | Trust, Reviews, Services intro, JSON-LD |
| Instagram primary: instagram.com/classysalonjaipur | Brief | ✅ | Instagram, Footer, sameAs |
| Instagram secondary: instagram.com/classy_salonjaipur | Client, 2026-10-02 (both links supplied) | ✅ | Instagram, Footer, Contact, sameAs |
| Google Maps URL | Brief (search URL) | ✅ (exact place URL preferred) | Visit, Contact, Footer |
| Phone + WhatsApp: **+91 83025 55854** (WhatsApp account "classysalonjaipur") | Client screenshot 2026-10-01 | ✅ | Actions, Contact, Footer, service rows, JSON-LD |
| Hours: **every day 9:30 AM – 9:30 PM** | Client message 2026-10-01 | ✅ | Visit, Footer, Services, JSON-LD |
| Email: **Classysalonjaipur@gmail.com** | Client, 2026-10-02 | ✅ | Contact, Footer, Visit, JSON-LD |
| Google Maps link: **https://maps.app.goo.gl/C98q7iEKJztyNwsh6?g_st=iw** (exact, client-supplied) | Client, 2026-10-02 | ✅ | Get directions / Open in Google Maps everywhere, JSON-LD hasMap |
| Domain · Geo | — | ⛔ | SEO, JSON-LD |
| Logo: scissors emblem (image) + "CLASSY / Salon Unisex" plaque (vector PDF) | Client attachments 2026-10-01 | ✅ (emblem traced to SVG; client to confirm or supply vector) | Header, Footer, favicon, OG |
| Salon story / philosophy | — | ⛔ CLIENT STORY REQUIRED | Home intro (short), About |
| FAQ answers | — | ⛔ CLIENT FAQ CONTENT REQUIRED | Contact |
| Legal entity name, privacy contact | — | ⛔ | Privacy, Terms |
| People (owner/team) | — | ✖ until confirmed + approved (incl. "Anjani Thakur") | — |

## 2. Services → `content/services.json` (source A1)

| Source wording (exact) | Display now | Proposed (only if confirmed) | Status | Description |
|---|---|---|---|---|
| Keratin Treatment | Keratin Treatment | — | ✅ | High-level purpose |
| Hair Botox Treatment | Hair Botox Treatment | — | ✅ | High-level purpose |
| Anti Dandruff Treatment | Anti Dandruff Treatment | Anti-Dandruff Treatment | ⚑ hyphenation | High-level purpose |
| Hair Glossing | Hair Glossing | — | ✅ | High-level purpose |
| Hair Repair Treatment | Hair Repair Treatment | — | ✅ | High-level purpose |
| Hair Textures | Hair Textures | — (client to explain) | ⚑ meaning unclear | ⛔ CLIENT DESCRIPTION REQUIRED |
| Hair Kerastase | Hair Kerastase | Kérastase Hair Treatment(s)? | ⚑ name/accent | ⛔ CLIENT DESCRIPTION REQUIRED |
| Hair Scalp Treatments | Hair Scalp Treatments | — | ✅ | High-level purpose |
| Other Hair Serices | Other Hair Serices | Other Hair Services | ⚑ spelling | Cutting and styling, if confirmed |
| Skin Services = Beauty Essentials | Beauty Essentials | — | ⚑ is "Beauty Essentials" the item name? | ⛔ until confirmed |
| Skin – Hands & Feet ~~Services~~ SPa | Skin – Hands & Feet Spa | Hands & Feet Spa | ⚑ wording | High-level purpose |
| Radiant Skin Solutions | Radiant Skin Solutions | — | ✅ | High-level purpose |
| Bridal makeup | Bridal Makeup | — | ✅ (caps only) | High-level purpose |
| HD makeup | HD Makeup | — | ✅ (caps only) | High-level purpose |
| Airbrush makeup | Airbrush Makeup | — | ✅ (caps only) | High-level purpose |
| (struck-out item below makeup) | — | — | ignored | — |
| ~~"We are experts in all aspects of Hair, from cutting to styling"~~ | **Removed** (competitor wording). No replacement claim | — | ✖ | — |

Groups: 01 Hair · 02 Skin · 03 Makeup. Home shows group summaries + names; `/services` shows all rows. Group summaries are written only from the item names above (factual scope, no claims).

## 3. Brands → `content/brands.json` (heading "Products & Brands")

Client instruction 2026-10-01: show only the six green-dot brands plus Wella, Shea Butter and Brillare Professional, all with logos. Guinot, Thalgo and Dyson were removed.

| # | Name | Logo slot | Status |
|---|---|---|---|
| 1 | Kérastase | `brand.kerastase` | ✅ shown · logo placeholder ⛔ |
| 2 | L'Oréal Professionnel | `brand.loreal-professionnel` | ✅ shown · logo placeholder ⛔ |
| 3 | Kanpeki | `brand.kanpeki` | ✅ shown · logo placeholder ⛔ |
| 4 | Redken | `brand.redken` | ✅ shown · logo placeholder ⛔ |
| 5 | Olaplex | `brand.olaplex` | ✅ shown · logo placeholder ⛔ |
| 6 | K18 | `brand.k18` | ✅ shown · logo placeholder ⛔ |
| 7 | Wella | `brand.wella` | ✅ shown · logo placeholder ⛔ |
| 8 | Shea Butter | `brand.shea-butter` | ✅ shown · logo placeholder ⛔ · relationship to other brands not assumed |
| 9 | Brillare Professional | `brand.brillare-professional` | ✅ shown · logo placeholder ⛔ |

**Logo rule (client, 2026-10-01):** only official/approved logo files supplied by the client. Logos taken or recreated from competitor/reference websites are never used. The six vector logos traced in Phase 4 from a reference-site image were removed from the project. Until files arrive, each cell shows the brand name in type with a "Logo placeholder" tag (preview only); `npm run build:production` stays blocked. `claim: 'none'` for all: never "partner", "official partner" or "verified partner" unless the client confirms the relationship. Guinot, Thalgo and Dyson are not shown unless the client asks.

## 4. Never shipped (✖)
All Geetanjali text, images, logos, stats, founder, awards, sister brands, tokens. Style N Scissors copy and offers. Amber by Bhavikaa posts/images. The A4 image itself. Ishita Kapoor and previous Classy concepts.

## 5. About page (Phase 3)
| Content | Source | Status | Rendered |
|---|---|---|---|
| Story | `content/business.json → story` | ⛔ pending | About 01 (and Home intro) |
| Philosophy | `content/about.json → philosophy` | ⛔ pending (release blocker) | About 02 pull-quote |
| Salon facts | business name/descriptor/address + service groups | ✅ | About 01 fact list |
| Approach columns | `content/services.json` groups | ✅ (summaries draft) | About 02 |
| "What to expect" points | derived from descriptor, services, brands, address | draft copy | About 04 |
| Team | `content/team.json` (approved + consent required) | none supplied → hidden | About 05 |
| UI copy | `src/data/about.ts` | draft | all About headings/intros |

## 6. Our Services page (Phase 4)

| Content | Source | Status |
|---|---|---|
| 15 service names, exact sheet wording | Handwritten sheet (A1) | ✅ (6 names ⚑, unchanged until confirmed) |
| Service descriptions | WEBRO, from the service names | draft (4 ⛔: Hair Textures, Hair Kerastase, Other Hair Serices, Beauty Essentials) |
| Highlights (3 points per service, shown under "Details") | WEBRO, generic purpose only | draft · no prices, durations, ingredients or results promises |
| Group summaries, hero lead, intro statement, CTA copy | WEBRO (`src/data/services.ts → servicesPageCopy`) | draft |
| Intro statement "Hair, from the first cut to the final finish" | WEBRO original line; replaces the competitor sentence the client highlighted | draft |
| WhatsApp message | Phase 4 spec (`buildServiceEnquiryMessage`) | ✅ enquiry only |
| Trust facts: 4.8 · 1500+ · 15 services · open daily | `business.json` | ✅ |

## 7. Gallery (Phase 5) → `content/gallery.json`

| Content | Source | Status |
|---|---|---|
| 29 photos + 6 videos (Work 16 · The Space 13 · Videos 6) | Client media folders (A, B, C, W), 2026-10-01 | ✅ real Classy media |
| Before & After | — | ⛔ hidden until real, consented before/after pairs are supplied |
| Captions (alt text) | WEBRO, describing what is visible | draft |
| Page copy (`src/data/gallery.ts → galleryPageCopy`) | WEBRO | draft |
| Identifiable people (12 gallery items + 15 page photos, `people: true`) | — | ⚑ consent required → `content/consent.json` (`peopleInMedia`); blocks the production build until verified |

Excluded: the "classy salon photo an video 4" folder (Pinterest/Klickpin downloads), brand posters, low-res screenshots, shrine photos.

## 8. Reviews (Phase 6) → `content/reviews.json` + `content/business.json`

| Content | Source | Status |
|---|---|---|
| Google rating 4.8 / 5 · 1500+ reviews | Client (2026-10-01) → `business.json → rating` (single place to update; checkedOn shown on the page) | ✅ |
| Google reviews link | `reviews.json → googleReviewsUrl` (pending) → falls back to the verified Maps listing | ✅ fallback |
| Review quotes | Client only: verbatim text, name as shown on the source, rating/date only if the source shows them, `approval` (permission, verbatim, sourceRef, approvedOn) | ⛔ **CLIENT REVIEWS REQUIRED** — none supplied; blocks the production build |
| Page copy (`src/data/reviews.ts → reviewsPageCopy`) | WEBRO | draft |

Release rules (`scripts/content-rules.ts §7`): no reviews → blocker; placeholder/sample text, generic or fake names ("John Doe", "Customer", "Anonymous"…), reference-site content, duplicates, future dates → blocker. Never shipped: invented, rewritten, merged or summarised reviews; reviews from other salons; Geetanjali reviews, names or ratings.

## 9. Contact / Visit (Phase 7)

| Content | Source | Status |
|---|---|---|
| Address, hours, phone, WhatsApp, email, Maps link, both Instagram accounts, rating | `content/business.json` (client-supplied) | ✅ |
| Open/closed status | Derived from the verified hours at Asia/Kolkata time; no holiday/special schedules assumed | ✅ |
| Appointment enquiry → WhatsApp (Name, Service, Preferred Date, Preferred Time) | `buildEnquiryMessage`; services from `src/data/services.ts` | ✅ enquiry only |
| FAQ questions + answers | Client only (`content/faq.json`) | ⛔ CLIENT FAQ CONTENT REQUIRED — optional: hidden in production until supplied; supplied placeholder text blocks release |
| Page copy (`src/data/contact.ts`) | WEBRO | draft |

Instagram URLs are stored without the share-tracking parameters (`stkn`, `utm_source`) of the supplied links. Still pending: legal business name, salon story/philosophy, production domain.

## 10. Privacy Policy, Terms & Conditions, 404 (Phase 8)

The wording in `src/data/legal.ts` is a **WEBRO draft for client/legal review. It is not legal advice** and should be checked by the client or their adviser before release. It describes only what this website actually does: no accounts, payments, online booking system, server-side form storage, cookies, analytics or ad trackers; the enquiry form builds a WhatsApp message in the browser; fonts and images are self-hosted; Google Maps loads only on request.

| Item | Source | Status | Production |
|---|---|---|---|
| Legal business name | `business.json → legalName` | ⛔ [LEGAL BUSINESS NAME REQUIRED] | blocks release |
| Effective date ("Last updated") | `legal.json → effectiveDate` | ⛔ [LEGAL DETAILS REQUIRED] | blocks release |
| Governing law / jurisdiction (Terms) | `legal.json → governingLaw` | ⛔ [LEGAL DETAILS REQUIRED] | blocks release |
| Appointment policy (cancellation, late arrival, deposits…) | `legal.json → appointmentPolicy` | ⛔ [CLIENT POLICY REQUIRED] | optional: section omitted until supplied |
| Trading name, address, email, phone, WhatsApp | `business.json` (client-supplied) | ✅ | shown |
| Analytics | `VITE_ANALYTICS_PROVIDER` | none | switching it on blocks release until the Privacy Policy is updated |
| 404 copy (`src/data/notFound.ts`) | WEBRO | draft | — |

Never invented: GST/CIN/company numbers, a registered address other than the salon, ownership or data-controller details, jurisdiction, refund/cancellation/deposit/payment/membership rules, guarantees, retention periods.
