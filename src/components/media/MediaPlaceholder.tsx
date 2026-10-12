import { showContentMarkers } from '@/config/site'
import type { MediaSlot } from '@/data/media'
import { cx } from '@/lib/cx'

/**
 * Stand-in for a media slot with no real asset yet. It occupies the exact
 * final ratio, so layouts are final before photography arrives.
 * Dev/preview builds label the slot id, ratio and size for the client brief.
 */
export function MediaPlaceholder({ slot, reason = 'missing', captionAt = 'bottom', displayRatio }: { slot: MediaSlot; reason?: 'missing' | 'error'; captionAt?: 'top' | 'bottom'; displayRatio?: string }) {
  const native = slot.mobileRatio ? `${slot.mobileRatio} / ${slot.ratio}` : slot.ratio
  const ratio = displayRatio && displayRatio !== slot.ratio ? `shown ${displayRatio} (slot ${native})` : native
  return (
    <div
      data-media-placeholder={slot.id}
      aria-hidden="true"
      className={cx('texture-linen absolute inset-0 flex bg-(--tone-placeholder) p-3 sm:p-4', captionAt === 'top' ? 'items-start pt-[calc(var(--spacing-header)+1rem)]' : 'items-end')}
    >
      <span className="pointer-events-none absolute inset-2 border border-fg/10 sm:inset-3" />
      {showContentMarkers && (
        <span className={cx('relative z-[1] max-w-full font-mono text-[0.6875rem] leading-snug text-fg-muted', slot.kind === 'logo' && 'text-center w-full')}>
          {slot.kind === 'logo' ? (
            <>LOGO · {slot.alt}</>
          ) : (
            <>
              {reason === 'error' ? 'MEDIA FAILED' : 'MEDIA PLACEHOLDER'} · {slot.id}
              <br />
              {slot.kind.toUpperCase()} · {ratio} · {slot.size}
            </>
          )}
        </span>
      )}
    </div>
  )
}
