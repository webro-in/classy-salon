# MEDIA MANIFEST

All slots live in `src/data/media.ts`. **Since 2026-10-01 almost every slot uses real Classy photos/videos** supplied by the client (see "Supplied media" below). Still placeholders: all nine brand logos (required) and `beforeAfter01–03` (optional: the Before & After gallery category stays hidden until consented pairs are supplied).
Supply originals at or above the listed size; the build generates AVIF/WebP variants.

## Global
| Slot | Purpose | Ratio | Desktop | Mobile | Format |
|---|---|---|---|---|---|
| `logoWordmark` | Header, footer | vector | SVG | SVG | SVG |
| `logoMark` | Favicon, menu, OG | 1:1 | SVG + 512 PNG | — | SVG/PNG |
| `ogDefault` | Share card | 1.91:1 | 1200×630 | — | JPG (built from logo + photo) |

## Home
| Slot | Purpose | Ratio (desk / mob) | Desktop | Mobile | Format |
|---|---|---|---|---|---|
| `heroSlideHair` | Hero slide 1 | 16:9 / 4:5 | 2400×1350 | 1080×1350 | JPG |
| `heroSlideSkin` | Hero slide 2 | 16:9 / 4:5 | 2400×1350 | 1080×1350 | JPG |
| `heroSlideMakeup` | Hero slide 3 | 16:9 / 4:5 | 2400×1350 | 1080×1350 | JPG |
| `heroVideo` (optional) | Replaces slide 1 on desktop | 16:9 | 1920×1080, 8–15 s | poster only | MP4 + WebM ≤ 2.5 MB |
| `introPortrait` | Arched intro image | 4:5 | 1200×1500 | 800×1000 | JPG |
| `introDetail` | Overlapping detail | 1:1 | 900×900 | 600×600 | JPG |
| `serviceHairImage` · `serviceSkinImage` · `serviceMakeupImage` | Service rows | 4:5 | 1200×1500 | 800×1000 | JPG |
| `treatment.<id>` ×9 | Hair Treatments rail | 3:4 | 900×1200 | 600×800 | JPG |
| `salonInterior01–05` | The Salon strip | 3:2 | 1800×1200 | 1080×720 | JPG |
| `makeupFeature` | Bridal & Makeup chapter | 16:9 / 4:5 | 2400×1350 | 1080×1350 | JPG |
| `makeupBridal` · `makeupHD` · `makeupAirbrush` | Makeup items | 4:5 | 1000×1250 | 720×900 | JPG |
| `work01–04` | Real Work grid | 4:5 / 1:1 / 3:2 mixed | 1600 long edge | 1080 | JPG |
| `workVideo01` | Real Work vertical clip | 9:16 | 1080×1920 | same | MP4 ≤ 6 MB + poster |
| `instagram01–06` | Instagram mosaic | 1:1 / 4:5 | 1080 | 720 | JPG |
| `salonExterior` | Visit Us | 3:2 | 1600×1067 | 1080×720 | JPG |

## Brands
| Slot | File | Notes |
|---|---|---|
| `brand.kerastase`, `brand.loreal-professionnel`, `brand.kanpeki`, `brand.redken`, `brand.olaplex`, `brand.k18`, `brand.wella`, `brand.shea-butter`, `brand.brillare-professional` | — (`public/media/brands/` is empty) | **Required.** Official/approved SVG or transparent PNG (≥ 600 px wide) supplied by the client only. Never taken or recreated from other websites. Marked placeholders until then; production build blocked |

## Other pages
| Slot | Page | Ratio | Desktop | Mobile |
|---|---|---|---|---|
| `aboutHero` | About | 16:9 / 4:5 | 2400×1350 | 1080×1350 |
| `aboutStory` | About · story (arch) | 4:5 | 1200×1500 | 800×1000 |
| `aboutStoryDetail` | About · story detail | 1:1 | 900×900 | 600×600 |
| `aboutApproach` | About · approach (full-bleed) | 21:9 / 4:5 | 2400×1030 | 1080×1350 |
| `aboutSpace01` | About · space, large | 4:5 | 1600×2000 | 1080×1350 |
| `aboutSpace02` | About · space, landscape | 3:2 | 1800×1200 | 1080×720 |
| `aboutSpace03` | About · space, detail | 1:1 | 1200×1200 | 800×800 |
| `aboutCta` | About · closing CTA (arch) | 4:5 | 1200×1500 | 800×1000 |
| `team.<id>` | About · team (only approved people) | 4:5 | 1200×1500 | 800×1000 |
| `servicesHero` | Our Services | 21:9 / 4:5 | 2400×1030 | 1080×1350 |
| `serviceItem.<id>` ×15 | Service rows | 4:3 | 960×720 | 640×480 |
| `galleryFeature` | Gallery | 16:9 | 2400×1350 | 1080×1350 |
| `gallery[]` (data) | Gallery | per item | 2400 long edge | 1200 |
| `beforeAfter01–03` | Gallery | 4:5 pairs | 1200×1500 each | 800×1000 |
| `reviewsHero` | Reviews | 21:9 / 4:5 | 2400×1030 | 1080×1350 |
| `contactHero` | Contact | 3:2 / 4:5 | 2000×1333 | 1080×1350 |
| `notFoundImage` | 404 | 16:9 / 4:5 | 2000×1125 | 1080×1350 |

