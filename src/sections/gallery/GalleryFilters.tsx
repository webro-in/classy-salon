import { galleryCategories, galleryItems, galleryPageCopy, type GalleryFilter } from '@/data/gallery'
import { cx } from '@/lib/cx'

/**
 * Sticky filter bar under the header (same visual language as the Services
 * category nav). Only populated categories appear. Toggle buttons with
 * aria-pressed; the rail scrolls inside itself on small screens.
 */
export function GalleryFilters({ active, onChange }: { active: GalleryFilter; onChange: (f: GalleryFilter) => void }) {
  const options: Array<{ id: GalleryFilter; label: string; count: number }> = [
    { id: 'all', label: galleryPageCopy.filters.all, count: galleryItems.length },
    ...galleryCategories.map((c) => ({ id: c.id, label: c.label, count: c.count })),
  ]
  return (
    <div className="tone-ivory sticky top-(--spacing-header) z-30 border-b border-rule bg-tone/95 backdrop-blur-sm supports-[backdrop-filter]:bg-tone/85" data-gallery-filters>
      <div className="container-page">
        <div role="group" aria-label={galleryPageCopy.filters.label} className="-mx-1 flex snap-x gap-2 overflow-x-auto py-3 [scrollbar-width:none] lg:mx-0 lg:gap-12 lg:overflow-visible lg:py-0 [&::-webkit-scrollbar]:hidden" data-chip-rail>
          {options.map((o) => {
            const isActive = active === o.id
            return (
              <div key={o.id} className="shrink-0 snap-start px-1 lg:px-0">
                <button
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="gallery-grid"
                  onClick={() => onChange(o.id)}
                  className={cx(
                    'inline-flex min-h-11 items-center gap-2.5 transition-colors duration-(--duration-ui)',
                    'rounded-pill border px-4 lg:rounded-none lg:border-0 lg:px-0',
                    isActive ? 'border-fg bg-fg text-tone lg:bg-transparent lg:text-fg' : 'border-rule text-fg-muted hover:text-fg',
                    'lg:relative lg:min-h-16 lg:after:absolute lg:after:inset-x-0 lg:after:bottom-0 lg:after:h-px lg:after:origin-left lg:after:bg-fg lg:after:transition-transform lg:after:duration-(--duration-ui)',
                    isActive ? 'lg:after:scale-x-100' : 'lg:after:scale-x-0 lg:hover:after:scale-x-100',
                  )}
                >
                  <span className="label">{o.label}</span>
                  <span className={cx('font-display text-[1.0625rem] tabular-nums', isActive ? 'lg:text-accent' : '')}>{o.count}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
