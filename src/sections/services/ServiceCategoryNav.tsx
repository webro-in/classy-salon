import { useEffect, useState } from 'react'
import { serviceGroups, servicesPageCopy } from '@/data/services'
import { cx } from '@/lib/cx'

/**
 * Sticky category index under the header. Desktop: 01 / 02 / 03 with an
 * active underline. Mobile: a horizontal chip rail that scrolls inside itself
 * (never the page). Active state follows the category in view.
 */
export function ServiceCategoryNav() {
  const [active, setActive] = useState<string>(serviceGroups[0]?.id ?? '')

  useEffect(() => {
    const sections = serviceGroups.map((g) => document.getElementById(g.id)).filter((el): el is HTMLElement => Boolean(el))
    if (sections.length === 0) return
    let frame = 0
    const update = () => {
      frame = 0
      // The active category is the last one whose top has passed 40% of the viewport.
      const line = window.innerHeight * 0.4
      const current = sections.filter((s) => s.getBoundingClientRect().top <= line).pop() ?? sections[0]!
      setActive(current.id)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <nav aria-label={servicesPageCopy.nav.label} className="tone-ivory sticky top-(--spacing-header) z-30 border-b border-rule bg-tone/95 backdrop-blur-sm supports-[backdrop-filter]:bg-tone/85" data-category-nav>
      <div className="container-page">
        <ul className="-mx-1 flex snap-x gap-2 overflow-x-auto py-3 [scrollbar-width:none] lg:mx-0 lg:gap-12 lg:overflow-visible lg:py-0 [&::-webkit-scrollbar]:hidden" data-chip-rail>
          {serviceGroups.map((g) => {
            const isActive = active === g.id
            return (
              <li key={g.id} className="shrink-0 snap-start px-1 lg:px-0">
                <a
                  href={`#${g.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => setActive(g.id)}
                  className={cx(
                    'group inline-flex min-h-11 items-center gap-3 no-underline transition-colors duration-(--duration-ui)',
                    // Mobile chip
                    'rounded-pill border px-4 lg:rounded-none lg:border-0 lg:px-0',
                    isActive ? 'border-fg bg-fg text-tone lg:bg-transparent lg:text-fg' : 'border-rule text-fg-muted hover:text-fg',
                    // Desktop underline
                    'lg:relative lg:min-h-16 lg:after:absolute lg:after:inset-x-0 lg:after:bottom-0 lg:after:h-px lg:after:origin-left lg:after:bg-fg lg:after:transition-transform lg:after:duration-(--duration-ui)',
                    isActive ? 'lg:after:scale-x-100' : 'lg:after:scale-x-0 lg:hover:after:scale-x-100',
                  )}
                >
                  <span className="label">{g.title}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
