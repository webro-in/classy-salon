import { ContentMarker } from '@/components/content/ContentMarker'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { Heading, Lead } from '@/components/typography/Typography'
import { showContentMarkers } from '@/config/site'
import type { Crumb } from '@/config/seo'
import { effectiveDate, formatLegalDate, type LegalDocument, type LegalSection } from '@/data/legal'
import { LegalText } from './LegalText'

/**
 * Shared layout for Privacy and Terms: the same Classy typography, simpler
 * than marketing pages. Header (breadcrumbs, h1, intro, last-updated), a
 * sticky contents list on desktop, and a readable numbered article.
 * Optional sections that are still pending are omitted in production.
 */
export function LegalPage({ doc, trail }: { doc: LegalDocument; trail: Crumb[] }) {
  // Without markers, sections whose content is still entirely pending are left out (production stays blocked on required ones).
  const sections = doc.sections.filter((s) => showContentMarkers || !s.blocks.every((b) => b.kind === 'pending'))
  return (
    <>
      <Section tone="ivory" spacing="none" labelledBy="page-title" className="pt-10 lg:pt-14">
        <Container>
          <Breadcrumbs trail={trail} className="hero-rise" />
          <div className="mt-10 border-b border-rule pb-10 lg:mt-16 lg:pb-14">
            <Heading as="h1" id="page-title" size="h1" className="hero-rise [animation-delay:120ms]">{doc.title}</Heading>
            <Lead className="hero-rise mt-6 max-w-[46ch] text-fg-muted [animation-delay:200ms]">{doc.intro}</Lead>
            {(effectiveDate || showContentMarkers) && (
              <p className="label hero-rise mt-8 text-fg-muted [animation-delay:260ms]" data-effective-date>
                Last updated{' '}
                {effectiveDate ? <span className="text-fg">{formatLegalDate(effectiveDate)}</span> : <ContentMarker kind="legal" inline>effective date</ContentMarker>}
              </p>
            )}
          </div>
        </Container>
      </Section>

      <Section tone="ivory" spacing="small">
        <Container>
          <div className="grid-editorial gap-y-10">
            <nav aria-label="On this page" className="col-span-full lg:col-span-3">
              <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
                <p className="label text-fg-muted">On this page</p>
                <ol className="mt-4 space-y-1 text-small">
                  {sections.map((s) => (
                    <li key={s.id} className="flex gap-3">
                      <a href={`#${s.id}`} className="inline-flex min-h-8 items-center text-fg-muted no-underline hover:text-fg hover:underline underline-offset-[0.3em]">{s.title}</a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <article className="col-span-full lg:col-span-8 lg:col-start-5" data-legal-article>
              {sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-28 border-t border-rule py-10 first:border-t-0 first:pt-0">
                  <h2 id={`${s.id}-title`} className="font-display text-h3">
                    {s.title}
                  </h2>
                  <div className="mt-5 max-w-[68ch] space-y-4 text-body text-fg-muted">
                    {s.blocks.map((b, j) => {
                      if (b.kind === 'p') return <p key={j}><LegalText text={b.text} /></p>
                      if (b.kind === 'list') return (
                        <ul key={j} className="space-y-2 pl-0">
                          {b.items.map((it) => (
                            <li key={it} className="flex gap-3"><span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-accent" /><span><LegalText text={it} /></span></li>
                          ))}
                        </ul>
                      )
                      return <ContentMarker key={j} kind={b.marker} className="mt-1">{b.note}</ContentMarker>
                    })}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </Container>
      </Section>
    </>
  )
}

export function isOptionalPending(s: LegalSection): boolean {
  return s.blocks.length > 0 && s.blocks.every((b) => b.kind === 'pending' && !b.required)
}
