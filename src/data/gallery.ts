import raw from '@content/gallery.json'
import { parseContent } from '@/lib/content'
import { gallerySchema, type GalleryCategoryId, type GalleryItem } from '@/types/content'

const data = parseContent('gallery', gallerySchema, raw)

export const galleryItems: GalleryItem[] = data.items
/** Only categories that contain items are ever shown (e.g. Before & After stays hidden until consented pairs exist). */
export const galleryCategories = data.categories
  .map((c) => ({ ...c, count: data.items.filter((i) => i.category === c.id).length }))
  .filter((c) => c.count > 0)
export const galleryCategoryDefinitions = data.categories
export const emptyGalleryCategories = data.categories.filter((c) => !data.items.some((i) => i.category === c.id))

export type GalleryFilter = 'all' | GalleryCategoryId

export function itemsFor(filter: GalleryFilter): GalleryItem[] {
  return filter === 'all' ? orderedGalleryItems : orderedGalleryItems.filter((i) => i.category === filter)
}

export function categoryLabel(id: GalleryCategoryId): string {
  return data.categories.find((c) => c.id === id)?.label ?? id
}

export function isGalleryFilter(value: string | null): value is GalleryFilter {
  return value === 'all' || data.categories.some((c) => c.id === value && galleryCategories.some((g) => g.id === c.id))
}

/* ------------------------------ The Classy Edit ----------------------------- */

export type GalleryTheme = 'bridal' | 'hair' | 'beauty' | 'inside'

/** Editorial sections of the All view, in order. */
export const galleryThemes: Array<{ id: GalleryTheme; title: string; text: string }> = [
  { id: 'bridal', title: 'Bridal Beauty', text: 'Timeless makeup. Detailed artistry. Effortless elegance.' },
  { id: 'hair', title: 'Hair Artistry', text: 'From precision cuts to statement styling, every detail is considered.' },
  { id: 'beauty', title: 'Beauty & Transformation', text: 'Looks designed to complement your personality, features and occasion.' },
  { id: 'inside', title: 'Inside Classy', text: 'A glimpse into the space, atmosphere and experience behind the chair.' },
]

export function galleryTheme(item: GalleryItem): GalleryTheme {
  const id = item.id
  if (/bride|bridal/.test(id)) return 'bridal'
  if (item.category === 'space') return 'inside'
  if (/hair|sleek|straight|scalp|wash|glossy|textured|smoothing/.test(id)) return 'hair'
  return 'beauty'
}

/** Hover caption (title + line) for each tile, by theme. */
export function galleryCaption(item: GalleryItem): { title: string; line: string } {
  const theme = galleryTheme(item)
  if (theme === 'bridal') return { title: 'Bridal Beauty', line: 'Traditional bridal makeup & styling' }
  if (theme === 'hair') return { title: 'Hair Transformation', line: 'Precision cut, colour & styling' }
  if (theme === 'inside') return { title: 'The Classy Experience', line: 'Our salon, our craft, your moment' }
  if (/nail/.test(item.id)) return { title: 'Nail Artistry', line: 'Detailed designs with a polished finish' }
  return { title: 'Signature Makeup', line: 'Refined beauty with a timeless finish' }
}

/** Items in display order: grouped by editorial section (stable within each), so the viewer follows the grid. */
export const orderedGalleryItems: GalleryItem[] = galleryThemes.flatMap((t) => data.items.filter((i) => galleryTheme(i) === t.id))

/** Licensed stock is shown as inspiration, never as the salon's own work, so it carries no salon location. */
export const isOwnMedia = (item: GalleryItem) => !item.license

/** Gallery page copy (client-approved wording, 2026-10-06). */
export const galleryPageCopy = {
  hero: {
    eyebrow: 'Gallery',
    title: 'The Classy Edit',
    lead: 'Where beauty, craftsmanship and individuality come together.',
    intro: 'Explore our latest work, transformations and salon moments — from bridal artistry and statement hairstyles to everyday looks designed around you.',
  },
  grid: {
    title: 'A visual showcase of our artistry, atmosphere & transformations.',
    count: (n: number) => `${n} featured ${n === 1 ? 'moment' : 'moments'}`,
  },
  filters: { label: 'Filter the gallery', all: 'All' },
  viewer: { label: 'Gallery viewer', close: 'Close', previous: 'Previous', next: 'Next' },
  cta: {
    eyebrow: 'Your next look awaits',
    title: 'Ready for your Classy experience?',
    lead: 'Book your appointment and let our artists create a look made for you.',
    book: 'Book now',
    services: 'Explore our services',
  },
} as const
