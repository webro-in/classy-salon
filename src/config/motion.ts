/**
 * Motion tokens (docs/DESIGN.md §10). Mirrored as CSS variables in styles/tokens.css.
 */
export const motion = {
  ease: {
    out: 'expo.out',
    /** CSS equivalent of the primary easing. */
    outCss: 'cubic-bezier(0.22, 1, 0.36, 1)',
    inOut: 'power2.inOut',
  },
  duration: {
    micro: 0.18,
    ui: 0.32,
    page: 0.42,
    reveal: 0.8,
  },
  distance: {
    reveal: 24,
    parallax: 0.08,
  },
  stagger: 0.08,
  heroSlideSeconds: 6,
  /** Home hero photo slider: hold time per photo, then a horizontal slide. */
  heroHoldSeconds: 2,
  heroSlideMs: 1100,
} as const
