import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Carousel state (WAI-ARIA APG "tabbed carousel").
 * - Autoplay only when motion is allowed and the user has not paused it.
 * - Rotation pauses while keyboard focus is inside the carousel (and, unless
 *   `pauseOnHover` is false, while the pointer is over it). A visible pause
 *   control is always offered.
 * - The server render never autoplays, so the static HTML is stable.
 */
export function useCarousel(count: number, { pauseOnHover = true }: { pauseOnHover?: boolean } = {}) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)

  const rootRef = useRef<HTMLElement | null>(null)

  // If the pointer was already resting on the carousel before hydration,
  // no mouseenter will ever fire: detect it once on mount.
  useEffect(() => {
    if (rootRef.current?.matches(':hover')) setHovering(true)
  }, [])

  const rotating = !reduced && !userPaused && !(pauseOnHover && hovering) && !focusWithin

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count])
  const next = useCallback(() => setActive((a) => (a + 1) % count), [count])

  return {
    active,
    go,
    next,
    rotating,
    reduced,
    userPaused,
    togglePaused: () => setUserPaused((p) => !p),
    bind: {
      ref: rootRef,
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
      onFocus: () => setFocusWithin(true),
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false)
      },
    },
  }
}
