import { Seo } from '@/components/seo/Seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildLocalBusinessJsonLd } from '@/config/seo'
import { Hero } from '@/sections/hero/Hero'
import { IntroTrust } from '@/sections/intro-trust/IntroTrust'
import { ServicesPreview } from '@/sections/services-preview/ServicesPreview'
import { HairTreatments } from '@/sections/hair-treatments/HairTreatments'
import { SalonInteriors } from '@/sections/salon/SalonInteriors'
import { MakeupFeature } from '@/sections/makeup/MakeupFeature'
import { RealWork } from '@/sections/work/RealWork'
import { BrandsSection } from '@/sections/brands/BrandsSection'
import { ReviewsSection } from '@/sections/reviews/ReviewsSection'
import { InstagramSection } from '@/sections/instagram/InstagramSection'
import { BookingSection } from '@/sections/booking/BookingSection'
import { VisitSection } from '@/sections/visit/VisitSection'

/**
 * Home (docs/PRD.md §6). Chapter order and tone cadence are final:
 * dark · ivory · cream · ivory · taupe · dark · ivory · cream · taupe · ivory · dark · cream → footer (dark).
 */
export function Component() {
  return (
    <>
      <Seo route="home" />
      <JsonLd data={buildLocalBusinessJsonLd()} />
      <Hero />
      <IntroTrust />
      <ServicesPreview />
      <HairTreatments />
      <SalonInteriors />
      <MakeupFeature />
      <RealWork />
      <BrandsSection />
      <ReviewsSection />
      <InstagramSection />
      <BookingSection />
      <VisitSection />
    </>
  )
}
