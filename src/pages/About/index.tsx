import { PATHS } from '@/app/paths'
import { Button } from '@/components/buttons/Button'
import { Seo } from '@/components/seo/Seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { buildAboutPageJsonLd } from '@/config/seo'
import { aboutCopy } from '@/data/about'
import { bookingCta } from '@/data/navigation'
import { AboutStory } from '@/sections/about/AboutStory'
import { AboutApproach } from '@/sections/about/AboutApproach'
import { AboutSpace } from '@/sections/about/AboutSpace'
import { AboutExperience } from '@/sections/about/AboutExperience'
import { AboutCommitment } from '@/sections/about/AboutCommitment'
import { AboutCta } from '@/sections/about/AboutCta'
import { trackBookingClick } from '@/lib/analytics'

/**
 * About (docs/DESIGN.md §8). Tone cadence:
 * ivory hero · cream story · ivory philosophy & approach · taupe space ·
 * dark "What Defines Classy" · ivory commitment · taupe CTA → dark footer.
 * (The optional team section was removed at the client's request.)
 */
export function Component() {
  return (
    <>
      <Seo route="about" />
      <JsonLd data={buildAboutPageJsonLd()} />
      <PageHero
        trail={[{ name: 'Home', path: PATHS.home }, { name: 'About', path: PATHS.about }]}
        title={aboutCopy.hero.title}
        lead={aboutCopy.hero.lead}
        slot="aboutHero"
        aside={
          <div className="flex flex-wrap gap-3">
            <Button to={bookingCta.to} variant="solid" onClick={() => trackBookingClick('about-hero')}>{bookingCta.label}</Button>
            <Button to={PATHS.services} variant="outline">Our Services</Button>
          </div>
        }
      />
      <AboutStory />
      <AboutApproach />
      <AboutSpace />
      <AboutExperience />
      <AboutCommitment />
      <AboutCta />
    </>
  )
}
