import { loadEnv } from 'vite'

/** Same env resolution as vite.config.ts (process.env overrides .env files). */
export function buildEnv() {
  const env = { ...loadEnv('production', process.cwd(), 'VITE_'), ...process.env }
  return {
    siteUrl: (env.VITE_SITE_URL ?? 'https://classy-unisex-salon.example').replace(/\/+$/, ''),
    strict: env.VITE_STRICT_CONTENT === 'true',
    staging: env.VITE_STAGING === 'true',
    analyticsProvider: env.VITE_ANALYTICS_PROVIDER ?? 'none',
  }
}

export { PLACEHOLDER_DOMAIN } from './content-rules'
