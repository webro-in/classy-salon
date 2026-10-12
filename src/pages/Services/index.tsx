import { Seo } from '@/components/seo/Seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildServicesPageJsonLd } from '@/config/seo'
import { serviceGroups } from '@/data/services'
import { ServiceHero, ServiceIntro } from '@/sections/services/ServiceHero'
import { ServiceCategoryNav } from '@/sections/services/ServiceCategoryNav'
import { ServiceCategory } from '@/sections/services/ServiceCategory'
import { ServicesBrands } from '@/sections/services/ServicesBrands'
import { ServicesCta } from '@/sections/services/ServicesCta'
import type { Tone } from '@/components/layout/Section'

const tones: Tone[] = ['ivory', 'cream', 'ivory']

/**
 * Our Services. Tone cadence: white hero + intro · sticky category index ·
 * 01 Hair (white) · 02 Skin (soft cream) · 03 Makeup (white) · brands (cream)
 * · dark WhatsApp CTA → dark footer. All names come from content/services.json.
 */
export function Component() {
  return (
    <>
      <Seo route="services" />
      <JsonLd data={buildServicesPageJsonLd()} />
      <ServiceHero />
      <ServiceIntro />
      <ServiceCategoryNav />
      {serviceGroups.map((g, i) => (
        <ServiceCategory key={g.id} group={g} tone={tones[i % tones.length]!} />
      ))}
      <ServicesBrands />
      <ServicesCta />
    </>
  )
}
