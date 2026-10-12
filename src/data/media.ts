/**
 * Media slot registry (docs/MEDIA-MANIFEST.md).
 *
 * Every image/video on the site is referenced by slot id, never by a raw path.
 * To add a real asset: put the file in /public/media/..., set `src` (and `poster`
 * for video), write the final `alt`, and set `status: 'supplied'`.
 * Until then <Media> renders a placeholder at the exact final ratio.
 *
 * Production rule: real Classy photos/videos, plus client-selected licensed
 * stock photography (Pexels, recorded with `license` and listed in
 * docs/MEDIA-MANIFEST.md). Never AI-generated, competitor or reference-site
 * media. Stock images are captioned neutrally: never as Classy's own work.
 */
import { brands } from './brands'
import { allServices } from './services'
import { teamMembers } from './team'

export type Ratio = `${number}:${number}`

export interface MediaSlot {
  id: string
  kind: 'image' | 'video' | 'logo'
  purpose: string
  /** Desktop/default aspect ratio. */
  ratio: Ratio
  /** Optional art-directed mobile ratio (< 768px). */
  mobileRatio?: Ratio
  /** Largest delivered size, used for briefing the client. */
  size: string
  mobileSize?: string
  alt: string
  src?: string
  /** Optional separate mobile source for art direction. */
  mobileSrc?: string
  poster?: string
  /** CSS object-position, e.g. "50% 30%". */
  focal?: string
  status: 'placeholder' | 'supplied'
  /** Supplied media shows an identifiable person: needs content/consent.json → peopleInMedia verified for release. */
  people?: boolean
  /** Licensed stock (e.g. 'Pexels'): model release comes with the licence, so the client-consent gate does not apply. */
  license?: string
  /**
   * Required for release: `npm run build:production` fails while a required
   * slot is still a placeholder. Optional slots fall back gracefully.
   */
  required: boolean
}

type SlotInput = Omit<MediaSlot, 'status' | 'kind' | 'required'> & Partial<Pick<MediaSlot, 'status' | 'kind' | 'required'>>

const slot = (s: SlotInput): MediaSlot => ({ kind: 'image', required: true, status: s.src ? 'supplied' : 'placeholder', ...s })


/**
 * Real Classy media (client-supplied photos/videos, converted for web).
 * Source files and selection notes: docs/MEDIA-MANIFEST.md.
 * People shown are staff, clients or brides: publishing consent must be
 * confirmed by the client before the production release.
 */
const P = '/media/photos'
const V = '/media/video'
type Supplied = Pick<MediaSlot, 'src'> & Partial<Pick<MediaSlot, 'mobileSrc' | 'poster' | 'alt' | 'focal' | 'people' | 'license'>>
const stock = (s: Supplied): Supplied => ({ ...s, people: false, license: 'Pexels' })
const withMobile = (id: string, alt: string): Supplied => ({ src: `${P}/${id}.jpg`, mobileSrc: `${P}/${id}-m.jpg`, alt })
const photo = (id: string, alt: string): Supplied => ({ src: `${P}/${id}.jpg`, alt })

/** Supplied slots in which a person can be recognised (consent gate, scripts/content-rules.ts). */
const PEOPLE = new Set([
  'heroSlideMakeup', 'serviceHairImage', 'serviceMakeupImage', 'makeupFeature', 'makeupBridal', 'makeupHD', 'makeupAirbrush',
  'work01', 'work04', 'work05', 'instagram02', 'instagram06', 'galleryFeature',
  'service.hair-botox-treatment', 'service.hair-glossing', 'service.bridal-makeup',
])

