import { useState } from 'react'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { MediaReveal } from '@/components/motion/MediaReveal'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { addressLines, business, formatAddress, hoursRows } from '@/data/business'
import { homeCopy } from '@/data/home'
import { valueOf } from '@/lib/content'
import { formatPhoneDisplay, getEmailUrl, getPhoneUrl } from '@/lib/links'
import { trackEmailClick, trackPhoneClick } from '@/lib/analytics'


/**
 * Chapter 12: Visit Us. Verified address and directions; phone, email and hours
 * appear only once verified. The Google map is click-to-load (no third-party
 * request, cookies or layout cost until the visitor asks for it).
 */
export function VisitSection() {
  const [showMap, setShowMap] = useState(false)
  const address = valueOf(business.address)
  const hours = valueOf(business.hours)
  const phone = valueOf(business.phone)
  const email = valueOf(business.email)
  const mapSrc = address ? `https://maps.google.com/maps?q=${encodeURIComponent(`${business.name}, ${formatAddress(address)}`)}&output=embed` : null

  return (
    <Section tone="cream" id="visit" labelledBy="visit-title">
      <Container>
        <ChapterHeader eyebrow={homeCopy.visit.eyebrow} title={homeCopy.visit.title} headingId="visit-title" />

        <div className="mt-12 grid-editorial gap-y-12">
          <Reveal className="col-span-full grid content-start gap-12 self-start sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <div>
              <h3 className="label text-fg-muted">Address</h3>
              <address className="mt-3 font-display text-h3 not-italic">
                {addressLines.map((l) => <span key={l} className="block">{l}</span>)}
              </address>
              <div className="mt-5"><ActionLink kind="maps" location="home-visit" variant="solid" /></div>
            </div>

            <div>
              <h3 className="label text-fg-muted">Opening hours</h3>
              {hours ? (
                <dl className="mt-3 divide-y divide-rule border-y border-rule">
                  {hoursRows.map((h) => (
                    <div key={h.label} className="flex justify-between gap-6 py-2.5 text-body">
                      <dt>{h.label}</dt>
                      <dd className="tabular-nums">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <ContentMarker className="mt-3">opening hours (business.hours)</ContentMarker>
              )}
            </div>

            <div>
              <h3 className="label text-fg-muted">Contact</h3>
              <ul className="mt-3 space-y-2 text-body">
                <li>
                  {phone ? (
                    <a href={getPhoneUrl() ?? undefined} onClick={() => trackPhoneClick('home-visit')} className="inline-flex min-h-11 items-center gap-3 underline decoration-rule underline-offset-[0.3em] hover:decoration-fg"><Icon name="phone" size={18} />{formatPhoneDisplay(phone)}</a>
                  ) : (
                    <ContentMarker inline>phone number</ContentMarker>
                  )}
                </li>
                <li>
                  {email ? (
                    <a href={getEmailUrl() ?? undefined} onClick={() => trackEmailClick('home-visit')} className="inline-flex min-h-11 items-center gap-3 underline decoration-rule underline-offset-[0.3em] hover:decoration-fg"><Icon name="mail" size={18} />{email}</a>
                  ) : (
                    <ContentMarker inline>email address</ContentMarker>
                  )}
                </li>
              </ul>
            </div>
          </Reveal>

          <div className="col-span-full flex flex-col gap-(--spacing-gutter) lg:col-span-6 lg:col-start-7">
            <MediaReveal slot="salonExterior" sizes="(min-width: 1024px) 45vw, 100vw" />
            {mapSrc && (
              <div className="relative aspect-[3/2] overflow-hidden border border-rule bg-(--tone-placeholder) sm:aspect-[2/1]">
                {showMap ? (
                  <iframe
                    title={`Map: ${business.name}, Jagatpura, Jaipur`}
                    src={mapSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0 grayscale-[35%]"
                  />
                ) : (
                  <button type="button" onClick={() => setShowMap(true)} className="texture-linen group absolute inset-0 flex flex-col items-center justify-center gap-3 text-fg">
                    <Icon name="pin" size={28} />
                    <span className="label underline decoration-rule underline-offset-[0.45em] group-hover:decoration-fg">Show map</span>
                    <span className="text-caption text-fg-muted">Loads Google Maps</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
