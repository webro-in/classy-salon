import { Link } from 'react-router-dom'
import { business } from '@/data/business'
import { getSlot } from '@/data/media'
import { PATHS } from '@/app/paths'
import { cx } from '@/lib/cx'

/**
 * Brand lockup: the client's scissors emblem (logoMark, vector traced from the
 * client's logo file) beside the name set in the display serif, echoing the
 * uppercase serif lettering of the salon's illuminated sign. The official
 * "CLASSY / Salon Unisex" plaque (logoWordmark) is used in the footer.
 *
 * `onDark` swaps the emblem to its pale-gold version for dark chapters.
 */
export function Wordmark({ className, size = 'md', onDark = false }: { className?: string; size?: 'md' | 'xl'; onDark?: boolean }) {
  const mark = getSlot('logoMark')
  const xl = size === 'xl'
  return (
    <Link to={PATHS.home} className={cx('inline-flex items-center gap-3 whitespace-nowrap text-fg no-underline', className)} aria-label={`${business.name}, home`}>
      {mark.src && (
        <img src={onDark ? '/logo/logo-mark-light.svg' : mark.src} alt="" width={40} height={40} className={xl ? 'h-20 w-20 md:h-24 md:w-24' : 'h-9 w-9 md:h-10 md:w-10'} />
      )}
      <span className="flex flex-col leading-none">
        <span className={cx('font-display uppercase tracking-[0.14em]', xl ? 'text-display' : 'text-[1.5rem] md:text-[1.625rem]')}>{business.shortName}</span>
        <span className={cx('label mt-1 text-fg-muted', xl ? 'text-caption' : 'text-[0.625rem] tracking-[0.3em]')}>{business.descriptor}</span>
      </span>
    </Link>
  )
}