const supplied: Record<string, Supplied> = {
  logoWordmark: { src: '/logo/logo-wordmark.svg', alt: 'Classy Salon Unisex' },
  logoMark: { src: '/logo/logo-mark.svg', alt: 'Classy Unisex Salon' },
  logoSign: photo('logoSign', 'The illuminated gold Classy Salon emblem on the marble wall inside the salon'),
  heroSlideHair: withMobile('heroSlideHair', 'The bright styling floor at Classy, with arched mirrors and blush styling chairs'),
  heroSlideSkin: withMobile('heroSlideSkin', 'Quilted pedicure loungers in the hands and feet spa at Classy'),
  heroSlideMakeup: withMobile('heroSlideMakeup', 'A bride in red with bridal makeup by Classy'),
  heroSlide01: stock(withMobile('heroSlide01', 'Black-and-white portrait of a man with a textured, swept-back cut')),
  heroSlide02: stock(withMobile('heroSlide02', 'Black-and-white portrait of a sculpted evening makeup look')),
  heroSlide03: stock(withMobile('heroSlide03', 'A model in a yellow blazer holding a makeup brush')),
  heroSlide04: { ...withMobile('heroSlide04', 'Black-and-white portrait with short, glossy curls and statement earrings'), people: false, license: 'iStock 486949044 — LICENCE REQUIRED before launch (612px preview)' },
  heroVideo: { src: `${V}/heroVideo.mp4`, poster: `${V}/heroVideo-poster.jpg`, alt: 'Professional makeup laid out in the Classy makeup studio' },
  introPortrait: photo('introPortrait', 'The styling floor at Classy under the carved wooden ceiling'),
  introDetail: photo('introDetail', 'A wheel of nail art designs at Classy'),
  serviceHairImage: photo('serviceHairImage', 'A Classy stylist giving a client a hair wash at the backwash station'),
  serviceSkinImage: stock(photo('serviceSkinImage', 'Makeup being blended at a mirror, with brushes and palettes on the table')),
  serviceMakeupImage: stock({ ...photo('serviceMakeupImage', 'A bride in a maroon lehenga with kundan jewellery and a red dupatta'), focal: '50% 30%' }),
  salonInterior01: photo('salonInterior01', 'Gold-framed mirrors and blush styling chairs along the styling bar at Classy'),
  salonInterior02: photo('salonInterior02', 'Arched mirrors along the styling bar at Classy'),
  salonInterior03: photo('salonInterior03', 'Curved, lit product shelves at Classy'),
  salonInterior04: photo('salonInterior04', 'The hair wash lounge at Classy'),
  salonInterior05: photo('salonInterior05', 'An arched niche of hair and skin care products at Classy'),
  makeupFeature: { src: `${P}/makeupFeature.jpg`, mobileSrc: `${P}/makeupFeature-m.jpg`, alt: 'Professional makeup prepared in the Classy makeup studio' },
  makeupBridal: stock({ ...photo('makeupBridal', 'A bride in a red dupatta with emerald and gold jewellery'), focal: '50% 30%' }),
  makeupHD: stock({ ...photo('makeupHD', 'A close-up bridal look with a nath, maang tikka and layered jewellery'), focal: '50% 30%' }),
  makeupAirbrush: stock({ ...photo('makeupAirbrush', 'A bride in red with bangles, choora and a gold necklace'), focal: '50% 30%' }),
  work01: photo('work01', 'A full bridal look by Classy'),
  work02: photo('work02', 'Nail art designs at Classy'),
  work03: photo('work03', 'The makeup kit at Classy'),
  work04: photo('work04', 'A close-up bridal look by Classy with a nath and kundan jewellery'),
  work05: photo('work05', 'A Classy stylist giving a client a hair wash at the backwash station'),
  instagram01: photo('instagram01', 'Lit retail shelves at Classy'),
  instagram02: photo('instagram02', 'A bride styled by Classy'),
  instagram03: photo('instagram03', 'Arched, lit mirrors along the styling bar at Classy'),
  instagram04: photo('instagram04', 'A calm facial room at Classy'),
  instagram05: photo('instagram05', 'Nail colour charts at Classy'),
  instagram06: photo('instagram06', 'The styling floor at Classy under the jali ceiling'),
  salonExterior: withMobile('salonExterior', 'The Classy Salon Unisex sign lit at night, Jagatpura'),
  aboutHero: withMobile('aboutHero', 'The styling floor at Classy Unisex Salon'),
  aboutStory: photo('aboutStory', 'The illuminated gold Classy Salon emblem'),
  aboutStoryDetail: photo('aboutStoryDetail', 'Nail art designs at Classy'),
  aboutApproach: withMobile('aboutApproach', 'The styling floor at Classy at night, with oval gold mirrors and blush styling chairs'),
  aboutSpace01: photo('aboutSpace01', 'Styling chairs and arched mirrors at Classy'),
  aboutSpace02: photo('aboutSpace02', 'Makeup stations at Classy'),
  aboutSpace03: photo('aboutSpace03', 'Lit product shelves at Classy'),
  aboutCta: photo('aboutCta', 'Oval mirrors and styling chairs at Classy'),
  servicesHero: withMobile('servicesHero', 'Oval gold mirrors and lit shelves along the styling bar at Classy'),
  galleryFeature: withMobile('galleryFeature', 'A bridal look by Classy'),
  reviewsGoogle: stock(photo('reviewsGoogle', 'A black-and-white still life of a rose and baby’s breath')),
  reviewsHero: withMobile('reviewsHero', 'The styling floor at Classy'),
  contactHero: withMobile('contactHero', 'Classy Salon Unisex, Jagatpura, Jaipur, at night'),
  contactVisit: { src: `${P}/aboutHero.jpg`, mobileSrc: `${P}/aboutHero-m.jpg`, alt: 'Inside Classy Unisex Salon, Jagatpura' },
  notFoundImage: withMobile('notFoundImage', 'The styling floor at Classy'),
  ...Object.fromEntries(
    ['anti-dandruff-treatment', 'hair-repair-treatment', 'hands-feet-spa'].map((id) => [`service.${id}`, { src: `${P}/service-${id}.jpg` }]),
  ),
  // Client-selected images (October 2026 update). Portrait masters: focal keeps faces in the 4:3 crop.
  'service.keratin-treatment': stock({ src: `${P}/service-keratin-treatment.jpg`, alt: 'A flat iron, comb and hair-care bottles on long, smooth hair', focal: '50% 50%' }),
  'service.hair-kerastase': { src: `${P}/service-hair-kerastase.jpg`, alt: 'A relaxing scalp massage at the basin', focal: '50% 40%', people: false, license: 'Client-supplied (Kérastase scalp ritual image)' },
  'service.other-hair-serices': stock({ src: `${P}/service-other-hair-serices.jpg`, alt: 'Long, glossy, softly curled hair', focal: '50% 30%' }),
  'service.hair-scalp-treatments': stock({ src: `${P}/service-hair-scalp-treatments.jpg`, alt: 'A cleansing scalp treatment at a black basin', focal: '50% 40%' }),
  'service.radiant-skin-solutions': { src: `${P}/service-radiant-skin-solutions.jpg`, alt: 'A calm facial room at Classy with a prepared treatment bed', focal: '50% 55%' },
  'service.hair-botox-treatment': stock({ src: `${P}/service-hair-botox-treatment.jpg`, alt: 'A nourishing hair wash and scalp massage at the basin', focal: '50% 35%' }),
  'service.hair-glossing': stock({ src: `${P}/service-hair-glossing.jpg`, alt: 'Long, glossy, smooth brunette hair', focal: '50% 30%' }),
  'service.hair-textures': stock({ src: `${P}/service-hair-textures.jpg`, alt: 'Black-and-white close-up of long, textured hair', focal: '50% 40%' }),
  'service.bridal-makeup': stock({ src: `${P}/service-bridal-makeup.jpg`, alt: 'A bride in a red lehenga holding red roses', focal: '50% 25%' }),
  'service.hd-makeup': stock({ src: `${P}/service-hd-makeup.jpg`, alt: 'A soft, luminous HD makeup look with kundan jewellery', focal: '50% 30%' }),
  'service.airbrush-makeup': stock({ src: `${P}/service-airbrush-makeup.jpg`, alt: 'A seamless, polished makeup look with statement jewellery', focal: '50% 30%' }),
  // Brand logos: client-supplied logo sheet (October 2026), cut into one transparent PNG per brand.
  ...Object.fromEntries(brands.map((b) => [`brand.${b.id}`, { src: `/media/brands/${b.id}.png`, alt: b.name }])),
}

