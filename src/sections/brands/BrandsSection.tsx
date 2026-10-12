import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Reveal } from '@/components/motion/Reveal'
import { BrandLogo } from '@/components/brands/BrandLogo'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { brandsHeading, logoBrands, nameBrands } from '@/data/brands'
import { getSlot } from '@/data/media'
import { homeCopy } from '@/data/home'

/**
 * Chapter 8: Products & Brands. The client-selected brands (six green-dot
 * brands plus Wella, Shea Butter and Brillare Professional), each a separate entry. Neutral wording only: no
 * "partner", "official" or verification marks (content claim is 'none').
 * Until approved logo files arrive, each cell shows the brand name in type.
 */
export function BrandsSection() {
  return (
    <Section tone="cream" id="brands" labelledBy="brands-title">
      <Container>
        <ChapterHeader eyebrow={homeCopy.brands.eyebrow} title={brandsHeading} headingId="brands-title" intro={homeCopy.brands.intro} />

        <Reveal as="ul" stagger className="mt-12 grid grid-cols-3 border-l border-t border-rule">
          {logoBrands.map((b) => {
            return (
              <li key={b.id} className="group relative flex aspect-square items-center justify-center border-b border-r border-rule p-3 sm:aspect-[3/2] sm:p-6 md:aspect-[2/1] lg:aspect-[5/2]">
                <BrandLogo brand={b} />
              </li>
            )
          })}
        </Reveal>

        {logoBrands.some((b) => !getSlot(`brand.${b.id}`).src) && (
          <ContentMarker kind="media" className="mt-4">client-approved logo files for {logoBrands.filter((b) => !getSlot(`brand.${b.id}`).src).length} brands (names shown in type until the client supplies them)</ContentMarker>
        )}

        {nameBrands.length > 0 && (
        <Reveal className="mt-10 flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
          <p className="label text-fg-muted">{homeCopy.brands.alsoLabel}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {nameBrands.map((b) => (
              <li key={b.id} className="font-display text-h3">{b.name}</li>
            ))}
          </ul>
        </Reveal>
        )}
      </Container>
    </Section>
  )
}
