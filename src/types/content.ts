import { z } from 'zod'

/**
 * Content field states
 * - verified: client-approved fact → shipped
 * - draft:    WEBRO-written copy awaiting client review → shipped, listed by content:check
 * - pending:  CLIENT DATA REQUIRED → never shipped; dev marker only
 */
export const pendingSchema = z.object({ status: z.literal('pending'), note: z.string().min(1) })

export const verifiedField = <T extends z.ZodType>(value: T) =>
  z.discriminatedUnion('status', [
    z.object({ status: z.literal('verified'), value, checkedOn: z.string().optional() }),
    pendingSchema,
  ])

export const copyField = z.discriminatedUnion('status', [
  z.object({ status: z.literal('verified'), value: z.string().min(1) }),
  z.object({ status: z.literal('draft'), value: z.string().min(1) }),
  pendingSchema,
])

export type Pending = z.infer<typeof pendingSchema>
export type CopyField = z.infer<typeof copyField>
export type Field<T> = { status: 'verified'; value: T; checkedOn?: string } | Pending

/* ---------------------------------- Business --------------------------------- */

const addressSchema = z.object({
  streetAddress: z.string(),
  locality: z.string(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  country: z.literal('IN'),
})

const dayEnum = z.enum(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'])
const hoursSchema = z.array(
  z.object({
    days: z.array(dayEnum).min(1),
    opens: z.string().regex(/^\d{2}:\d{2}$/),
    closes: z.string().regex(/^\d{2}:\d{2}$/),
  }),
)

const ratingSchema = z.object({
  value: z.number().min(1).max(5),
  count: z.number().int().positive(),
  /** Exactly how the count is displayed, e.g. "232+" — set by the client-verified figure. */
  countLabel: z.string(),
  source: z.literal('Google'),
})

const e164 = z.string().regex(/^\+\d{10,15}$/, 'Use E.164 format, e.g. +91XXXXXXXXXX')

export const businessSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  descriptor: z.string(),
  address: verifiedField(addressSchema),
  phone: verifiedField(e164),
  whatsapp: verifiedField(e164),
  email: verifiedField(z.email()),
  hours: verifiedField(hoursSchema),
  rating: verifiedField(ratingSchema),
  geo: verifiedField(z.object({ lat: z.number(), lng: z.number() })),
  mapsUrl: verifiedField(z.url()),
  instagram: z.array(z.object({ id: z.string(), handle: z.string(), url: verifiedField(z.url()) })),
  story: copyField,
  /** Year the salon was established (client-supplied). */
  established: verifiedField(z.string().regex(/^\d{4}$/)).optional(),
  legalName: verifiedField(z.string()),
})

export type Business = z.infer<typeof businessSchema>
export type PostalAddress = z.infer<typeof addressSchema>
export type OpeningHours = z.infer<typeof hoursSchema>
export type Rating = z.infer<typeof ratingSchema>

/* ---------------------------------- Services --------------------------------- */

const serviceItemSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    /** Exact wording from the client's handwritten sheet. */
    sourceLabel: z.string().min(1),
    /** Suggested correction, displayed only after the client confirms it. */
    proposedLabel: z.string().optional(),
    labelStatus: z.enum(['as-source', 'needs-confirmation', 'confirmed']),
    flag: z.string().optional(),
    description: copyField,
    /** Short "what it's for" points shown when a row is expanded. WEBRO draft until the client verifies. No prices, durations, ingredients or results promises. */
    highlights: z.object({ status: z.enum(['verified', 'draft']), value: z.array(z.string().min(1)).min(1).max(5) }).optional(),
  })
  .refine((s) => s.labelStatus !== 'needs-confirmation' || Boolean(s.flag), {
    message: 'Items needing confirmation must explain why in `flag`.',
  })

export const servicesSchema = z.object({
  groups: z.array(
    z.object({
      id: z.enum(['hair', 'skin', 'makeup']),
      number: z.string().regex(/^\d{2}$/),
      title: z.string(),
      summary: copyField,
      items: z.array(serviceItemSchema).min(1),
    }),
  ),
})

export type ServiceItem = z.infer<typeof serviceItemSchema>
export type ServiceGroup = z.infer<typeof servicesSchema>['groups'][number]
export type ServiceGroupId = ServiceGroup['id']

/* ----------------------------------- Brands ---------------------------------- */

export const brandsSchema = z.object({
  heading: z.string(),
  brands: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      name: z.string(),
      kind: z.enum(['logo', 'name']),
      /** No partnership/endorsement claims are supported. Change only with client-supplied proof. */
      claim: z.literal('none'),
      note: z.string().optional(),
    }),
  ),
})

export type Brand = z.infer<typeof brandsSchema>['brands'][number]

/* ---------------------------------- Reviews ---------------------------------- */

/**
 * A genuine client review, exactly as the reviewer wrote it (no rewriting,
 * merging or summarising), published with the salon's approval. Optional
 * fields are filled ONLY when the supplied source shows them.
 */
