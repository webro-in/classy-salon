import { getServiceWhatsAppUrl } from '@/lib/links'
import { trackWhatsAppClick } from '@/lib/analytics'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { servicesPageCopy } from '@/data/services'
import { cx } from '@/lib/cx'

/**
 * Per-service "ENQUIRE ON WHATSAPP" link. Opens WhatsApp with the service
 * pre-filled (buildServiceEnquiryMessage). Enquiry only: never a booking.
 */
export function ServiceWhatsApp({ service, className }: { service: string; className?: string }) {
  const href = getServiceWhatsAppUrl(service)
  if (!href) return <ContentMarker inline>WhatsApp number</ContentMarker>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-service={service}
      onClick={() => trackWhatsAppClick('services-row', service)}
      className={cx(
        'group/wa label inline-flex min-h-11 items-center gap-2.5 text-fg no-underline',
        'underline decoration-rule underline-offset-[0.55em] transition-colors hover:decoration-fg',
        className,
      )}
    >
      <Icon name="whatsapp" size={16} />
      {servicesPageCopy.row.enquire}
      <span className="sr-only">: {service} (opens WhatsApp in a new tab)</span>
      <Icon name="arrow-up-right" size={14} className="transition-transform duration-(--duration-ui) group-hover/wa:-translate-y-0.5 group-hover/wa:translate-x-0.5" />
    </a>
  )
}