## Shoot brief for the client
1. Interiors in daylight with all lights on: entrance, styling stations, wash area, makeup area, product shelves, exterior signage.
2. Details: mirrors, tools, products in use, textures.
3. Landscape 8–15 s clips (blow-dry, cutting, wash, makeup) + vertical reels.
4. Finished results: hair treatments, cuts, bridal/HD/airbrush makeup (written consent from each person).
5. Before/after pairs with matched light and angle (consent).
6. Original logo file (AI/SVG/PDF) and official logo files for all brands.

## Rules
Real Classy media only. No Geetanjali, stock, AI-generated or competitor imagery. Alt text is required per slot. Identifiable people need recorded consent (`consent: true`).

## Presentation crops (Phase 2)
Some placements crop a slot to a different ratio with `<Media aspect>`; the placeholder label shows "shown X (slot Y)". Supply photos that work at both.
| Slot(s) | Native | Shown on Home |
|---|---|---|
| `service.<hair id>` ×9 | 4:3 | 4:5 (Hair Treatments rail) |
| `serviceHairImage` / `Skin` / `Makeup` | 4:5 | 3:2 on mobile/tablet rows; 4:5 arch on desktop |
| `instagram01/03/05` | 1:1 | 4:5 |

## Supplied media (2026-10-01)

Source folders on the client's computer: "classy salon photos and video" (A, 49 JPG), "classy salon photos and video 2" (B, HEIC + MOV), "classy salon  works" (C, 4K HEIC/MOV), "classy salon work photos" (W, bridal work + hair videos), plus "PDF 2.pdf" (illuminated logo sign) and "Salon Unisex.pdf" (vector plaque logo). Conversion: cropped per slot ratio with a focal point, JPG q80 progressive, separate `-m.jpg` 4:5 mobile crops for wide slots; videos H.264, no audio, faststart.

**Excluded:** folder "classy salon photo an video 4" (Pinterest/Klickpin downloads and an AI-looking image: not Classy, copyright risk), brand posters with models (A-020–A-025), low-res screenshots (W-002/003/008), the shrine photos (A-001, C-016/017, B-021/022).

| Slot(s) | Source | Notes |
|---|---|---|
| `heroSlideHair` | B IMG_4528 2.HEIC | Bright styling floor |
| `heroSlideSkin` | A IMG_20260911_195315 | Pedicure lounge |
| `heroSlideMakeup`, `serviceMakeupImage`, `makeupBridal/HD/Airbrush`, `work01`, `galleryFeature`, `instagram02`, `service.bridal-makeup` | W bridal photos | ⚑ bride identifiable: publishing consent required |
| `heroVideo` | C IMG_6797.mov (8 s, 1600 px, 1.8 MB) | Makeup studio flat lay |
| `workVideo01` | W IMG_2717.MOV (12 s, 720 px, 2.4 MB) | Smoothing result |
| `serviceHairImage`, `instagram03/06`, `aboutApproach`, `service.hair-glossing`, `service.hair-botox-treatment`, `service.keratin-treatment`, `work04` | Frames from C / W 4K videos | ⚑ staff and clients identifiable: consent required |
| `salonInterior01–05`, `introPortrait`, `aboutHero`, `aboutSpace01–03`, `servicesHero`, `reviewsHero`, `notFoundImage` | A / B / C interiors | |
| `salonExterior`, `contactHero` | A night sign photos | |
| `aboutStory`, `logoSign` | "PDF 2.pdf" | Illuminated emblem |
| `aboutCta`, `instagram01` | B logo niche video frame | |
| `logoWordmark` | "Salon Unisex.pdf" → `public/logo/logo-wordmark.svg` | Original vector |
| `logoMark` | Client logo image → `public/logo/logo-mark*.svg` (ink, gold, light) | Traced; ask for the original vector |

