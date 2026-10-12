import { useState } from 'react'
import { Container } from '@/components/layout/Container'
import { Section, type Tone } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Media } from '@/components/media/Media'
import { Reveal } from '@/components/motion/Reveal'
import { getSlot } from '@/data/media'
import { displayLabel, groupMedia } from '@/data/services'
import { cx } from '@/lib/cx'
import type { ServiceGroup } from '@/types/content'
import { ServiceRow } from './ServiceRow'

/**
 * One service category (Hair / Skin / Makeup), structured like an editorial
 * menu: numbered heading and summary, then the item rows. On desktop the
 * category photo sits in a sticky arched frame and crossfades to the photo of
 * the row being explored (when that service has one).
 */
export function ServiceCategory({ group, tone }: { group: ServiceGroup; tone: Tone }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const headingId = `${group.id}-title`
  const lead = groupMedia[group.id]
  const active = group.items.find((i) => i.id === activeId)
  const frames = [lead, ...group.items.map((i) => `service.${i.id}`).filter((id) => getSlot(id).src)]
  const shown = active && getSlot(`service.${active.id}`).src ? `service.${active.id}` : lead

  return (
    <Section tone={tone} id={group.id} labelledBy={headingId} className="scroll-mt-16 lg:scroll-mt-20">
      <Container>
        <div className="grid-editorial gap-y-10">
          {/* Sticky category media (desktop) */}
          <div className="col-span-full hidden lg:col-span-5 lg:block">
            <div className="sticky top-[calc(var(--spacing-header)+6rem)]">
              <div className="arch relative aspect-[4/5] w-full overflow-hidden bg-(--tone-placeholder)">
                {frames.map((id) => (
                  <div
                    key={id}
                    aria-hidden={id !== shown}
                    className={cx('absolute inset-0 transition-opacity duration-(--duration-reveal) ease-(--ease-out) motion-reduce:transition-none', id === shown ? 'opacity-100' : 'opacity-0')}
                  >
                    <Media slot={id} fit="fill" sizes="(min-width: 1024px) 38vw, 100vw" />
                  </div>
                ))}
              </div>
              <p className="label mt-4 text-fg-muted" aria-live="polite">
                {active && getSlot(`service.${active.id}`).src ? displayLabel(active) : group.title}
              </p>
            </div>
          </div>

          <div className="col-span-full lg:col-span-7 lg:col-start-6">
            <Reveal className="border-b border-fg pb-8">
              <p className="label text-fg-muted">
                {group.items.length} services
              </p>
              <h2 id={headingId} className="mt-4 font-display text-display leading-[0.95]">{group.title}</h2>
              {group.summary.status === 'pending' ? (
                <ContentMarker className="mt-5">{group.summary.note}</ContentMarker>
              ) : (
                <p className="mt-5 max-w-[52ch] text-lead text-fg-muted">{group.summary.value}</p>
              )}
            </Reveal>

            {/* Category image (mobile / tablet) */}
            <div className="mt-8 lg:hidden">
              <Media slot={lead} aspect="4:3" sizes="100vw" />
            </div>

            <ul className="mt-2" aria-label={`${group.title} services`}>
              {group.items.map((item) => (
                <ServiceRow
                  key={item.id}
                  item={item}
                  open={openId === item.id}
                  onToggle={() => setOpenId((v) => (v === item.id ? null : item.id))}
                  onFocusRow={() => setActiveId(item.id)}
                />
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
