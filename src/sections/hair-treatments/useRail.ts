import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Horizontal rail behaviour: native scroll + scroll-snap (touch and trackpad),
 * previous/next buttons, scroll progress, and click-drag for mouse users.
 * Keyboard users scroll the focused region with the arrow keys natively.
 */
export function useRail() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [state, setState] = useState({ atStart: true, atEnd: false, progress: 0 })
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setState({ atStart: el.scrollLeft <= 2, atEnd: el.scrollLeft >= max - 2, progress: max > 0 ? el.scrollLeft / max : 1 })
  }, [])

  useEffect(() => {
    measure()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  const step = useCallback(
    (dir: 1 | -1) => {
      const el = ref.current
      if (!el) return
      const card = el.querySelector<HTMLElement>('[data-rail-item]')
      const gap = parseFloat(getComputedStyle(el.firstElementChild as Element).columnGap || '0') || 0
      el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth * 0.8) + gap), behavior: reduced ? 'auto' : 'smooth' })
    },
    [reduced],
  )

  const pointer = {
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse' || !ref.current) return
      drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false }
    },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      const d = drag.current
      if (!d || !ref.current) return
      const dx = e.clientX - d.x
      if (Math.abs(dx) > 4 && !d.moved) {
        d.moved = true
        ref.current.setPointerCapture(e.pointerId)
        ref.current.dataset.dragging = 'true'
      }
      if (d.moved) ref.current.scrollLeft = d.left - dx
    },
    onPointerUp: (e: PointerEvent<HTMLDivElement>) => {
      if (ref.current?.hasPointerCapture(e.pointerId)) ref.current.releasePointerCapture(e.pointerId)
      if (ref.current) delete ref.current.dataset.dragging
      drag.current = null
    },
  }

  return { ref, ...state, step, onScroll: measure, pointer }
}
