import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { categoryLabel, galleryCaption, isOwnMedia } from '@/data/gallery'
import { cx } from '@/lib/cx'
import type { GalleryItem as Item } from '@/types/content'

/**
 * One gallery tile: a button that opens the viewer. Sized from the item's
 * natural aspect ratio (no layout shift while loading; `fill` = grid cell height), lazy grid-size image, caption revealed on
 * hover/focus, play badge for videos.
 */
export function GalleryItem({ item, onOpen, eager = false, fill = false, large = false }: { item: Item; onOpen: () => void; eager?: boolean; fill?: boolean; large?: boolean }) {
  const [w, h] = item.ratio.split(':').map(Number) as [number, number]
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const img = ref.current
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])
  const isVideo = item.kind === 'video'
  const caption = galleryCaption(item)

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${isVideo ? 'Play video' : 'View photo'}: ${item.alt}`}
      aria-haspopup="dialog"
      data-gallery-item={item.id}
      data-category={categoryLabel(item.category)}
      data-location={isOwnMedia(item) ? 'Classy Unisex Salon' : undefined}
      className={cx('group relative block w-full overflow-hidden bg-(--tone-placeholder) text-left focus-visible:outline-offset-4', fill && 'h-full')}
      style={fill ? undefined : { aspectRatio: `${w} / ${h}` }}
    >
      <img
        ref={ref}
        src={large && item.kind === 'image' ? item.src : item.thumb}
        alt=""
        width={w}
        height={h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cx(
          'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(17_15_12/0.72)_100%)] opacity-0 transition-opacity duration-(--duration-ui) group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-on-night opacity-0 transition-[opacity,transform] duration-(--duration-ui) ease-(--ease-out) group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" data-gallery-caption>
        <span className="block font-display text-h4 leading-tight">{caption.title}</span>
        <span className="mt-1 block text-small leading-snug text-on-night/80">{caption.line}</span>
      </span>
      {isVideo && (
        <span aria-hidden="true" className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-pill bg-night px-3 py-1.5 text-on-night">
          <Icon name="play" size={14} />
          <span className="label">Video</span>
        </span>
      )}
    </button>
  )
}
