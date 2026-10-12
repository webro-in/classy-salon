import { Media } from '@/components/media/Media'
import { getSlot } from '@/data/media'
import { cx } from '@/lib/cx'

/**
 * Optional per-service image (slot `service.<id>`). Renders nothing until a
 * real photo is supplied, so rows never show empty placeholders.
 */
export function ServiceMedia({ id, className }: { id: string; className?: string }) {
  const slot = getSlot(`service.${id}`)
  if (!slot.src) return null
  return (
    <div className={cx('overflow-hidden', className)}>
      <Media slot={slot.id} sizes="(min-width: 1024px) 18rem, 90vw" />
    </div>
  )
}

export function hasServiceMedia(id: string): boolean {
  return Boolean(getSlot(`service.${id}`).src)
}
