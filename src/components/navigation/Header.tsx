import { useCallback, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { bookingCta, primaryNav } from '@/data/navigation'
import { trackBookingClick } from '@/lib/analytics'
import { cx } from '@/lib/cx'
import { Button } from '@/components/buttons/Button'
import { Icon } from '@/components/icons/Icon'
import { MobileMenu } from './MobileMenu'
import { Wordmark } from './Wordmark'

export const MOBILE_MENU_ID = 'mobile-menu'

/**
 * Global header. Desktop (≥1024px): wordmark, primary navigation, Book Now.
 * Below 1024px: wordmark + menu toggle opening the full-screen menu.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const close = useCallback(() => setOpen(false), [])

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname])

  // The menu renders outside <header>: the header's backdrop-filter would
  // otherwise become the containing block for the menu's position: fixed.
  return (
    <>
    <header className="tone-ivory sticky top-0 z-40 border-b border-rule bg-tone/95 backdrop-blur-sm supports-[backdrop-filter]:bg-tone/85">
      <div className="container-page flex h-(--spacing-header) items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    cx(
                      'label relative py-2 no-underline text-fg transition-colors duration-(--duration-ui)',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-fg after:transition-transform after:duration-(--duration-ui) after:ease-(--ease-out)',
                      isActive ? 'after:scale-x-100' : 'text-fg-muted after:scale-x-0 hover:text-fg hover:after:scale-x-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Button to={bookingCta.to} variant="solid" onClick={() => trackBookingClick('header')}>
              {bookingCta.label}
            </Button>
          </div>
          <button
            type="button"
            className="-mr-2 inline-flex h-11 min-w-11 items-center justify-center gap-2 px-2 lg:hidden"
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="label">{open ? 'Close' : 'Menu'}</span>
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>
    </header>
    <MobileMenu id={MOBILE_MENU_ID} open={open} onClose={close} />
    </>
  )
}
