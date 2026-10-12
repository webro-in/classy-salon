import { PATHS } from '@/app/paths'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Media } from '@/components/media/Media'
import { Reveal } from '@/components/motion/Reveal'
import { bookingCta } from '@/data/navigation'
import { galleryPageCopy } from '@/data/gallery'
import { trackBookingClick } from '@/lib/analytics'

/** Closing chapter after the gallery: book an appointment, or explore the services. */
export function GalleryCta() {
  const c = galleryPageCopy.cta
  return (
    <Section tone="cream" labelledBy="gallery-cta-title">
      <Container>
        <div className="grid-editorial items-center gap-y-10">
          <Reveal className="col-span-full md:col-span-5 lg:col-span-6">
            <p className="label text-fg-muted">{c.eyebrow}</p>
            <h2 id="gallery-cta-title" className="mt-5 max-w-[16ch] font-display text-h1">{c.title}</h2>
            <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">{c.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to={bookingCta.to} variant="solid" onClick={() => trackBookingClick('gallery-cta')}>{c.book}</Button>
              <Button to={PATHS.services} variant="outline" icon="arrow" iconPosition="end">{c.services}</Button>
            </div>
          </Reveal>
          <Reveal className="col-span-full md:col-span-3 lg:col-span-5 lg:col-start-8">
            <div className="grid grid-cols-2 gap-(--spacing-gutter)">
              <Media slot="instagram01" shape="arch" aspect="3:4" sizes="(min-width: 1024px) 20vw, 45vw" />
              <div className="mt-[22%]"><Media slot="instagram05" aspect="3:4" sizes="(min-width: 1024px) 20vw, 45vw" /></div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
