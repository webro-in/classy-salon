/**
 * Home hero photo slider (client brief, October 2026): salon and model photos
 * alternate, one at a time, sliding horizontally. Photos only: no text per slide.
 * Each id is a media slot in src/data/media.ts (desktop 16:9 + mobile 4:5 files).
 */
export interface HeroSlide {
  /** Media slot id. */
  slot: string
  kind: 'salon' | 'model'
}

export const heroSlides: HeroSlide[] = [
  { slot: 'heroSlide01', kind: 'salon' },
  { slot: 'heroSlide02', kind: 'model' },
  { slot: 'heroSlide03', kind: 'salon' },
  { slot: 'heroSlide04', kind: 'model' },
]
