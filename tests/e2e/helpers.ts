import type { Page } from '@playwright/test'

export const PUBLIC_ROUTES = ['/', '/about', '/services', '/gallery', '/reviews', '/contact', '/privacy', '/terms'] as const
export const ALL_ROUTES = [...PUBLIC_ROUTES, '/styleguide'] as const
export const VIEWPORTS = [390, 430, 768, 1024, 1280, 1440, 1920] as const

/** Collects console errors/warnings and uncaught page errors (incl. React hydration errors). */
export function watchConsole(page: Page) {
  const problems: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') problems.push(`${msg.type()}: ${msg.text()}`)
  })
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`))
  return problems
}
