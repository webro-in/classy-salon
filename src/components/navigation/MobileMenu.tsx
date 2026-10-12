import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { bookingCta, primaryNav } from '@/data/navigation'
import { addressLines } from '@/data/business'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useLockScroll } from '@/hooks/useLockScroll'
import { trackBookingClick } from '@/lib/analytics'
import { cx } from '@/lib/cx'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Button } from '@/components/buttons/Button'
import { Icon } from '@/components/icons/Icon'

interface MobileMenuProps {
  id: string
  open: boolean
  onClose: () => void
}

/**
 * Full-screen mobile navigation (below 1024px).
 * Modal dialog: focus trapped, Escape closes, background scroll locked,
 * focus returns to the toggle on close, closes on route change (Header).
 */
export function MobileMenu({ id, open, onClose }: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  useLockScroll(open)
  useFocusTrap(ref, open, onClose)

  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      hidden={!open}
      className={cx('tone-ivory fixed inset-0 z-50 overflow-y-auto bg-tone lg:hidden')}
    >
      <div className="container-page flex min-h-full flex-col pb-10">
        <div className="flex h-(--spacing-header) items-center justify-between border-b border-rule">
          <span className="label text-fg-muted">Menu</span>
          <button type="button" onClick={onClose} className="-mr-2 inline-flex h-11 min-w-11 items-center justify-center gap-2 px-2">
            <span className="label">Close</span>
            <Icon name="close" size={22} />
          </button>
        </div>

        <nav aria-label="Mobile" className="py-8">
          <ol className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.to} className="border-b border-rule">
                <NavLink
                  to={item.to}
                  end
                  onClick={onClose}
                  className={({ isActive }) => cx('flex items-baseline gap-4 py-4 no-underline', isActive ? 'text-fg' : 'text-fg/80')}
                >
                  <span className="font-display text-h3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Button to={bookingCta.to} variant="solid" fullWidth onClick={() => { trackBookingClick('mobile-menu'); onClose() }}>
            {bookingCta.label}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <ActionLink kind="whatsapp" location="mobile-menu" fullWidth />
            <ActionLink kind="call" location="mobile-menu" fullWidth />
          </div>
          <address className="mt-6 text-small not-italic text-fg-muted">
            {addressLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <div className="flex flex-wrap gap-x-6">
            <ActionLink kind="maps" location="mobile-menu" variant="text" />
            <ActionLink kind="instagram" location="mobile-menu" variant="text" />
          </div>
        </div>
      </div>
    </div>
  )
}
