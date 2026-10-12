import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '@/app/paths'
import { addressLines, business, hoursRows, locationLine } from '@/data/business'
import { bookingCta, legalNav, primaryNav } from '@/data/navigation'
import { serviceGroups } from '@/data/services'
import { valueOf } from '@/lib/content'
import { formatPhoneDisplay, getEmailUrl, getInstagramUrl, getMapsUrl, getPhoneUrl, getWhatsAppUrl } from '@/lib/links'
import { trackBookingClick, trackEmailClick, trackInstagramClick, trackMapsClick, trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Button } from '@/components/buttons/Button'
import { ContentMarker } from '@/components/content/ContentMarker'

declare const __BUILD_YEAR__: number

const linkClass = 'inline-flex min-h-8 items-center no-underline text-fg/85 transition-colors hover:text-fg hover:underline underline-offset-[0.3em]'
const external = { target: '_blank', rel: 'noopener noreferrer' } as const
const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h2 className="label mb-5 text-fg-muted">{title}</h2>
      {children}
    </div>
  )
}

/**
 * Global footer, the final chapter: booking prompt, navigation, services,
 * contact, visit, social and legal, closing on the oversized wordmark.
 * Pending contact data shows dev markers only and never renders broken links.
 */
export function Footer() {
  const phone = valueOf(business.phone)
  const email = valueOf(business.email)
  const whatsapp = getWhatsAppUrl()
  const maps = getMapsUrl()
  const instagram = business.instagram
    .map((a) => ({ handle: a.handle, url: getInstagramUrl(a.id as 'primary' | 'secondary') }))
    .filter((a): a is { handle: string; url: string } => Boolean(a.url))

  return (
    <footer className="tone-dark overflow-hidden bg-tone pb-28 pt-section text-fg lg:pb-10">
      <div className="container-page">
        <div className="grid-editorial items-end gap-y-8 border-b border-rule pb-12">
          <p className="col-span-full font-display text-h1 lg:col-span-7">Book your next appointment at Classy.</p>
          <div className="col-span-full flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Button to={bookingCta.to} variant="solid" onClick={() => trackBookingClick('footer')}>{bookingCta.label}</Button>
            <ActionLink kind="whatsapp" location="footer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-(--spacing-gutter) gap-y-12 py-14 md:grid-cols-3 lg:grid-cols-5">
          <Column title="Explore">
            <ul className="space-y-1.5">
              {primaryNav.map((n) => <li key={n.to}><Link to={n.to} className={linkClass}>{n.label}</Link></li>)}
            </ul>
          </Column>

          <Column title="Services">
            <ul className="space-y-1.5">
              {serviceGroups.map((g) => (
                <li key={g.id}><Link to={`${PATHS.services}#${g.id}`} className={linkClass}>{g.title}</Link></li>
              ))}
            </ul>
          </Column>

          <Column title="Contact">
            <ul className="space-y-1.5">
              <li>{phone ? <a href={getPhoneUrl() ?? undefined} className={linkClass} onClick={() => trackPhoneClick('footer')}>{formatPhoneDisplay(phone)}</a> : <ContentMarker inline>phone number</ContentMarker>}</li>
              <li>{whatsapp ? <a href={whatsapp} {...external} className={linkClass} onClick={() => trackWhatsAppClick('footer')}>WhatsApp<NewTab /></a> : <ContentMarker inline>WhatsApp number</ContentMarker>}</li>
              <li>{email ? <a href={getEmailUrl() ?? undefined} className={`${linkClass.replace('inline-flex', 'inline-block py-1.5')} max-w-full [overflow-wrap:anywhere]`} onClick={() => trackEmailClick('footer')}>{email}</a> : <ContentMarker inline>email address</ContentMarker>}</li>
            </ul>
          </Column>

          <Column title="Visit">
            <address className="not-italic text-fg/85">
              {addressLines.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            {hoursRows.length > 0 ? (
              <p className="mt-3 text-fg/85">{hoursRows.map((h) => <span key={h.label} className="block">{h.label}<span className="block tabular-nums">{h.time}</span></span>)}</p>
            ) : (
              <div className="mt-3"><ContentMarker inline>opening hours</ContentMarker></div>
            )}
            {maps && <a href={maps} {...external} className={`${linkClass} mt-3 underline`} onClick={() => trackMapsClick('footer')}>Get directions<NewTab /></a>}
          </Column>

          <Column title="Follow">
            <ul className="space-y-1.5">
              {instagram.map((a) => (
                <li key={a.handle}><a href={a.url} {...external} className={linkClass} onClick={() => trackInstagramClick('footer')}>Instagram @{a.handle}<NewTab /></a></li>
              ))}
              {business.instagram.some((a) => a.url.status === 'pending') && <li><ContentMarker kind="confirm" inline>second Instagram account</ContentMarker></li>}
            </ul>
          </Column>
        </div>
      </div>

      <div className="container-page">
        <div aria-hidden="true" className="flex select-none items-end gap-[3vw] pb-[0.18em]">
          <img src="/logo/logo-mark-light.svg" alt="" width={220} height={220} className="mb-[1.2vw] h-auto w-[clamp(4rem,1rem+14vw,15rem)] shrink-0" />
          <p className="font-display text-[clamp(5rem,1rem+19vw,20rem)] leading-[0.8] tracking-[-0.04em] text-on-night/90">{business.shortName}</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-rule pt-6 text-caption text-fg-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-4"><img src="/logo/logo-wordmark.svg" alt="" width={43} height={32} className="h-8 w-auto" />© {__BUILD_YEAR__} {business.name} · {locationLine}</p>
          <ul className="flex gap-6">
            {legalNav.map((n) => <li key={n.to}><Link to={n.to} className={linkClass}>{n.label}</Link></li>)}
          </ul>
        </div>
      </div>
    </footer>
  )
}
