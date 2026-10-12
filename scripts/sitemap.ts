/** Writes dist/sitemap.xml and dist/robots.txt for the public routes only. */
import { writeFileSync } from 'node:fs'
import { PUBLIC_PATHS } from '../src/app/paths'
import { buildEnv } from './env'

const { siteUrl } = buildEnv()
const lastmod = new Date().toISOString().slice(0, 10)

const urls = PUBLIC_PATHS.map(
  (p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc><lastmod>${lastmod}</lastmod></url>`,
).join('\n')

writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
writeFileSync('dist/robots.txt', buildEnv().staging
  ? 'User-agent: *\nDisallow: /\n' // client preview: keep it out of search engines
  : `User-agent: *\nAllow: /\nDisallow: /styleguide\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
console.log(`sitemap.xml (${PUBLIC_PATHS.length} urls) + robots.txt → dist/`)
