import { useRef, type ComponentProps } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Media } from '@/components/media/Media'
import { motion } from '@/config/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cx } from '@/lib/cx'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type MediaRevealProps = ComponentProps<typeof Media> & {
  /** Subtle scroll parallax of the image inside its frame (desktop only, ≤ 8%). */
  parallax?: boolean
  wrapperClassName?: string
}

/**
 * Media that enters with a clip-path reveal and an easing inner scale, with
 * optional parallax. Static HTML and reduced motion show the media as is.
 * The frame (aspect ratio, arch) never moves, so layout cannot shift.
 */
export function MediaReveal({ parallax = false, wrapperClassName, ...media }: MediaRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || reduced) return
      const inner = el.querySelector<HTMLElement>('[data-reveal-inner]')
      gsap.fromTo(el, { clipPath: 'inset(14% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: motion.ease.out,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
      // Parallax needs headroom: the image rests at 1.1 so its edges never show while it drifts.
      const rest = parallax ? 1.1 : 1
      if (inner) gsap.fromTo(inner, { scale: rest + 0.08 }, { scale: rest, duration: 1.6, ease: motion.ease.out, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      if (parallax && inner) {
        const mm = gsap.matchMedia()
        mm.add('(min-width: 1024px)', () => {
          gsap.fromTo(inner, { yPercent: -motion.distance.parallax * 50 }, {
            yPercent: motion.distance.parallax * 50, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
        return () => mm.revert()
      }
    },
    { scope: ref, dependencies: [reduced, parallax] },
  )

  return (
    <div ref={ref} className={cx('relative overflow-hidden', media.shape === 'arch' && 'arch', wrapperClassName)}>
      <div data-reveal-inner className="origin-center will-change-transform">
        <Media {...media} />
      </div>
    </div>
  )
}
