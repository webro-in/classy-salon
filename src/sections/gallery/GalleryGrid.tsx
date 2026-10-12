import { useCallback, useEffect, useMemo, useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Lightbox, type LightboxItem } from '@/components/gallery/Lightbox'
import { categoryLabel, galleryCaption, galleryPageCopy, galleryTheme, galleryThemes, isGalleryFilter, itemsFor, type GalleryFilter } from '@/data/gallery'
import { trackEvent } from '@/lib/analytics'
import type { GalleryItem as Item } from '@/types/content'
import { GalleryFilters } from './GalleryFilters'
import { GalleryItem } from './GalleryItem'

/** Display ratio for editorial layouts (the photo is cropped to fit with object-fit). */
const LAYOUT_RATIO = { wide: [4, 3], full: [21, 9] } as const

/**
 * "The Classy Edit": filterable editorial masonry + full-screen viewer.
 * All view: four sections (Bridal Beauty, Hair Artistry, Beauty & Transformation,
 * Inside Classy); a filter shows one flat masonry. Every item is in the static
 * HTML; `?view=work` deep-links a filter (read after hydration).
 */
export function GalleryGrid() {
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get('view')
    if (isGalleryFilter(view)) setFilter(view)
  }, [])

  const changeFilter = useCallback((f: GalleryFilter) => {
    setFilter(f)
    const url = new URL(window.location.href)
    if (f === 'all') url.searchParams.delete('view')
    else url.searchParams.set('view', f)
    window.history.replaceState(window.history.state, '', url)
    trackEvent('gallery_filter', { filter: f })
  }, [])

  const items = useMemo(() => itemsFor(filter), [filter])
  const viewerItems: LightboxItem[] = useMemo(
    () => items.map((i) => ({ id: i.id, kind: i.kind, src: i.src, thumb: i.thumb, poster: i.poster, alt: i.alt, ratio: i.ratio, caption: galleryCaption(i).title })),
    [items],
  )
  const indexOf = (item: Item) => items.indexOf(item)

  const tiles = (list: Item[], eagerFirst: boolean) =>
    list.map((item, i) => {
      const [nw, nh] = item.ratio.split(':').map(Number) as [number, number]
      const layout = item.layout ?? (nw > nh ? 'wide' : undefined)
      const [w, h] = layout && item.layout ? LAYOUT_RATIO[layout] : [nw, nh]
      // Row span ∝ height/width at the tile's column span, +2 rows for the gap (added as padding).
      // Full-row tiles fall back to a 4:3 single-column tile below 3 columns.
      const span = layout === 'full' ? 32 : Math.round((40 * h) / w) + 2
      const spanWide = Math.round((80 * h) / w) + 2
      const spanFull = Math.round((120 * h) / w) + 2
      return (
        <li
          key={item.id}
          data-wide={layout === 'wide' ? '' : undefined}
          data-full={layout === 'full' ? '' : undefined}
          style={{ ['--span' as string]: span, ['--span-wide' as string]: spanWide, ['--span-full' as string]: spanFull }}
        >
          <GalleryItem item={item} large={Boolean(layout)} eager={eagerFirst && i < 4} fill onOpen={() => { setOpen(indexOf(item)); trackEvent('gallery_open', { item: item.id }) }} />
        </li>
      )
    })

  return (
    <>
      <GalleryFilters active={filter} onChange={changeFilter} />
      <Section tone="ivory" spacing="small" labelledBy="gallery-grid-title">
        <Container>
          <div className="flex flex-col gap-4 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
            <h2 id="gallery-grid-title" className="max-w-[30ch] font-display text-h3 text-balance">
              {filter === 'all' ? galleryPageCopy.grid.title : categoryLabel(filter)}
            </h2>
            <p className="label tabular-nums text-fg-muted" aria-live="polite" data-gallery-count>{galleryPageCopy.grid.count(items.length)}</p>
          </div>

          <div id="gallery-grid" key={filter} className="motion-safe:animate-[hero-fade_var(--duration-page)_var(--ease-out)]">
            {filter === 'all' ? (
              galleryThemes.map((t, k) => {
                const list = items.filter((i) => galleryTheme(i) === t.id)
                if (list.length === 0) return null
                return (
                  <section key={t.id} aria-labelledby={`edit-${t.id}`} className="mt-14 first:mt-10 lg:mt-20" data-gallery-section={t.id}>
                    <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
                      <h3 id={`edit-${t.id}`} className="font-display text-h2">{t.title}</h3>
                      <p className="max-w-[44ch] text-body text-fg-muted md:text-right">{t.text}</p>
                    </div>
                    <ul className="gallery-grid">{tiles(list, k === 0)}</ul>
                  </section>
                )
              })
            ) : (
              <ul className="gallery-grid mt-10">{tiles(items, true)}</ul>
            )}
          </div>
        </Container>
      </Section>
      <Lightbox items={viewerItems} index={open} onChange={setOpen} onClose={() => setOpen(null)} labels={galleryPageCopy.viewer} />
    </>
  )
}
