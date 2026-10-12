import { Seo } from '@/components/seo/Seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildGalleryPageJsonLd } from '@/config/seo'
import { GalleryHero } from '@/sections/gallery/GalleryHero'
import { GalleryGrid } from '@/sections/gallery/GalleryGrid'
import { GalleryCta } from '@/sections/gallery/GalleryCta'

/**
 * Gallery (docs/DESIGN.md §8). White hero with the featured bridal image ·
 * sticky filters (populated categories only) · editorial masonry grid ·
 * full-screen viewer · cream Instagram/WhatsApp chapter → dark footer.
 */
export function Component() {
  return (
    <>
      <Seo route="gallery" />
      <JsonLd data={buildGalleryPageJsonLd()} />
      <GalleryHero />
      <GalleryGrid />
      <GalleryCta />
    </>
  )
}
