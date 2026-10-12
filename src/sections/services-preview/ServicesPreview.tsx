import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '@/app/paths'
import { Button } from '@/components/buttons/Button'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Icon } from '@/components/icons/Icon'
import { Media } from '@/components/media/Media'
import { Reveal } from '@/components/motion/Reveal'
import { ChapterHeader } from '@/components/sections/ChapterHeader'
import { homeCopy } from '@/data/home'
import { serviceGroups } from '@/data/services'
import { copyOf } from '@/lib/content'
import { cx } from '@/lib/cx'
import type { ServiceGroupId } from '@/types/content'

const groupImage: Record<ServiceGroupId, string> = {
  hair: 'serviceHairImage',
  skin: 'serviceSkinImage',
  makeup: 'serviceMakeupImage',
}

/**
 * Chapter 3: Our Services, group level only (full detail lives on /services).
 * Desktop: hovering or focusing a row swaps the image in a sticky frame.
 * Mobile: each row carries its own image. Rows link to /services#<group>.
 */
export function ServicesPreview() {
  const [active, setActive] = useState(0)

  return (
    <Section tone="cream" id="services" labelledBy="services-title">
      <Container>
        <ChapterHeader
          eyebrow={homeCopy.services.eyebrow}
          title={homeCopy.services.title}
          headingId="services-title"
          intro={homeCopy.services.intro}
          action={<Button to={PATHS.services} variant="outline" icon="arrow" iconPosition="end">{homeCopy.services.action}</Button>}
        />

        <div className="grid-editorial mt-4 lg:mt-0">
          <Reveal as="ol" stagger className="col-span-full lg:col-span-7">
            {serviceGroups.map((g, i) => {
              const summary = copyOf(g.summary)
              const isActive = i === active
              return (
                <li key={g.id} className="border-b border-rule">
                  <Link
                    to={`${PATHS.services}#${g.id}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-5 py-8 no-underline lg:py-10"
                  >
                    <span>
                      <span className={cx('block font-display text-display transition-[color,transform] duration-(--duration-ui) ease-(--ease-out) lg:group-hover:translate-x-2', isActive ? 'text-fg' : 'text-fg lg:text-fg/55')}>
                        {g.title}
                      </span>
                      {summary && <span className="mt-4 block max-w-[38ch] text-body text-fg-muted">{summary}</span>}
                      <span className="mt-3 block label text-fg-muted">{g.items.length} services</span>
                    </span>
                    <span aria-hidden="true" className="pt-4 text-fg transition-transform duration-(--duration-ui) ease-(--ease-out) group-hover:translate-x-1">
                      <Icon name="arrow" size={22} />
                    </span>
                    {/* Mobile/tablet image */}
                    <span className="col-span-full block lg:hidden">
                      <Media slot={groupImage[g.id]} aspect="3:2" sizes="100vw" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </Reveal>

          {/* Desktop sticky preview */}
          <div className="col-span-4 col-start-9 hidden lg:block">
            <div className="sticky top-[calc(var(--spacing-header)+2rem)] mt-10">
              <div className="relative">
                {serviceGroups.map((g, i) => (
                  <div
                    key={g.id}
                    aria-hidden={i !== active}
                    className={cx('transition-[opacity,clip-path] duration-700 ease-(--ease-out)', i === 0 ? 'relative' : 'absolute inset-0', i === active ? 'opacity-100 [clip-path:inset(0)]' : 'opacity-0 [clip-path:inset(0_0_8%_0)]')}
                  >
                    <Media slot={groupImage[g.id]} shape="arch" sizes="30vw" />
                  </div>
                ))}
              </div>
              <p className="mt-4 label text-fg-muted" aria-hidden="true">
                {serviceGroups[active]!.title}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
