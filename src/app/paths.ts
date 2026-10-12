/**
 * Single source of truth for route paths.
 * Imported by vite.config.ts (prerender list) and the router, so it must stay
 * free of React/browser imports.
 */
export const PATHS = {
  home: '/',
  about: '/about',
  services: '/services',
  gallery: '/gallery',
  reviews: '/reviews',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  styleguide: '/styleguide',
} as const

export type RouteKey = keyof typeof PATHS

/** Rendered through the catch-all route and moved to dist/404.html after the build. */
export const NOT_FOUND_PRERENDER_PATH = '404'

/** Public pages that ship to production and appear in the sitemap. */
export const PUBLIC_PATHS = [
  PATHS.home,
  PATHS.about,
  PATHS.services,
  PATHS.gallery,
  PATHS.reviews,
  PATHS.contact,
  PATHS.privacy,
  PATHS.terms,
] as const
