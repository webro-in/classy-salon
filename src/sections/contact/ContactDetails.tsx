import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '@/app/paths'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Reveal } from '@/components/motion/Reveal'
import { addressLines, addressSingleLine, business, googleRating, hoursRows, openStatus } from '@/data/business'
import { contactCopy } from '@/data/contact'
import { valueOf } from '@/lib/content'
import { formatPhoneDisplay, getEmailUrl, getInstagramUrl, getPhoneUrl, getWhatsAppUrl } from '@/lib/links'
import { trackEmailClick, trackInstagramClick, trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics'
import { cx } from '@/lib/cx'

const external = { target: '_blank', rel: 'noopener noreferrer' } as const
const rowLink = 'inline-flex min-h-11 items-center gap-2 text-fg underline decoration-rule underline-offset-[0.35em] transition-colors hover:decoration-fg break-all'

/**
 * Address (large, copyable) + opening hours (with live open/closed status at
 * the salon's local time) + every contact channel, as an editorial split with
 * hairline rows. Every value comes from content/business.json.
 */
export function ContactDetails() {
  return (
    <Section tone="ivory" labelledBy="visit-title">
      <Container>
        <div className="grid-editorial gap-y-14">
          <Reveal className="col-span-full lg:col-span-6">
            <p className="label text-fg-muted">{contactCopy.details.eyebrow}</p>
            <h2 id="visit-title" className="sr-only">{contactCopy.details.title}</h2>
            <address className="mt-6 font-display text-[clamp(2.25rem,1.6rem+2.6vw,4rem)] leading-[1.02] not-italic" data-address>
              {addressLines.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ActionLink kind="maps" location="contact-address" variant="solid" label={contactCopy.details.directions} />
              {addressSingleLine && <CopyAddress text={addressSingleLine} />}
            </div>
          </Reveal>

          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            <HoursBlock />
            <ContactRows />
          </div>
        </div>
      </Container>
    </Section>
  )
}

function CopyAddress({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.setTimeout(() => setState('idle'), 3000)
  }
  return (
    <>
      <button type="button" onClick={copy} className="label inline-flex min-h-[3.25rem] items-center gap-2 border border-rule px-6 text-fg transition-colors hover:border-fg" data-copy-address>
        {state === 'copied' ? contactCopy.details.copied : contactCopy.details.copy}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'copied' && contactCopy.details.copied}
        {state === 'failed' && contactCopy.details.copyFailed}
      </span>
      {state === 'failed' && <span className="text-small text-fg-muted">{contactCopy.details.copyFailed}</span>}
    </>
  )
}

function HoursBlock() {
  const [status, setStatus] = useState<ReturnType<typeof openStatus>>(null)
  // Client-only (time-dependent): keeps the prerendered HTML deterministic.
  useEffect(() => {
    setStatus(openStatus())
    const t = window.setInterval(() => setStatus(openStatus()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  return (
    <Reveal>
      <h3 className="label text-fg-muted">{contactCopy.details.hours}</h3>
      {hoursRows.length > 0 ? (
        <dl className="mt-4 divide-y divide-rule border-y border-rule" data-hours>
          {hoursRows.map((h) => (
            <div key={h.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <dt className="font-display text-h4">{h.label}</dt>
              <dd className="tabular-nums text-body">{h.time}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <ContentMarker className="mt-4">opening hours</ContentMarker>
      )}
      <p className="mt-3 flex min-h-6 items-center gap-2 text-small text-fg-muted" aria-live="polite" data-open-status>
        {status && (
          <>
            <span aria-hidden="true" className={cx('inline-block h-1.5 w-1.5 rounded-pill', status.open ? 'bg-success' : 'bg-fg-muted')} />
            {status.label}
          </>
        )}
      </p>
    </Reveal>
  )
}

function ContactRows() {
  const phone = valueOf(business.phone)
  const email = valueOf(business.email)
  const instagram = business.instagram
    .map((a) => ({ handle: a.handle, url: getInstagramUrl(a.id as 'primary' | 'secondary') }))
    .filter((a): a is { handle: string; url: string } => Boolean(a.url))
  const wa = getWhatsAppUrl()

  return (
    <Reveal className="mt-12">
      <h3 className="label text-fg-muted">{contactCopy.details.contact}</h3>
      <dl className="mt-4 divide-y divide-rule border-y border-rule" data-contact-rows>
        <Row label={contactCopy.details.phone}>
          {phone ? <a href={getPhoneUrl() ?? undefined} onClick={() => trackPhoneClick('contact-rows')} className={rowLink}>{formatPhoneDisplay(phone)}</a> : <ContentMarker inline>phone number</ContentMarker>}
        </Row>
        <Row label={contactCopy.details.whatsapp}>
          {wa && phone ? (
            <a href={wa} {...external} onClick={() => trackWhatsAppClick('contact-rows')} className={rowLink}>
              {formatPhoneDisplay(valueOf(business.whatsapp) ?? phone)}<span className="sr-only"> on WhatsApp (opens in a new tab)</span>
            </a>
          ) : <ContentMarker inline>WhatsApp number</ContentMarker>}
        </Row>
        <Row label={contactCopy.details.email}>
          {email ? <a href={getEmailUrl() ?? undefined} onClick={() => trackEmailClick('contact-rows')} className={rowLink}>{email}</a> : <ContentMarker inline kind="data">CLIENT EMAIL REQUIRED</ContentMarker>}
        </Row>
        {instagram.length > 0 && (
          <Row label={contactCopy.details.instagram}>
            <ul className="flex flex-col">
              {instagram.map((a) => (
                <li key={a.handle}>
                  <a href={a.url} {...external} onClick={() => trackInstagramClick('contact-rows')} className={rowLink}>
                    @{a.handle}<span className="sr-only"> on Instagram (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Row>
        )}
        {googleRating && (
          <Row label={contactCopy.details.rating}>
            <span className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-h4 tabular-nums">{googleRating.display}</span>
              <span className="text-small text-fg-muted">out of 5 · {googleRating.countLabel} Google reviews</span>
              <Link to={PATHS.reviews} className={cx(rowLink, 'label')}>{contactCopy.details.readReviews}</Link>
            </span>
          </Row>
        )}
      </dl>
    </Reveal>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4 py-3 sm:grid-cols-[8rem_1fr]">
      <dt className="label text-fg-muted">{label}</dt>
      <dd className="min-w-0 text-body">{children}</dd>
    </div>
  )
}
