import { useState } from 'react'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Icon } from '@/components/icons/Icon'
import { Media } from '@/components/media/Media'
import { Reveal } from '@/components/motion/Reveal'
import { addressSingleLine } from '@/data/business'
import { contactCopy } from '@/data/contact'

/**
 * Click-to-load map. A real salon photo stands in until the visitor asks for
 * the map, so no Google request is made on page load. The embed is built from
 * the verified address; "Open in Google Maps" uses the client's Maps link.
 */
export function ContactMap() {
  const [loaded, setLoaded] = useState(false)
  const src = addressSingleLine ? `https://maps.google.com/maps?q=${encodeURIComponent(addressSingleLine)}&z=16&output=embed` : null

  return (
    <Section tone="cream" spacing="small" labelledBy="map-title">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-fg-muted">{contactCopy.map.eyebrow}</p>
            <h2 id="map-title" className="mt-4 font-display text-h2">{contactCopy.map.title}</h2>
          </div>
          <ActionLink kind="maps" location="contact-map" variant="outline" label={contactCopy.map.open} />
        </div>
        <Reveal className="relative mt-10 overflow-hidden" >
          <div className="relative aspect-[4/5] w-full md:aspect-[16/9]" data-map>
            {loaded && src ? (
              <iframe
                title={contactCopy.map.frameTitle}
                src={src}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <>
                <Media slot="contactVisit" fit="fill" sizes="(min-width: 1440px) 1280px, 100vw" />
                <div aria-hidden="true" className="absolute inset-0 bg-[rgb(25_23_20/0.55)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-on-night">
                  {src && (
                    <button
                      type="button"
                      onClick={() => setLoaded(true)}
                      className="label inline-flex min-h-[3.25rem] items-center gap-3 bg-ivory px-7 text-ink transition-colors hover:bg-cream focus-visible:outline-offset-4"
                      aria-describedby="map-note"
                    >
                      <Icon name="pin" size={18} />
                      {contactCopy.map.show}
                    </button>
                  )}
                  <p id="map-note" className="text-small text-on-night/85">{contactCopy.map.note}</p>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
