import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface CountUpProps {
  /** Final number, e.g. 4.8 or 1500. */
  value: number
  decimals?: number
  /** Text after the number, e.g. "+". */
  suffix?: string
  /** Seconds. */
  duration?: number
  className?: string
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * A verified figure that counts up from zero the first time it scrolls into
 * view. The static HTML (and reduced motion) always shows the final value;
 * assistive tech reads only the final value, never the moving digits.
 */
export function CountUp({ value, decimals = 0, suffix = '', duration = 1.8, className }: CountUpProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  const final = `${value.toFixed(decimals)}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (reduced || !el || typeof IntersectionObserver === 'undefined') return
    let raf = 0
    let started = false
    const start = () => {
      started = true
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / (duration * 1000))
        setShown(value * easeOutCubic(p))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    setShown(0)
    const io = new IntersectionObserver(
      (entries) => {
        if (!started && entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          start()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      setShown(value)
    }
  }, [reduced, value, duration])

  return (
    <span ref={ref} className={className} data-count-up={final}>
      <span aria-hidden="true" className="tabular-nums">{`${shown.toFixed(decimals)}${suffix}`}</span>
      <span className="sr-only">{final}</span>
    </span>
  )
}

/** Splits a display label such as "1500+" into its number and suffix. */
export function parseCountLabel(label: string): { value: number; suffix: string } | null {
  const m = /^([\d,]+(?:\.\d+)?)(.*)$/.exec(label.trim())
  if (!m) return null
  return { value: Number(m[1]!.replace(/,/g, '')), suffix: m[2]! }
}
