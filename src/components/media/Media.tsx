import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { getSlot, type MediaSlot, type Ratio } from '@/data/media'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { trackEvent } from '@/lib/analytics'
import { cx } from '@/lib/cx'
import { MediaPlaceholder } from './MediaPlaceholder'

const toCss = (r: Ratio) => r.replace(':', ' / ')

interface MediaProps {
  /** Slot id from src/data/media.ts — never a raw path. */
  slot: string
  /** 'ratio' (default): box sized by the slot ratio. 'fill': fills a positioned parent. */
  fit?: 'ratio' | 'fill'
  /** Arched top: the salon-mirror motif. */
  shape?: 'rect' | 'arch'
  /** Above-the-fold media: eager load + high fetch priority (hero/LCP only). */
  priority?: boolean
  /** Load immediately (no lazy loading) without raising fetch priority, e.g. carousel slides about to slide in. */
  eager?: boolean
  sizes?: string
  /** Video only: autoplay muted loop (disabled for reduced motion / data saver). */
  autoplay?: boolean
  /**
   * Presentation crop for this placement (e.g. a portrait card using a 4:3 slot).
   * The slot keeps its own ratio for other placements; real photos are cropped with object-fit.
   */
  aspect?: Ratio
  className?: string
  imgClassName?: string
}

/**
 * Resolves a media slot to an image, video, logo or placeholder.
 * - Missing asset → placeholder at the final ratio
 * - Load failure  → placeholder + `media_error` analytics event (page never breaks)
 * - Supplied      → lazy image/video over a tonal skeleton, fading in on load
 */
export function Media({ slot: slotId, fit = 'ratio', shape = 'rect', priority = false, eager = false, sizes = '100vw', autoplay = false, aspect, className, imgClassName }: MediaProps) {
  const slot = getSlot(slotId)
  const [failed, setFailed] = useState(false)

  const style = fit === 'ratio'
    ? ({ '--ar': toCss(aspect ?? slot.ratio), '--ar-m': toCss(aspect ?? slot.mobileRatio ?? slot.ratio) } as CSSProperties)
    : undefined

  function onError() {
    setFailed(true)
    trackEvent('media_error', { slot: slot.id })
  }

  return (
    <div
      style={style}
      className={cx(
        'overflow-hidden bg-(--tone-placeholder)',
        // Never combine `relative` with `absolute`: fill mode must cover its parent.
        fit === 'ratio' ? 'relative aspect-(--ar-m) md:aspect-(--ar) w-full' : 'absolute inset-0 h-full w-full',
        shape === 'arch' && 'arch',
        className,
      )}
    >
      {!slot.src || failed ? (
        <MediaPlaceholder slot={slot} reason={failed ? 'error' : 'missing'} captionAt={fit === 'fill' ? 'top' : 'bottom'} displayRatio={aspect} />
      ) : slot.kind === 'video' ? (
        <SlotVideo slot={slot} autoplay={autoplay} priority={priority} onError={onError} className={imgClassName} />
      ) : (
        <SlotImage slot={slot} priority={priority} eager={eager} sizes={sizes} onError={onError} className={imgClassName} />
      )}
    </div>
  )
}

function SlotImage({ slot, priority, eager, sizes, onError, className }: { slot: MediaSlot; priority: boolean; eager: boolean; sizes: string; onError: () => void; className?: string | undefined }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  // A prerendered image can finish loading before React hydrates and attaches
  // onLoad; without this check it would stay at opacity 0 forever.
  useEffect(() => {
    const img = imgRef.current
    if (!img?.complete) return
    // Likewise, a request that already failed before hydration never fires onError.
    if (img.naturalWidth > 0) setLoaded(true)
    else if (img.currentSrc || img.src) {
      // Confirm with a probe rather than trusting `complete` alone (some engines
      // report pending lazy images as complete): a cached failure errors at once.
      const probe = new Image()
      probe.onload = () => setLoaded(true)
      probe.onerror = onError
      probe.src = img.currentSrc || img.src
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [])
  return (
    <picture>
      {slot.mobileSrc && <source media="(max-width: 767px)" srcSet={slot.mobileSrc} />}
      <img
        ref={imgRef}
        src={slot.src}
        alt={slot.alt}
        sizes={sizes}
        loading={priority || eager ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={onError}
        style={{ objectPosition: slot.focal }}
        className={cx(
          'absolute inset-0 h-full w-full',
          slot.kind === 'logo' ? 'object-contain p-[12%]' : 'object-cover',
          'transition-opacity duration-(--duration-reveal) ease-(--ease-out)',
          loaded || priority ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </picture>
  )
}

function SlotVideo({ slot, autoplay, priority, onError, className }: { slot: MediaSlot; autoplay: boolean; priority: boolean; onError: () => void; className?: string | undefined }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || !autoplay) return
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (reduced || saveData) {
      video.pause()
      return
    }
    video.play().catch(() => {
      // Autoplay blocked: the poster stays visible.
    })
  }, [autoplay, reduced])

  return (
    <video
      ref={ref}
      muted
      playsInline
      loop={autoplay}
      controls={!autoplay}
      preload={priority ? 'auto' : 'none'}
      poster={slot.poster}
      aria-label={slot.alt}
      onError={onError}
      style={{ objectPosition: slot.focal }}
      className={cx('absolute inset-0 h-full w-full object-cover', className)}
    >
      <source src={slot.src} type="video/mp4" />
    </video>
  )
}
