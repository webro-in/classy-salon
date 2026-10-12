import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Reveal } from '@/components/motion/Reveal'
import { BrandLogo } from '@/components/brands/BrandLogo'
import { brands } from '@/data/brands'
import { getSlot } from '@/data/media'
import { servicesPageCopy } from '@/data/services'

/**
 * Brand wall on Our Services. Neutral wording only ("brands we use"), never
 * partner/official claims. Official logo files only (client-supplied); until
 * then each cell is a marked logo placeholder (BrandLogo).
 */
export function ServicesBrands() {
  const missing = brands.filter((b) => !getSlot(`brand.${b.id}`).src)
  return (
    <Section tone="cream" spacing="small" labelledBy="services-brands-title">
      <Container>
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-fg-muted">{servicesPageCopy.brands.eyebrow}</p>
            <h2 id="services-brands-title" className="mt-4 font-display text-h2">{servicesPageCopy.brands.title}</h2>
          </div>
          <p className="max-w-[40ch] text-body text-fg-muted">{servicesPageCopy.brands.intro}</p>
        </Reveal>
        <Reveal as="ul" stagger className="mt-10 grid grid-cols-2 border-l border-t border-rule sm:grid-cols-3">
          {brands.map((b) => {
            return (
              <li key={b.id} className="flex aspect-[2/1] items-center justify-center border-b border-r border-rule px-4 sm:aspect-[5/2] sm:px-6">
                <BrandLogo brand={b} />
              </li>
            )
          })}
        </Reveal>
        {missing.length > 0 && (
          <ContentMarker kind="media" className="mt-4">client-approved logo files for {missing.length} brands: {missing.map((b) => b.name).join(', ')} (names shown in type until the client supplies them)</ContentMarker>
        )}
      </Container>
    </Section>
  )
}
