/**
 * Proves the build is a finished static site (docs/DRD.md §3.3).
 * Fails if any route's HTML is missing or lacks real prerendered content.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PATHS, PUBLIC_PATHS } from '../src/app/paths'
import { buildEnv } from './env'
import { FORBIDDEN_CONTENT } from './forbidden'

const { strict, staging } = buildEnv()
const clean = strict || staging
const errors: string[] = []
const fileFor = (p: string) => (p === '/' ? 'dist/index.html' : `dist${p}/index.html`)

function textContent(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function check(path: string, file: string, opts: { canonical: boolean }) {
  if (!existsSync(file)) {
    errors.push(`${path}: missing ${file}`)
    return
  }
  const html = readFileSync(file, 'utf8')
  const bytes = Buffer.from(html)
  const need = (re: RegExp, what: string) => { if (!re.test(html)) errors.push(`${path}: missing ${what}`) }
  need(/<title[^>]*>[^<]{10,}<\/title>/, '<title>')
  need(/<meta[^>]+name="description"[^>]+content="[^"]{50,}"/, 'meta description (≥50 chars)')
  need(/<h1[\s>]/, '<h1>')
  need(/<meta[^>]+property="og:title"/, 'og:title')
  need(/<html[^>]+lang="en-IN"/, 'html lang')
  if (opts.canonical) need(/<link[^>]+rel="canonical"/, 'canonical link')
  if ((html.match(/<h1[\s>]/g) ?? []).length > 1) errors.push(`${path}: more than one <h1>`)
  if (/<link rel="modulepreload"[^>]*\.scene-/.test(html)) errors.push(`${path}: 3D scene chunk is modulepreloaded`)
  if (bytes.indexOf('charset') > 1024) errors.push(`${path}: <meta charset> beyond first 1024 bytes`)
  if (!/<div id="root"[^>]*>\s*<[a-z]/i.test(html)) errors.push(`${path}: #root is empty (not prerendered)`)
  if (textContent(html).length < 200) errors.push(`${path}: too little prerendered text`)
  for (const { pattern, reason } of FORBIDDEN_CONTENT) if (pattern.test(textContent(html))) errors.push(`${path}: ${reason}`)
  if (clean && /data-content-marker/.test(html)) errors.push(`${path}: developer marker in a client-facing build`)
  if (staging && !/name="robots" content="noindex/.test(html)) errors.push(`${path}: staging page must be noindex`)
  if (strict && /data-media-placeholder/.test(html)) errors.push(`${path}: placeholder media`)
  if (strict && /data-scaffold/.test(html)) errors.push(`${path}: unbuilt section scaffold`)
}

for (const p of PUBLIC_PATHS) check(p, fileFor(p), { canonical: !staging }) // staging pages are noindex: no canonical
check('404', 'dist/404.html', { canonical: false })
if (existsSync('dist/404')) errors.push('dist/404/ directory should have been moved to dist/404.html')
if (clean && existsSync(fileFor(PATHS.styleguide))) errors.push('styleguide must not ship in strict builds')
for (const f of ['dist/sitemap.xml', 'dist/robots.txt', 'dist/icons/favicon.svg', 'dist/site.webmanifest']) {
  if (!existsSync(f)) errors.push(`missing ${f}`)
}

const htmlFiles: string[] = []
const walk = (d: string) => readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.html') && htmlFiles.push(join(d, e.name))))
walk('dist')

if (errors.length) {
  console.error(`\n✗ verify-dist failed${strict ? ' (production)' : ''} (${errors.length}):\n${errors.map((e) => `  • ${e}`).join('\n')}\n`)
  process.exit(1)
}
console.log(`✓ verify-dist: ${htmlFiles.length} prerendered HTML files OK${strict ? ' (strict)' : ''}`)
htmlFiles.sort().forEach((f) => console.log(`  ${f}`))
