# DESIGN — Classy Visual System

Status: **Phase 0 APPROVED (rev. 2).** Tokens get tuned against real photography and the logo when they arrive.

---

## 1. Direction: "Quiet atelier, richly told"

The warm, material palette is approved, but the site must **not** be empty or minimalist. It carries the content depth and visual storytelling of the Geetanjali reference: many chapters, generous photography, layered compositions, confident type.

**Formula:** premium salon brand + editorial design + rich photography + strong typography + refined motion + subtle 3D + high-quality media.

Feels like: an established salon's printed lookbook. Full-bleed images, chaptered spreads, captions, numbered sections, texture.
Must not feel like: a sparse portfolio, a black-and-gold template, startup SaaS, a pastel beauty app, or a Geetanjali clone (theirs is white/black/Helvetica; Classy is warm, serif-led and material).

### Density rules (to avoid "too empty")
- Every section pairs type with media. No text-only chapters except legal pages.
- Section rhythm `clamp(4.5rem, 9vw, 8rem)`, tighter than a portfolio site.
- Use layered compositions: overlapping image + caption + number, image grids with mixed sizes, captions and eyebrow labels as editorial texture.
- Alternate light, deep-taupe and dark chapters so the page has visual cadence.
- The homepage is 12 content chapters (see PRD §6), with no thin filler.

---

## 2. Palette

| Token | Hex | Use |
|---|---|---|
| `--color-background` | `#F6F1E9` | Ivory page |
| `--color-surface` | `#EEE6DA` | Alternating chapters, cards in gallery |
| `--color-surface-deep` | `#DCCFBE` | Oak/taupe chapters, placeholder base |
| `--color-text` | `#1E1B18` | Warm charcoal |
| `--color-muted` | `#6B6158` | Secondary text (AA on ivory) |
| `--color-line` | `#CFC3B3` | Hairlines |
| `--color-accent` | `#9A7444` | Brass: numerals, focus, small marks |
| `--color-accent-strong` | `#7A5A33` | Accent text on ivory/cream (AA) |
| `--color-brass-deep` | `#6E5130` | Accent text on taupe (AA, added Phase 2) |
| `--color-dark` | `#191714` | Dark chapters (makeup feature, booking, footer) |
| `--color-on-dark` | `#EFE8DD` | Text on dark |
| `--color-on-dark-muted` | `#A89D90` | Secondary on dark |
| `--color-success` | `#4F6B4A` | Form success |
| `--color-error` | `#9B3B2E` | Form error |

Media scrim only: `linear-gradient(180deg, rgb(25 23 20 / 0) 40%, rgb(25 23 20 / 0.6))`. No decorative gradients, no pure white/black, brass below about 5% of any screen.

## 3. Typography

| Role | Face | Spec |
|---|---|---|
| Display | Instrument Serif (+ italic) | clamp 3.25 → 8.5 rem, lh 0.95, −0.02em |
| Heading | Instrument Serif | 2 → 3.5 rem, lh 1.05 |
| Body | Hanken Grotesk (variable) | 1.0625 rem / 1.65 |
| Nav / label / eyebrow | Hanken Grotesk 500 | 0.75–0.8125 rem, uppercase, 0.14em |
| Numerals | Instrument Serif, tabular | 01/02/03, stats; accent colour |
| Caption | Hanken Grotesk | 0.8125 rem, muted |

Re-evaluated against the logo when it arrives. Centralised in `tokens.css` + `components/typography`.

## 4. Grid & spacing
4 px base, scale tokens `--space-1…11`. 12-col grid, gutter `clamp(1rem, 2vw, 2rem)`, max content 1440 px, margins `clamp(1.25rem, 5vw, 5rem)`. Full-bleed media breaks the grid on purpose.

## 5. Shape, borders, shadow
Square by default. 2 px on inputs. Pill only for the mobile action bar. **Arched mask** (salon-mirror motif) is the signature shape on selected portraits. 1 px hairlines and vertical rules in service rows. Shadows only on the lightbox and mobile bar.

