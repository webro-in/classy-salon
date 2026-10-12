import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Eyebrow, Heading, Lead } from '@/components/typography/Typography'
import { ContentMarker } from '@/components/content/ContentMarker'
import { showContentMarkers } from '@/config/site'

interface PageShellProps {
  eyebrow: string
  title: string
  lead?: string
  /** Phase in which the full page is built, plus its planned sections (dev only). */
  phase: number
  planned: string[]
  children?: ReactNode
}

/**
 * Phase 1 foundation shell: a real, prerendered page (title, h1, intro, SEO)
 * with its approved section plan shown to developers only. Replaced section by
 * section in Phases 3–9.
 */
export function PageShell({ eyebrow, title, lead, phase, planned, children }: PageShellProps) {
  return (
    <>
      <Section tone="ivory" labelledBy="page-title">
        <Container>
          <div className="grid-editorial gap-y-6">
            <Eyebrow className="col-span-full">{eyebrow}</Eyebrow>
            <Heading as="h1" id="page-title" size="display" className="col-span-full lg:col-span-9">
              {title}
            </Heading>
            {lead && <Lead className="col-span-full max-w-prose text-fg-muted md:col-span-6">{lead}</Lead>}
          </div>
        </Container>
      </Section>
      {children}
      {showContentMarkers && (
        <Section tone="cream" spacing="small">
          <Container>
            <ContentMarker kind="confirm">Foundation shell. Full page is built in Phase {phase}</ContentMarker>
            <ol className="mt-6 grid gap-x-8 gap-y-2 font-mono text-caption text-fg-muted sm:grid-cols-2">
              {planned.map((p, i) => (
                <li key={p}>{String(i + 1).padStart(2, '0')} · {p}</li>
              ))}
            </ol>
          </Container>
        </Section>
      )}
    </>
  )
}