const staticSlots: MediaSlot[] = [
  // Global
  slot({ id: 'logoWordmark', kind: 'logo', purpose: 'Header and footer logo', ratio: '4:1', size: 'SVG', alt: 'Classy Unisex Salon' }),
  slot({ id: 'logoMark', kind: 'logo', purpose: 'Favicon, menu, share image', ratio: '1:1', size: 'SVG + 512px PNG', alt: 'Classy Unisex Salon' }),
  slot({ id: 'logoSign', required: false, purpose: 'The illuminated emblem in the salon (brand moment)', ratio: '1:1', size: '1200×1200', alt: 'The Classy Salon emblem' }),

  // Home — hero
  slot({ id: 'heroSlideHair', purpose: 'Home hero slide 1: hair', ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Hair styling at Classy Unisex Salon' }),
  slot({ id: 'heroSlideSkin', purpose: 'Home hero slide 2: skin', ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Skin care at Classy Unisex Salon' }),
  slot({ id: 'heroSlideMakeup', purpose: 'Home hero slide 3: makeup', ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Makeup at Classy Unisex Salon' }),
  ...[1, 2, 3, 4].map((n) =>
    slot({ id: `heroSlide0${n}`, purpose: `Home hero photo slider, slide ${n} (salon and model photos alternate)`, ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Classy Unisex Salon' }),
  ),
  slot({ id: 'heroVideo', kind: 'video', required: false, purpose: 'Optional hero loop, desktop only (8–15 s)', ratio: '16:9', size: '1920×1080, ≤2.5 MB', alt: 'Inside Classy Unisex Salon' }),

  // Home — chapters
  slot({ id: 'introPortrait', purpose: 'Intro arched portrait', ratio: '4:5', size: '1200×1500', mobileSize: '800×1000', alt: 'Classy Unisex Salon interior' }),
  slot({ id: 'introDetail', purpose: 'Intro overlapping detail', ratio: '1:1', size: '900×900', mobileSize: '600×600', alt: 'Salon detail at Classy' }),
  slot({ id: 'serviceHairImage', purpose: 'Service group: Hair', ratio: '4:5', size: '1200×1500', mobileSize: '800×1000', alt: 'Hair services at Classy' }),
  slot({ id: 'serviceSkinImage', purpose: 'Service group: Skin', ratio: '4:5', size: '1200×1500', mobileSize: '800×1000', alt: 'Skin services at Classy' }),
  slot({ id: 'serviceMakeupImage', purpose: 'Service group: Makeup', ratio: '4:5', size: '1200×1500', mobileSize: '800×1000', alt: 'Makeup services at Classy' }),
  ...[1, 2, 3, 4, 5].map((n) =>
    slot({ id: `salonInterior0${n}`, purpose: `The Salon strip, image ${n}`, ratio: '3:2', size: '1800×1200', mobileSize: '1080×720', alt: 'Inside Classy Unisex Salon' }),
  ),
  slot({ id: 'makeupFeature', purpose: 'Bridal & Makeup chapter lead image', ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Bridal makeup at Classy' }),
  slot({ id: 'makeupBridal', purpose: 'Makeup item: Bridal', ratio: '4:5', size: '1000×1250', mobileSize: '720×900', alt: 'Bridal makeup by Classy' }),
  slot({ id: 'makeupHD', purpose: 'Makeup item: HD', ratio: '4:5', size: '1000×1250', mobileSize: '720×900', alt: 'HD makeup by Classy' }),
  slot({ id: 'makeupAirbrush', purpose: 'Makeup item: Airbrush', ratio: '4:5', size: '1000×1250', mobileSize: '720×900', alt: 'Airbrush makeup by Classy' }),
  slot({ id: 'work01', purpose: 'Real Work, large', ratio: '4:5', size: '1600×2000', mobileSize: '1080×1350', alt: 'Work by Classy Unisex Salon' }),
  slot({ id: 'work02', purpose: 'Real Work, square', ratio: '1:1', size: '1600×1600', mobileSize: '1080×1080', alt: 'Work by Classy Unisex Salon' }),
  slot({ id: 'work03', purpose: 'Real Work, landscape', ratio: '3:2', size: '1600×1067', mobileSize: '1080×720', alt: 'Work by Classy Unisex Salon' }),
  slot({ id: 'work04', purpose: 'Real Work, square', ratio: '1:1', size: '1600×1600', mobileSize: '1080×1080', alt: 'Work by Classy Unisex Salon' }),
  slot({ id: 'work05', purpose: 'Real Work, tall', ratio: '9:16', size: '1080×1920', alt: 'Work by Classy Unisex Salon' }),
  ...[1, 2, 3, 4, 5, 6].map((n) =>
    slot({ id: `instagram0${n}`, purpose: `Instagram mosaic tile ${n}`, ratio: n % 2 ? '1:1' : '4:5', size: '1080', mobileSize: '720', alt: 'From the Classy Instagram' }),
  ),
  slot({ id: 'salonExterior', purpose: 'Visit Us: salon exterior', ratio: '3:2', size: '1600×1067', mobileSize: '1080×720', alt: 'Classy Unisex Salon exterior, Jagatpura' }),

  // Other pages
  slot({ id: 'aboutHero', purpose: 'About hero', ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Classy Unisex Salon' }),
  slot({ id: 'aboutStory', purpose: 'About: story, arched portrait', ratio: '4:5', size: '1200×1500', mobileSize: '800×1000', alt: 'Inside Classy Unisex Salon' }),
  slot({ id: 'aboutStoryDetail', purpose: 'About: story, detail', ratio: '1:1', size: '900×900', mobileSize: '600×600', alt: 'Detail at Classy Unisex Salon' }),
  slot({ id: 'aboutApproach', purpose: 'About: approach, wide image', ratio: '21:9', mobileRatio: '4:5', size: '2400×1030', mobileSize: '1080×1350', alt: 'Work in progress at Classy Unisex Salon' }),
  slot({ id: 'aboutSpace01', purpose: 'About: the space, large', ratio: '4:5', size: '1600×2000', mobileSize: '1080×1350', alt: 'The salon space at Classy' }),
  slot({ id: 'aboutSpace02', purpose: 'About: the space, landscape', ratio: '3:2', size: '1800×1200', mobileSize: '1080×720', alt: 'Styling stations at Classy' }),
  slot({ id: 'aboutSpace03', purpose: 'About: the space, detail', ratio: '1:1', size: '1200×1200', mobileSize: '800×800', alt: 'Salon detail at Classy' }),
  slot({ id: 'aboutCta', purpose: 'About: closing booking chapter, arched portrait', ratio: '4:5', size: '1200×1500', mobileSize: '800×1000', alt: 'Classy Unisex Salon' }),
  slot({ id: 'servicesHero', purpose: 'Our Services hero', ratio: '21:9', mobileRatio: '4:5', size: '2400×1030', mobileSize: '1080×1350', alt: 'Services at Classy Unisex Salon' }),
  slot({ id: 'galleryFeature', purpose: 'Gallery featured item', ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Featured work at Classy' }),
  ...[1, 2, 3].map((n) =>
    slot({ id: `beforeAfter0${n}`, required: false, purpose: `Before & After pair ${n} (consent required)`, ratio: '4:5', size: '1200×1500 each', mobileSize: '800×1000', alt: 'Before and after at Classy' }),
  ),
  slot({ id: 'reviewsGoogle', required: false, purpose: 'Reviews: image beside the Google reviews link', ratio: '4:3', size: '1600×1200', alt: 'Classy Unisex Salon' }),
  slot({ id: 'reviewsHero', purpose: 'Reviews hero', ratio: '21:9', mobileRatio: '4:5', size: '2400×1030', mobileSize: '1080×1350', alt: 'Classy Unisex Salon' }),
  slot({ id: 'contactVisit', purpose: 'Contact: map preview (before the map is loaded)', ratio: '16:9', mobileRatio: '4:5', size: '2400×1350', mobileSize: '1080×1350', alt: 'Inside Classy Unisex Salon' }),
  slot({ id: 'contactHero', purpose: 'Contact hero', ratio: '3:2', mobileRatio: '4:5', size: '2000×1333', mobileSize: '1080×1350', alt: 'Classy Unisex Salon, Jagatpura' }),
  slot({ id: 'notFoundImage', purpose: '404 page image', ratio: '16:9', mobileRatio: '4:5', size: '2000×1125', mobileSize: '1080×1350', alt: 'Classy Unisex Salon' }),
]

/** One optional image per service item (Our Services rows + Hair Treatments rail). */
const serviceSlots: MediaSlot[] = allServices.map((s) =>
  slot({ id: `service.${s.id}`, required: false, purpose: `Service row: ${s.sourceLabel}`, ratio: '4:3', size: '960×720', mobileSize: '640×480', alt: s.sourceLabel }),
)

/**
 * Brand logo files. Required for release; only official/approved files supplied
 * by the client (brand kits). Until then every brand renders as a marked logo
 * placeholder with its name in type, and the production build is blocked.
 */
const brandSlots: MediaSlot[] = brands.map((b) =>
  slot({ id: `brand.${b.id}`, kind: 'logo', required: b.kind === 'logo', purpose: `${b.name} logo (official/approved file from the client only)`, ratio: '3:1', size: 'SVG or transparent PNG ≥600px wide', alt: b.name }),
)

/** One portrait per approved team member (only exists once the client approves people). */
const teamSlots: MediaSlot[] = teamMembers.map((m) =>
  slot({ id: `team.${m.id}`, purpose: `Team: ${m.name}`, ratio: '4:5', size: '1200×1500', mobileSize: '800×1000', alt: `${m.name}, ${m.role}`, ...(m.photo && { src: m.photo }) }),
)

function applySupplied(s: MediaSlot): MediaSlot {
  const extra = supplied[s.id]
  return extra ? { ...s, ...extra, people: extra.license ? false : (extra.people ?? PEOPLE.has(s.id)), status: 'supplied' } : s
}

export const mediaSlots: MediaSlot[] = [...staticSlots, ...serviceSlots, ...brandSlots, ...teamSlots].map(applySupplied)

const byId = new Map(mediaSlots.map((s) => [s.id, s]))

export function getSlot(id: string): MediaSlot {
  const s = byId.get(id)
  if (!s) throw new Error(`Unknown media slot "${id}". Add it to src/data/media.ts.`)
  return s
}

export const mediaStats = {
  total: mediaSlots.length,
  supplied: mediaSlots.filter((s) => s.status === 'supplied').length,
}
