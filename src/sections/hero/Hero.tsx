import { useEffect, useState } from 'react'
import { ActionLink } from '@/components/buttons/ActionLink'
import { Button } from '@/components/buttons/Button'
import { Media } from '@/components/media/Media'
import { motion } from '@/config/motion'
import { business, locationLine } from '@/data/business'
import { getSlot } from '@/data/media'
import { bookingCta } from '@/data/navigation'
import { trackBookingClick } from '@/lib/analytics'
import { cx } from '@/lib/cx'
import { heroSlides } from './heroSlides'
import { useCarousel } from './useCarousel'

const COUNT = heroSlides.length
/** Slides plus a copy of the first, so the loop always moves the same way (no visible rewind). */
const TRACK = [...heroSlides, heroSlides[0]!]

/**
 * Home hero: full-bleed photo slider (salon and model photos alternate), the
 * salon name, location and booking actions. Each photo holds for
 * `motion.heroHoldSeconds`, then the next one slides in horizontally.
 *
 * Accessibility: carousel region with labelled slides; inactive slides are
 * inert/hidden; rotation pauses while keyboard focus is inside; a pause button
 * appears for keyboard users on focus (WCAG 2.2.2); no autoplay with reduced motion.
 * All slides load eagerly so no photo fades in mid-slide (no flash on the loop). The static HTML
 * renders slide 1, so it is stable before hydration.
 */
export function Hero() {
  const { active, next, rotating, reduced, userPaused, togglePaused, bind } = useCarousel(COUNT, { pauseOnHover: false })
  // Track position: COUNT means "showing the clone of slide 1" before snapping back to 0.
  const [pos, setPos] = useState(0)
  const [animate, setAnimate] = useState(true)

  // Follow the logical slide. Moving from the last slide to the first goes forward onto the clone.
  useEffect(() => {
    setPos((p) => (active === 0 && p === COUNT - 1 ? COUNT : active))
  }, [active])

  // After landing on the clone, jump (without animation) to the real first slide.
  useEffect(() => {
    if (pos !== COUNT) return
    const t = window.setTimeout(() => {
      setAnimate(false)
      setPos(0)
    }, reduced ? 0 : motion.heroSlideMs + 20)
    return () => window.clearTimeout(t)
  }, [pos, reduced])

  useEffect(() => {
    if (animate) return
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)))
    return () => cancelAnimationFrame(raf)
  }, [animate])

  // Autoplay: hold, then advance.
  useEffect(() => {
    if (!rotating) return
    const t = window.setTimeout(next, motion.heroHoldSeconds * 1000 + motion.heroSlideMs)
    return () => window.clearTimeout(t)
  }, [rotating, active, next])

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`${business.name}: photo slideshow`}
      className="hero tone-dark relative isolate flex min-h-[max(36rem,calc(100svh-var(--spacing-header)))] flex-col justify-end overflow-hidden bg-tone text-fg"
      data-hero-slider
      {...bind}
    >
      {/* Slides */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={cx('flex h-full will-change-transform', animate && !reduced && 'transition-transform ease-[cubic-bezier(0.65,0,0.35,1)]')}
          style={{ transform: `translate3d(${-pos * 100}%,0,0)`, transitionDuration: `${motion.heroSlideMs}ms` }}
          data-hero-track
          data-position={pos}
        >
          {TRACK.map((slide, i) => {
            const isClone = i === COUNT
            const isActive = i === pos
            return (
              <div
                key={isClone ? 'clone' : slide.slot}
                role={isClone ? undefined : 'group'}
                aria-roledescription={isClone ? undefined : 'slide'}
                aria-label={isClone ? undefined : `${i + 1} of ${COUNT}: ${getSlot(slide.slot).alt}`}
                aria-hidden={isClone || !isActive}
                inert={isClone || !isActive}
                className="relative h-full w-full shrink-0"
                data-hero-slide={isClone ? undefined : i + 1}
              >
                <Media slot={slide.slot} fit="fill" priority={i === 0 || isClone} eager sizes="100vw" />
              </div>
            )
          })}
        </div>
        {/* Legibility scrims (photographic only, no decorative gradients). */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(25_23_20/0.35)_0%,rgb(25_23_20/0)_26%,rgb(25_23_20/0.12)_42%,rgb(25_23_20/0.86)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[rgb(25_23_20/0.3)] lg:hidden" />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(25_23_20/0.55)_0%,rgb(25_23_20/0)_50%)] lg:block" />
      </div>

      <div className="container-page relative pb-28 pt-24 lg:pb-16">
        <div className="grid-editorial items-end gap-y-10">
          {/* Identity + actions */}
          <div className="col-span-full lg:col-span-8">
            <p className="hero-rise label text-on-night/80" style={{ animationDelay: '80ms' }}>
              {locationLine}
            </p>
            <h1 className="mt-5 text-on-night">
              <span className="hero-rise block font-display text-hero" style={{ animationDelay: '160ms' }}>
                {business.shortName}
              </span>
              <span className="hero-rise label mt-4 block text-on-night/85 lg:mt-5" style={{ animationDelay: '260ms' }}>
                {business.descriptor}
              </span>
            </h1>
            <div className="hero-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '360ms' }}>
              <Button to={bookingCta.to} variant="solid" onClick={() => trackBookingClick('hero')}>
                {bookingCta.label}
              </Button>
              <ActionLink kind="whatsapp" location="hero" />
            </div>
          </div>

          {/* No visible controls (client request). Keyboard users still get a pause
              button that appears only when it receives focus (WCAG 2.2.2). */}
          {!reduced && (
            <div className="col-span-full lg:col-span-4 lg:flex lg:justify-end">
              <button
                type="button"
                onClick={togglePaused}
                className="sr-only rounded-full border-on-night/40 label text-on-night focus:not-sr-only focus:inline-flex focus:border focus:px-4 focus:py-2"
              >
                {userPaused ? 'Play slideshow' : 'Pause slideshow'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
