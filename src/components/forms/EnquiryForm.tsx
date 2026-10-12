import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { formatTime, hoursOn } from '@/data/business'
import { serviceGroups, displayLabel } from '@/data/services'
import { getWhatsAppUrl } from '@/lib/links'
import { trackWhatsAppClick } from '@/lib/analytics'
import { cx } from '@/lib/cx'

type Field = 'name' | 'service' | 'date' | 'time'
type Values = Record<Field, string>

/**
 * Validation for the appointment enquiry (exported for tests). Times must fall
 * within the verified opening hours for the chosen day; dates cannot be past.
 */
export function validateEnquiry(values: Values, today: string): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.service) errors.service = 'Please choose a service.'
  if (!values.date) errors.date = 'Please choose a preferred date.'
  else if (values.date < today) errors.date = 'Please choose today or a later date.'
  if (!values.time) errors.time = 'Please choose a preferred time.'
  else if (values.date) {
    const h = hoursOn(values.date)
    if (h && (values.time < h.opens || values.time > h.closes)) {
      errors.time = `Please choose a time between ${formatTime(h.opens)} and ${formatTime(h.closes)} (opening hours).`
    }
  }
  return errors
}

/**
 * Frontend-only appointment enquiry. Builds an editable, pre-filled WhatsApp
 * message (src/lib/links.ts) and opens WhatsApp. No backend, no storage, and
 * it never claims a booking is confirmed: the salon replies to confirm.
 *
 * `requireAll` (Contact page) validates every field with accessible inline
 * errors; without it (Home) every field stays optional, as approved.
 */
export function EnquiryForm({ location, requireAll = false }: { location: string; requireAll?: boolean }) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<Values>({ name: '', service: '', date: '', time: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<'idle' | 'opening' | 'opened' | 'blocked'>('idle')
  const [minDate, setMinDate] = useState<string | undefined>(undefined)
  const available = getWhatsAppUrl() !== null

  // Set after hydration so the static HTML stays deterministic.
  useEffect(() => setMinDate(localToday()), [])

  const set = (key: Field) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
    setStatus('idle')
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (requireAll) {
      const found = validateEnquiry(values, localToday())
      setErrors(found)
      const first = (['name', 'service', 'date', 'time'] as const).find((k) => found[k])
      if (first) {
        formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
        return
      }
    }
    const url = getWhatsAppUrl(values)
    if (!url) return
    trackWhatsAppClick(location, values.service || undefined)
    setStatus('opening')
    // Note: window.open(..., 'noopener') always returns null by spec, so open
    // normally and detach the opener manually to keep the security benefit.
    const win = window.open(url, '_blank')
    if (win) {
      win.opener = null
      setStatus('opened')
    } else {
      // Popup blocked: continue in this tab.
      setStatus('blocked')
      window.location.href = url
    }
  }

  const field = 'mt-2 block w-full min-h-12 rounded-input border-0 border-b border-rule bg-transparent px-0 py-2 text-body text-fg placeholder:text-fg-muted/70 focus:border-fg focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 aria-[invalid=true]:border-error-on-tone'
  const a11y = (k: Field) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${id}-${k}-error` : undefined,
    'aria-required': requireAll || undefined,
  })
  const err = (k: Field) =>
    errors[k] ? <p id={`${id}-${k}-error`} className="mt-2 flex items-start gap-2 text-small text-error-on-tone" data-field-error={k}><span aria-hidden="true">—</span>{errors[k]}</p> : null
  const req = requireAll ? <span aria-hidden="true" className="ml-1 text-accent">*</span> : null

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${id}-note`} className="grid gap-x-(--spacing-gutter) gap-y-8 sm:grid-cols-2" data-enquiry-form>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-name`} className="label text-fg-muted">Name{req}</label>
        <input id={`${id}-name`} name="name" autoComplete="name" value={values.name} onChange={set('name')} className={field} placeholder="Your name" {...a11y('name')} />
        {err('name')}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-service`} className="label text-fg-muted">Service{req}</label>
        <div className="relative">
          <select id={`${id}-service`} name="service" value={values.service} onChange={set('service')} className={cx(field, 'appearance-none pr-8')} {...a11y('service')}>
            <option value="">{requireAll ? 'Choose a service' : 'Choose a service (optional)'}</option>
            {serviceGroups.map((g) => (
              <optgroup key={g.id} label={g.title}>
                {g.items.map((s) => <option key={s.id} value={displayLabel(s)}>{displayLabel(s)}</option>)}
              </optgroup>
            ))}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-fg-muted"><Icon name="arrow" size={16} /></span>
        </div>
        {err('service')}
      </div>
      <div>
        <label htmlFor={`${id}-date`} className="label text-fg-muted">Preferred date{req}</label>
        <input id={`${id}-date`} name="date" type="date" min={minDate} value={values.date} onChange={set('date')} className={field} {...a11y('date')} />
        {err('date')}
      </div>
      <div>
        <label htmlFor={`${id}-time`} className="label text-fg-muted">Preferred time{req}</label>
        <input id={`${id}-time`} name="time" type="time" value={values.time} onChange={set('time')} className={field} {...a11y('time')} />
        {err('time')}
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={!available}
          className="group relative inline-flex min-h-[3.25rem] w-full items-center justify-center gap-3 bg-fg px-7 label text-tone transition-colors hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
        >
          <Icon name="whatsapp" size={18} />
          Send enquiry on WhatsApp
        </button>
        {!available && <ContentMarker kind="data">WhatsApp number: the enquiry button activates once it is supplied</ContentMarker>}
        <p id={`${id}-note`} className="text-caption text-fg-muted">
          {requireAll && <>Fields marked * are required. </>}
          Opens WhatsApp with your details filled in so you can edit and send them. This is an enquiry, not a confirmed booking.
        </p>
        <p role="status" aria-live="polite" className="text-small text-fg" data-enquiry-status={status}>
          {status === 'opening' && 'Opening WhatsApp…'}
          {status === 'opened' && 'WhatsApp opened in a new tab. Send the message there and the salon will reply about availability.'}
          {status === 'blocked' && 'Opening WhatsApp in this tab…'}
        </p>
      </div>
    </form>
  )
}

/** Today's date in the visitor's local calendar (YYYY-MM-DD). */
function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
