import { bookingCta } from '@/data/navigation'
import { getMapsUrl, getPhoneUrl, getWhatsAppUrl } from '@/lib/links'
import { trackBookingClick, trackMapsClick, trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from '@/components/icons/Icon'

interface BarAction {
  key: string
  label: string
  icon: IconName
  href: string
  internal?: boolean
  external?: boolean
  onClick: () => void
}

/**
 * Persistent booking actions below 1024px, respecting the iOS safe area.
 * Shows WhatsApp + Call when verified; otherwise falls back to Book Now +
 * Directions so the bar never contains a broken or placeholder link.
 */
export function MobileActionBar() {
  const whatsapp = getWhatsAppUrl()
  const phone = getPhoneUrl()
  const maps = getMapsUrl()

  const actions: BarAction[] = []
  if (whatsapp) actions.push({ key: 'wa', label: 'WhatsApp', icon: 'whatsapp', href: whatsapp, external: true, onClick: () => trackWhatsAppClick('mobile-bar') })
  if (phone) actions.push({ key: 'call', label: 'Call', icon: 'phone', href: phone, onClick: () => trackPhoneClick('mobile-bar') })
  if (actions.length < 2) actions.unshift({ key: 'book', label: bookingCta.label, icon: 'arrow', href: bookingCta.to, internal: true, onClick: () => trackBookingClick('mobile-bar') })
  if (actions.length < 2 && maps) actions.push({ key: 'maps', label: 'Directions', icon: 'pin', href: maps, external: true, onClick: () => trackMapsClick('mobile-bar') })

  const itemClass = 'flex min-h-12 flex-1 items-center justify-center gap-2 px-3 label no-underline text-on-night'

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex divide-x divide-line-night rounded-pill bg-night/95 shadow-float backdrop-blur-sm lg:hidden"
    >
      {actions.slice(0, 2).map((a) =>
        a.internal ? (
          <Link key={a.key} to={a.href} onClick={a.onClick} className={itemClass}>
            <Icon name={a.icon} size={18} />
            {a.label}
          </Link>
        ) : (
          <a key={a.key} href={a.href} onClick={a.onClick} className={itemClass} {...(a.external && { target: '_blank', rel: 'noopener noreferrer' })}>
            <Icon name={a.icon} size={18} />
            {a.label}
            {a.external && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        ),
      )}
    </nav>
  )
}
