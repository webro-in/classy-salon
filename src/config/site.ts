/**
 * Site-level configuration. The only module that reads Vite env variables.
 */
const env = import.meta.env

const rawUrl = (env.VITE_SITE_URL as string | undefined) ?? 'https://classy-unisex-salon.example'

export const site = {
  /** Canonical origin without trailing slash. [CLIENT DATA REQUIRED: production domain] */
  url: rawUrl.replace(/\/+$/, ''),
  locale: 'en_IN',
  language: 'en-IN',
  /** Strict builds fail on unresolved content and hide every dev marker. */
  strictContent: env.VITE_STRICT_CONTENT === 'true',
  analytics: {
    provider: ((env.VITE_ANALYTICS_PROVIDER as string | undefined) ?? 'none') as 'none' | 'plausible' | 'ga4',
    id: (env.VITE_ANALYTICS_ID as string | undefined) ?? '',
  },
} as const

/** Dev/preview builds show visible markers for missing client content and media. */
export const showContentMarkers = !site.strictContent

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${site.url}${path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`}`
}
