import { PATHS } from '@/app/paths'
import { CountUp, parseCountLabel } from '@/components/motion/CountUp'
import type { ReactNode } from 'react'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Icon } from '@/components/icons/Icon'
import { Reveal } from '@/components/motion/Reveal'
import { PageHero } from '@/components/sections/PageHero'
import { business, hoursSummary } from '@/data/business'
import { countServices, serviceGroups, servicesPageCopy } from '@/data/services'
import { valueOf } from '@/lib/content'

/** Our Services opening: breadcrumbs, "Our Services" h1, lead, actions and full-bleed salon image. */
export function ServiceHero() {
  return (
    <PageHero
      trail={[{ name: 'Home', path: PATHS.home }, { name: 'Our Services', path: PATHS.services }]}
      title={servicesPageCopy.hero.title}
      lead={servicesPageCopy.hero.lead}
      slot="servicesHero"
      aside={
        <div className="flex flex-wrap gap-3">
          <ActionLink kind="whatsapp" location="services-hero" variant="solid" label="Enquire on WhatsApp" />
          <Button to={`#${serviceGroups[0]?.id ?? 'hair'}`} variant="outline">View services</Button>
        </div>
      }
    />
  )
}

/**
 * Intro statement + verified trust facts (Google rating, review count,
 * opening hours, number of services). Pending facts are simply omitted.
 */
export function ServiceIntro() {
  const rating = valueOf(business.rating)
  const facts = [
    rating && { value: <CountUp value={rating.value} decimals={1} />, label: 'Google rating', star: true },
    rating && { value: countUpLabel(rating.countLabel), label: 'Google reviews' },
    { value: String(countServices), label: 'Signature services' },
    hoursSummary && { value: '9:30–9:30', label: 'Open every day', title: hoursSummary },
  ].filter(Boolean) as Array<{ value: ReactNode; label: string; star?: boolean; title?: string }>

  return (
    <Section tone="ivory" spacing="small" labelledBy="services-intro-title">
      <Container>
        <div className="grid-editorial gap-y-10">
          <Reveal className="col-span-full lg:col-span-9">
            <p className="label text-fg-muted" id="services-intro-title">{servicesPageCopy.intro.eyebrow}</p>
            <p className="mt-6 font-display text-h1 leading-[1.05] text-balance">{servicesPageCopy.intro.statement}</p>
            <p className="mt-6 max-w-[52ch] text-lead text-fg-muted">{servicesPageCopy.intro.note}</p>
          </Reveal>
        </div>
        <Reveal as="ul" stagger className="mt-12 grid grid-cols-2 border-t border-rule md:grid-cols-4">
          {facts.map((f, i) => (
            <li key={f.label} title={f.title} className={`flex flex-col gap-2 border-rule py-6 pr-4 ${i % 2 ? 'pl-4 md:pl-6' : 'md:pl-6 md:first:pl-0'} ${i < 2 ? 'border-b md:border-b-0' : ''} ${i % 2 === 1 ? 'border-l' : ''} md:border-l md:first:border-l-0`}>
              <span className="flex items-center gap-2 font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.75rem)] leading-none tabular-nums">
                {f.value}
                {f.star && <Icon name="star" size={22} className="text-accent" />}
              </span>
              <span className="label text-fg-muted">{f.label}</span>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  )
}

function countUpLabel(label: string): ReactNode {
  const c = parseCountLabel(label)
  return c ? <CountUp value={c.value} suffix={c.suffix} /> : label
}