## Gallery media (Phase 5)

Files: `public/media/gallery/<id>.jpg` (long edge 1800 px, viewer) + `<id>-sm.jpg` (720 px wide, grid). Videos: `<id>.mp4` (H.264, no audio, 720 px portrait / 1280 px landscape, 6–9 s, 0.7–1.9 MB) + `<id>-poster.jpg`. Natural aspect ratios are kept (no cropping); `ratio` in `content/gallery.json` matches each file (unit-tested).

| Category | Items | Sources |
|---|---|---|
| Work | 8 bridal (W folder, ⚑ consent), 4 hair video frames (C/W), 3 nail art (A/C), makeup kit (C) | |
| The Space | 13 interiors and the night sign (A/B/C) | |
| Videos | smoothing, blow-dry curls, round brush, beard grooming (⚑), emblem niche, makeup studio | C / W / B |

To add an item: put the files in `public/media/gallery/`, add an entry to `content/gallery.json` (id, category, kind, src, thumb, poster for video, alt, ratio, people). The category appears automatically once it has items.

## Reviews (Phase 6)

Typography-led. Only media: `reviewsHero` (real salon interior, already supplied) and the client emblem (`public/logo/logo-mark-gold.svg`, decorative). No customer photos. If the client later supplies a review photo with consent, add a slot in `src/data/media.ts` (and `people: true`).

## Contact (Phase 7)

| Slot | File | Notes |
|---|---|---|
| `contactHero` | `photos/contactHero.jpg` (+ `-m`) | Night sign (existing) |
| `contactVisit` (new) | reuses `photos/aboutHero.jpg` (+ `-m`) | Map preview shown until the visitor loads Google Maps |

No Google request is made until "Show map" is pressed. Failed images fall back to the placeholder (also when the failure happens before hydration).

## Client update (2026-10-02)

Source folders on the client's Mac: `salon photos` (= `salon work`), `models photos`, `bridal photos`. Processed by `scripts/media/process-oct-update.py` (high-quality progressive JPEG, never upscaled).

| Use | File(s) | Source | Licence |
|---|---|---|---|
| Hero slides 1 / 3 (salon) | heroSlide01, heroSlide03 (+ `-m`) | IMG_4521_2, IMG_4536_2 | Classy's own |
| Hero slides 2 / 4 (model) | heroSlide02, heroSlide04 (+ `-m`) | pexels-midory-niwa-12168994-12955059, pexels-mer0omex-11153470 | Pexels |
| Hair group image | serviceHairImage | `hair .png` (Classy staff, hair wash) | Classy's own (people: consent gate) |
| Skin group image | serviceSkinImage | pexels-mart-production-7290698 | Pexels |
| Makeup group image | serviceMakeupImage | pexels-skgphotography-29370695 | Pexels |
| Hair Botox / Glossing / Textured Hair | service-hair-botox-treatment, service-hair-glossing, service-hair-textures | `hair botex treatment.jpg`, pexels-yulianaphoto-9197357, pexels-krivitskiy-18156217 | Pexels |
| Bridal / HD / Airbrush rows | service-bridal-makeup, service-hd-makeup, service-airbrush-makeup | pexels-dinar-sheikh-2277522-5187135, pexels-adeteroshniamaacademy-30825617, -30795554 | Pexels |
| Home makeup cards | makeupBridal, makeupHD, makeupAirbrush | pexels-skgphotography-29133465, pexels-1054048-14847827, pexels-skgphotography-5376740 | Pexels |
| Replacements | aboutCta, salonInterior01, instagram01/03/06 | IMG_4536_2, IMG_4527, existing Classy gallery photos | Classy's own |
| Gallery | 4 new Classy items + 17 under **Looks** | the three folders | Classy's own / Pexels |
| Brand logos | `public/media/brands/*.png` | client-supplied logo sheet | client-supplied |

Rules: licensed stock carries `license: 'Pexels'` (media slots and gallery items), is captioned neutrally and never presented as Classy's work; in the gallery it may only appear under Looks. The client-consent gate applies to Classy's own photos of people only. Unused from the folders: `hair.jpg` (used in Looks only), `pexels-igor-meghega-315695093-15935557.jpg` (flower still life, not salon-related).
