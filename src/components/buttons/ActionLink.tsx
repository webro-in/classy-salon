import { business } from '@/data/business'
import { getEmailUrl, getInstagramUrl, getMapsUrl, getPhoneUrl, getWhatsAppUrl, type EnquiryDetails } from '@/lib/links'
import { trackEmailClick, trackInstagramClick, trackMapsClick, trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Button, type ButtonVariant } from './Button'
import type { IconName } from '@/components/icons/Icon'

export type ActionKind = 'whatsapp' | 'call' | 'email' | 'maps' | 'instagram'

const config: Record<ActionKind, { icon: IconName; label: string; pendingNote: string }> = {
  whatsapp: { icon: 'whatsapp', label: 'WhatsApp', pendingNote: 'WhatsApp number' },
  call: { icon: 'phone', label: 'Call', pendingNote: 'phone number' },
  email: { icon: 'mail', label: 'Email', pendingNote: 'email address' },
  maps: { icon: 'pin', label: 'Get directions', pendingNote: 'Google Maps link' },
  instagram: { icon: 'instagram', label: 'Instagram', pendingNote: 'Instagram link' },
}

function resolveHref(kind: ActionKind, enquiry?: EnquiryDetails): string | null {
  switch (kind) {
    case 'whatsapp': return getWhatsAppUrl(enquiry)
    case 'call': return getPhoneUrl()
    case 'email': return getEmailUrl()
    case 'maps': return getMapsUrl()
    case 'instagram': return getInstagramUrl('primary')
  }
}

function track(kind: ActionKind, location: string, service?: string) {
  if (kind === 'whatsapp') trackWhatsAppClick(location, service)
  else if (kind === 'call') trackPhoneClick(location)
  else if (kind === 'email') trackEmailClick(location)
  else if (kind === 'maps') trackMapsClick(location)
  else trackInstagramClick(location)
}

interface ActionLinkProps {
  kind: ActionKind
  /** Analytics location, e.g. "header", "hero", "footer". */
  location: string
  label?: string
  variant?: ButtonVariant
  enquiry?: EnquiryDetails
  className?: string
  fullWidth?: boolean
}

/**
 * Contact action (WhatsApp / Call / Email / Maps / Instagram) built from
 * centralised data. If the data is pending, production renders nothing and
 * dev renders a CLIENT DATA REQUIRED marker, so no broken link can ship.
 */
export function ActionLink({ kind, location, label, variant = 'outline', enquiry, className, fullWidth }: ActionLinkProps) {
  const { icon, label: defaultLabel, pendingNote } = config[kind]
  const href = resolveHref(kind, enquiry)
  if (!href) return <ContentMarker kind="data" inline>{pendingNote}</ContentMarker>

  const external = kind === 'whatsapp' || kind === 'maps' || kind === 'instagram'
  return (
    <Button
      to={href}
      external={external}
      variant={variant}
      icon={icon}
      className={className}
      fullWidth={fullWidth}
      ariaLabel={kind === 'instagram' ? `${business.name} on Instagram` : undefined}
      onClick={() => track(kind, location, enquiry?.service)}
    >
      {label ?? defaultLabel}
    </Button>
  )
}
