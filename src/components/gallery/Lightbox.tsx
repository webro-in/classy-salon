import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@/components/icons/Icon'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockScroll } from '@/hooks/useLockScroll'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cx } from '@/lib/cx'

export interface LightboxItem {
  id: string
  kind: 'image' | 'video'
  src: string
  thumb: string
  poster?: string | undefined
  alt: string
  ratio: string
  caption?: string
}

interface LightboxProps {
  items: LightboxItem[]
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
  labels: { label: string; close: string; previous: string; next: string }
}

const SWIPE = 50

/**
 * Full-screen viewer. Accessible modal dialog: focus moves in and is trapped,
 * Escape closes, focus returns to the opening tile. Arrow keys / buttons /
 * horizontal swipe move between items (wrapping). Images show the grid copy
 * immediately and sharpen when the full file loads; neighbours are preloaded.
 * Videos play muted with controls (no autoplay under reduced motion).
 */
export function Lightbox({ items, index, onChange, onClose, labels }: LightboxProps) {
  const open = index !== null
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => setMounted(true), [])
  useLockScroll(open)
  useFocusTrap(ref, open, onClose)

  const count = items.length
  const go = useCallback((delta: number) => {
    if (index === null || count === 0) return
    onChange((index + delta + count) % count)
  }, [index, count, onChange])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, go])

  // Preload neighbouring full-size images.
  useEffect(() => {
    if (index === null) return
    for (const d of [1, -1]) {
      const n = items[(index + d + count) % count]
      if (n?.kind === 'image') { const img = new Image(); img.src = n.src }
    }
  }, [index, items, count])

  if (!mounted || !open) return null
  const item = items[index]
  if (!item) return null
  const [w, h] = item.ratio.split(':').map(Number) as [number, number]
  const loaded = loadedSrc === item.src

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={labels.label}
      aria-describedby="lightbox-caption"
      data-lightbox
      className="tone-dark fixed inset-0 z-[100] flex flex-col bg-night text-fg"
      onTouchStart={(e) => { const t = e.touches[0]; if (t) touch.current = { x: t.clientX, y: t.clientY } }}
      onTouchEnd={(e) => {
        const start = touch.current; const t = e.changedTouches[0]
        touch.current = null
        if (!start || !t) return
        const dx = t.clientX - start.x; const dy = t.clientY - start.y
        if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
      }}
    >
      <div className="flex items-center justify-between gap-4 px-(--spacing-margin) py-4">
        <p className="label tabular-nums text-fg-muted" aria-live="polite">
          <span className="text-fg">{index + 1}</span> of {count}
        </p>
        <button type="button" onClick={onClose} className="label inline-flex min-h-11 items-center gap-2 px-2 text-fg hover:text-fg-muted">
          {labels.close}
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
        <figure key={item.id} className={cx('relative flex max-h-full max-w-full flex-col items-center', !reduced && 'animate-[lightbox-in_var(--duration-page)_var(--ease-out)]')}>
          <div className="relative overflow-hidden [--lb-pad:2rem] md:[--lb-pad:13rem]" style={{ aspectRatio: `${w} / ${h}`, height: `min(calc(100svh - 11rem), calc((100vw - var(--lb-pad)) * ${h} / ${w}))` }}>
            {item.kind === 'image' ? (
              <>
                <img src={item.thumb} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-contain blur-[2px]" />
                <img
                  src={item.src}
                  alt={item.alt}
                  onLoad={() => setLoadedSrc(item.src)}
                  ref={(el) => { if (el?.complete && el.naturalWidth > 0 && loadedSrc !== item.src) setLoadedSrc(item.src) }}
                  className={cx('absolute inset-0 h-full w-full object-contain transition-opacity duration-(--duration-ui)', loaded ? 'opacity-100' : 'opacity-0')}
                />
              </>
            ) : (
              <video
                key={item.src}
                src={item.src}
                poster={item.poster}
                controls
                muted
                playsInline
                loop
                autoPlay={!reduced}
                aria-label={item.alt}
                className="absolute inset-0 h-full w-full bg-black object-contain"
              />
            )}
          </div>
          <figcaption id="lightbox-caption" className="mt-4 max-w-[60ch] px-2 text-center text-small text-fg-muted">
            {item.caption && <span className="label mr-3 text-accent">{item.caption}</span>}
            {item.alt}
          </figcaption>
        </figure>

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={labels.previous} className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill border border-rule bg-[rgb(17_15_12/0.6)] text-fg transition-colors hover:border-fg md:left-6">
              <Icon name="arrow" size={18} className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={labels.next} className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-pill border border-rule bg-[rgb(17_15_12/0.6)] text-fg transition-colors hover:border-fg md:right-6">
              <Icon name="arrow" size={18} />
            </button>
          </>
        )}
      </div>
      <div className="h-6 shrink-0" />
    </div>,
    document.body,
  )
}
