import { useId } from 'react'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { displayLabel, servicesPageCopy } from '@/data/services'
import { cx } from '@/lib/cx'
import type { ServiceItem } from '@/types/content'
import { ServiceMedia } from './ServiceMedia'
import { ServiceWhatsApp } from './ServiceWhatsApp'

interface ServiceRowProps {
  item: ServiceItem
  open: boolean
  onToggle: () => void
  onFocusRow: () => void
}

/**
 * Editorial numbered service row: number, exact service name, short
 * description and the WhatsApp enquiry are always visible; "Details" expands
 * the highlights and the service photo. The disclosure is a real button with
 * aria-expanded; collapsed content is `inert` so it leaves the tab order.
 */
export function ServiceRow({ item, open, onToggle, onFocusRow }: ServiceRowProps) {
  const label = displayLabel(item)
  const panelId = useId()
  const desc = item.description
  const highlights = item.highlights?.value ?? []

  return (
    <li
      className="group/row border-b border-rule"
      data-service-row={item.id}
      onMouseEnter={onFocusRow}
      onFocus={onFocusRow}
    >
      <div className="grid grid-cols-1 gap-x-3 py-6 sm:grid-cols-[1fr_auto] sm:gap-x-5 md:py-7">
        <div className="min-w-0">
          <h3 className="font-display text-h3 leading-tight" data-service-name>{label}</h3>
          {desc.status === 'pending' ? (
            <ContentMarker className="mt-2">{desc.note}</ContentMarker>
          ) : (
            <p className="mt-2 max-w-[58ch] text-body text-fg-muted">{desc.value}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-1">
            <ServiceWhatsApp service={label} />
            <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={onToggle}
                className="label inline-flex min-h-11 items-center gap-2 text-fg-muted transition-colors hover:text-fg sm:hidden"
              >
                {open ? servicesPageCopy.row.close : servicesPageCopy.row.details}
                <Icon name="plus" size={14} className={cx('transition-transform duration-(--duration-ui)', open && 'rotate-45')} />
              </button>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? 'Hide' : 'Show'} details: ${label}`}
          onClick={onToggle}
          className="hidden h-11 w-11 items-center justify-center self-start rounded-pill border border-rule text-fg transition-colors duration-(--duration-ui) hover:border-fg sm:inline-flex"
        >
          <Icon name="plus" size={16} className={cx('transition-transform duration-(--duration-ui) ease-(--ease-out)', open && 'rotate-45')} />
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-label={`${label} details`}
        inert={!open}
        className={cx(
          'grid transition-[grid-template-rows,opacity] duration-(--duration-page) ease-(--ease-out) motion-reduce:transition-none',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="grid gap-6 pb-8 sm:grid-cols-[1fr_15rem] lg:grid-cols-[1fr_17rem]">
            {highlights.length > 0 && (
              <ul className="space-y-2.5 self-start border-t border-rule pt-4">
                {highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-body">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <ServiceMedia id={item.id} className="lg:hidden" />
          </div>
        </div>
      </div>
    </li>
  )
}
