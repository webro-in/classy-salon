import { PATHS } from '@/app/paths'
import { PageHero } from '@/components/sections/PageHero'
import { galleryPageCopy } from '@/data/gallery'

/** Gallery opening: breadcrumbs, "The Classy Edit", tagline, intro and the featured bridal image. */
export function GalleryHero() {
  const c = galleryPageCopy.hero
  return (
    <PageHero
      trail={[{ name: 'Home', path: PATHS.home }, { name: 'Gallery', path: PATHS.gallery }]}
      eyebrow={c.eyebrow}
      title={c.title}
      lead={c.lead}
      slot="galleryFeature"
      aside={<p className="max-w-[48ch] text-body text-fg-muted md:text-right">{c.intro}</p>}
    />
  )
}
