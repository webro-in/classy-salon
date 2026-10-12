import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from '@/config/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface RevealProps {
  children: ReactNode
  as?: 'div' | 'ul' | 'ol' | 'section'
  className?: string
  /** Animate direct children one after another. */
  stagger?: boolean
  delay?: number
}

/**
 * Scroll reveal (fade + rise). Content is fully visible in the static HTML and
 * without JavaScript; GSAP only adds the entrance on capable, motion-OK clients.
 */
export function Reveal({ children, as: Tag = 'div', className, stagger = false, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      const el = ref.current
      if (!el || reduced) return
      const targets = stagger ? Array.from(el.children) : [el]
      // Opacity only — never autoAlpha/visibility: hidden content would drop out of the
      // accessibility tree until scrolled into view (screen readers would skip sections).
      gsap.from(targets, {
        opacity: 0,
        y: motion.distance.reveal,
        duration: motion.duration.reveal,
        ease: motion.ease.out,
        delay,
        stagger: stagger ? motion.stagger : 0,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    },
    { scope: ref, dependencies: [reduced, stagger, delay] },
  )

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic ref across a fixed tag union
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  )
}
