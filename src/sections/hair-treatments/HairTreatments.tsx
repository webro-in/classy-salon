import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ContentMarker } from '@/components/content/ContentMarker'
import { Icon } from '@/components/icons/Icon'
import { Media } from '@/components/media/Media'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { homeCopy } from '@/data/home'
import { displayLabel, getGroup } from '@/data/services'
import { copyOf } from '@/lib/content'
import { useRail } from './useRail'

const RAIL_ID = 'hair-treatments-rail'

/**
 * Chapter 4: the client's hair treatments as a horizontal editorial rail.
 * Touch: native swipe with snap. Mouse: drag or the arrow buttons.
 * Keyboard: the rail is a focusable, labelled region (arrow keys scroll it).
 * Full-bleed inside its own scroll container, so the page never overflows.
 */
export function HairTreatments() {
  const hair = getGroup('hair')
  const { ref: railRef, atStart, atEnd, progress, step, onScroll, pointer } = useRail()

  const controls = (
    <div className="flex items-center gap-2">
      {([[-1, 'Previous'], [1, 'Next']] as const).map(([dir, label]) => (
        <button
          key={label}
          type="button"
          onClick={() => step(dir)}
          disabled={dir === -1 ? atStart : atEnd}
          aria-controls={RAIL_ID}
          aria-label={`${label} treatments`}
          className="inline-flex size-12 items-center justify-center border border-rule text-fg transition-colors duration-(--duration-ui) hover:border-fg disabled:cursor-default disabled:opacity-35 disabled:hover:border-rule"
        >
          <Icon name="arrow" size={20} className={dir === -1 ? 'rotate-180' : undefined} />
        </button>
      ))}
    </div>
  )

  return (
    <Section tone="ivory" id="hair-treatments" labelledBy="hair-treatments-title" className="overflow-hidden">
      <Container>
        <ChapterHeader
          eyebrow={homeCopy.hairTreatments.eyebrow}
          title={homeCopy.hairTreatments.title}
          headingId="hair-treatments-title"
          intro={homeCopy.hairTreatments.intro}
          action={<div className="hidden md:block">{controls}</div>}
        />
      </Container>

      <div
        ref={railRef}
        id={RAIL_ID}
        role="region"
        aria-label="Hair treatments, scroll horizontally"
        // Scrollable regions must be keyboard reachable (WCAG 2.1.1).
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onScroll={onScroll}
        {...pointer}
        className="rail mt-10 cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-(--spacing-margin) data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none data-[dragging=true]:select-none"
      >
        <ol className="flex w-max gap-(--spacing-gutter) px-(--spacing-margin) pb-2 2xl:px-[max(var(--spacing-margin),calc((100vw-var(--container-content))/2))]">
          {hair.items.filter((item) => !homeCopy.hairTreatments.hidden.includes(item.id)).map((item) => {
            const description = copyOf(item.description)
            return (
              <li key={item.id} data-rail-item className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-[22rem]">
                <article className="group">
                  <Media slot={`service.${item.id}`} aspect="4:5" sizes="(min-width: 640px) 22rem, 78vw" className="pointer-events-none" />
                  <div className="mt-5 border-t border-rule pt-4">
                    <h3 className="font-display text-h3">{displayLabel(item)}</h3>
                  </div>
                  {description ? (
                    <p className="mt-3 text-small text-fg-muted">{description}</p>
                  ) : (
                    <div className="mt-3"><ContentMarker kind="description">{item.sourceLabel}</ContentMarker></div>
                  )}
                  {item.flag && <div className="mt-2"><ContentMarker kind="confirm">{item.flag}</ContentMarker></div>}
                </article>
              </li>
            )
          })}
        </ol>
      </div>

      <Container className="mt-8 flex items-center gap-6">
        <div aria-hidden="true" className="relative h-px flex-1 bg-rule">
          <span className="absolute inset-y-0 left-0 bg-fg transition-[width] duration-150" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <div className="md:hidden">{controls}</div>
      </Container>
    </Section>
  )
}
