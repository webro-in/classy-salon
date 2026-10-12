import { Seo } from '@/components/seo/Seo'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Media } from '@/components/media/Media'
import { Button } from '@/components/buttons/Button'
import { PATHS } from '@/app/paths'
import { notFoundCopy } from '@/data/notFound'

/**
 * Custom 404. Prerendered to dist/404.html and served with a real 404 status
 * for any unknown URL (no redirect to Home). noindex. One strong image in the
 * salon's arch motif, oversized numerals, three ways back into the site.
 * Motion is the CSS-only hero-rise entrance (disabled under reduced motion).
 */
export function Component() {
  return (
    <>
      <Seo route="notFound" />
      <Section tone="ivory" labelledBy="nf-title" className="overflow-hidden">
        <Container>
          <div className="grid-editorial items-center gap-y-12">
            <div className="col-span-full md:col-span-4 lg:col-span-7">
              <p aria-hidden="true" className="hero-rise select-none font-display text-[clamp(7rem,4rem+16vw,17rem)] leading-[0.8] tracking-[-0.04em] text-fg/90" data-404-numeral>404</p>
              <h1 id="nf-title" className="hero-rise label mt-8 text-fg [animation-delay:120ms]">{notFoundCopy.title}</h1>
              <p className="hero-rise mt-5 max-w-[30ch] font-display text-h2 leading-[1.08] [animation-delay:200ms]">{notFoundCopy.lead}</p>
              <nav aria-label="Back into the site" className="hero-rise mt-10 flex flex-wrap gap-3 [animation-delay:280ms]">
                <Button to={PATHS.home} variant="solid">{notFoundCopy.home}</Button>
                <Button to={PATHS.services} variant="outline">{notFoundCopy.services}</Button>
                <Button to={PATHS.contact} variant="outline">{notFoundCopy.contact}</Button>
              </nav>
            </div>
            <div className="col-span-full md:col-span-4 lg:col-span-4 lg:col-start-9">
              <div className="hero-fade mx-auto max-w-[24rem] [animation-delay:160ms]">
                <Media slot="notFoundImage" shape="arch" aspect="4:5" sizes="(min-width: 1024px) 24rem, 80vw" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