export const reviewSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Verbatim review text. */
  quote: z.string().min(10),
  /** Name exactly as shown on the source (e.g. the Google display name or first name). */
  author: z.string().min(2),
  /** Star rating shown on the source, if any (1–5). */
  rating: z.number().min(1).max(5).multipleOf(0.5).optional(),
  source: z.literal('Google').optional(),
  /** ISO date (YYYY-MM-DD) only when the source shows an exact date. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Relative age exactly as the source shows it (e.g. Google's "8 months ago"), when no exact date is shown. */
  dateLabel: z.string().max(40).optional(),
  featured: z.boolean().optional(),
  /** Provenance + approval: where the text came from and that the client approved publishing it. */
  approval: z.object({
    permission: z.literal(true),
    verbatim: z.literal(true),
    sourceRef: z.string().min(3),
    approvedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
})

export const reviewsSchema = z.object({
  googleReviewsUrl: verifiedField(z.url()),
  reviews: z.array(reviewSchema),
})

export type Review = z.infer<typeof reviewSchema>

/* ---------------------------------- Gallery ---------------------------------- */

export const galleryCategoryId = z.enum(['work', 'space', 'looks', 'videos', 'before-after'])

export const gallerySchema = z.object({
  categories: z.array(z.object({ id: galleryCategoryId, label: z.string() })),
  items: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      category: galleryCategoryId,
      kind: z.enum(['image', 'video']),
      /** Full-size file (lightbox). Real Classy media only. */
      src: z.string().startsWith('/media/'),
      /** Grid-size image (images: smaller copy; videos: poster). */
      thumb: z.string().startsWith('/media/'),
      poster: z.string().startsWith('/media/').optional(),
      alt: z.string().min(1),
      /** Natural size of the full file, "W:H" (keeps the grid stable while loading). */
      ratio: z.string().regex(/^\d+:\d+$/),
      featured: z.boolean().optional(),
      /** An identifiable person is shown: publishing needs content/consent.json → peopleInMedia verified. */
      people: z.boolean(),
      /** Licensed stock (client-selected), e.g. 'Pexels'. Only allowed in the 'looks' category. */
      license: z.string().optional(),
      /** Editorial layout in the masonry grid: 'wide' spans two columns, 'full' spans the whole row (desktop). */
      layout: z.enum(['wide', 'full']).optional(),
    }).refine((i) => !i.license || i.category === 'looks', { message: 'Licensed stock may only appear under Looks, never as Classy work.' }),
  ),
})

export type GalleryItem = z.infer<typeof gallerySchema>['items'][number]
export type GalleryCategoryId = z.infer<typeof galleryCategoryId>

/* ---------------------------------- Consent ---------------------------------- */

export const consentSchema = z.object({
  /** Client confirms everyone identifiable in the supplied photos/videos agreed to appear on the website. */
  peopleInMedia: verifiedField(z.literal(true)),
})

/* ------------------------------------ FAQ ------------------------------------ */

export const faqSchema = z.object({
  items: z.array(z.object({ id: z.string(), question: z.string(), answer: z.string() })),
})

/* ----------------------------------- About ----------------------------------- */

const paragraphs = z.array(z.string().min(1)).min(1)

/** Client-supplied About/Home copy (verbatim). */
export const aboutSchema = z.object({
  intro: z.object({ eyebrow: z.string(), title: z.string(), paragraphs }),
  storyLine: z.string(),
  philosophyTitle: z.string(),
  philosophy: copyField,
  approach: z.object({ title: z.string(), lead: z.string(), paragraphs }),
  defines: z.object({ title: z.string(), items: z.array(z.object({ title: z.string(), text: z.string() })).min(1) }),
  commitment: z.object({ title: z.string(), line: z.string(), paragraphs }),
  tagline: z.string(),
})

/* ------------------------------------ Team ----------------------------------- */

export const teamSchema = z.object({
  members: z.array(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      name: z.string().min(1),
      role: z.string().min(1),
      /** Client confirmed the person's role. */
      approved: z.literal(true),
      /** Person agreed to name and photo being published. */
      consent: z.literal(true),
      photo: z.string().optional(),
    }),
  ),
})

export type TeamMember = z.infer<typeof teamSchema>['members'][number]

/* ----------------------------------- Legal ----------------------------------- */

/**
 * Client/legal inputs for the Privacy Policy and Terms (the legal business
 * name lives in business.json → legalName). Nothing here is invented: pending
 * values show [LEGAL DETAILS REQUIRED] in preview and block production.
 */
export const legalSchema = z.object({
  /** Date the reviewed policies take effect (YYYY-MM-DD). */
  effectiveDate: verifiedField(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  /** Governing law / jurisdiction sentence for the Terms, as confirmed by the client or their adviser. */
  governingLaw: verifiedField(z.string().min(10)),
  /**
   * The salon's own appointment policy (cancellation, late arrival, deposits…),
   * only if it has one. Optional: pending = section omitted in production.
   */
  appointmentPolicy: copyField,
})