## 6. Buttons
Primary: solid charcoal, uppercase label, 52 px, square, brass underline slide on hover. Outline: 1 px border, bottom-up fill on hover. Text link: animated underline. WhatsApp/Call use the same styles with small inline SVG glyphs. No scale hovers.

## 7. Section compositions (homepage)

| # | Section | Composition |
|---|---|---|
| 1 | Hero | Full-bleed 3-slide carousel (Hair / Skin / Makeup), scrim, large name + "Unisex Salon · Jagatpura, Jaipur", Book Now + WhatsApp, slide counter and progress line, subtle 3D layer (desktop) |
| 2 | Intro & Trust | Asymmetric: serif statement (factual: unisex salon for hair, skin and makeup in Jagatpura) + arched portrait + detail image overlap; thin-rule rating stats (when verified) |
| 3 | Our Services | Three tall numbered rows with large imagery, image reveal on hover/focus, "View all services" |
| 4 | Hair Treatments | Horizontal scroll rail of treatment cards: image + name + one-line purpose (pinned on desktop, swipe on mobile) |
| 5 | The Salon | Pinned horizontal media strip of interiors with captions |
| 6 | Bridal & Makeup | Dark full-bleed chapter: large image, three numbered items (Bridal / HD / Airbrush), CTA |
| 7 | Real Work | Asymmetric grid: 1 large + 3 small + 1 vertical video, "View gallery" |
| 8 | Products & Brands | Editorial 3×3 logo matrix with hairline dividers (monochrome logos, quiet) + a typographic line: Wella · Shea Butter · Brillare Professional |
| 9 | Reviews | Oversized rating numeral (when verified), quote carousel slots, "Read Google reviews" |
| 10 | Instagram | Offset 6-tile mosaic + both handles |
| 11 | Book an Appointment | Dark chapter, headline, inline WhatsApp enquiry builder, Call |
| 12 | Visit Us | Split: address/hours/directions + map (lazy) + salon exterior image |
| — | Footer | Dark, oversized wordmark, 4 columns (Explore / Contact / Visit / Follow), Book Now, legal |

## 8. Other pages
- **About:** full-bleed hero, chaptered story slots ([CLIENT STORY REQUIRED]), the space (gallery strip), approach to hair/skin/makeup (from services), brands, CTA. No people unless approved.
- **Our Services:** intro, sticky category index, numbered expandable categories with nested image rows (PRD §7).
- **Gallery:** featured hero item, filters (Work / The Space / Videos / Before & After, shown only when populated), asymmetric editorial grid, full-screen viewer (keyboard, swipe, ESC, focus management).
- **Reviews:** rating hero, Google review link, quote layout for genuine supplied quotes only, CTA.
- **Contact:** split hero with actions, WhatsApp enquiry builder, address/hours/map, FAQ block ([CLIENT FAQ CONTENT REQUIRED]).
- **404:** full-bleed placeholder image, serif "Page not found", links home/services.

## 9. Media placeholders (visual spec)
`--color-surface-deep` base, fine linen noise (inline SVG filter), exact aspect ratio, a hairline frame, and in dev a mono caption: `heroSlideHair · 16:9 · 2400×1350`. In production builds, placeholders only appear while `content:check --strict` is off (pre-launch previews).

## 10. Motion
Ease `cubic-bezier(0.22,1,0.36,1)`. Durations: micro 180 · UI 320 · reveal 800 · page 420 ms. Line-mask text, clip-path media reveals, ≤ 8% parallax (desktop), pinned strips, hero crossfade + Ken Burns (6 s/slide, pausable), `+` → `×` accordion. Reduced motion: opacity only, no parallax, pinning, 3D or autoplay.

## 11. Responsive
390/430: single column, hero 4:5, rails become swipe, sticky action bar, number above title in service rows. 768: two-column compositions. 1024+: full editorial grid, pinned strips, hover reveals, 3D. 1440–1920: content capped at 1440, media full-bleed. Long names wrap (`text-wrap: balance`), never truncate.
