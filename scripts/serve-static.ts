/**
 * Minimal static file server that behaves like a static host (Vercel cleanUrls):
 *   /about        → dist/about/index.html
 *   /about/       → 308 redirect to /about
 *   /assets/x.js  → file, long-cache
 *   unknown path  → dist/404.html with HTTP 404 (no SPA fallback)
 * Used by `npm run preview` and the e2e tests. Production uses a real static host.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? 'dist')
const port = Number(process.env.PORT ?? 4173)

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.mp4': 'video/mp4', '.webm': 'video/webm',
}

function isFile(p: string) {
  return existsSync(p) && statSync(p).isFile()
}

function resolveFile(urlPath: string): string | null {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  const base = join(root, safe)
  if (!base.startsWith(root)) return null
  if (isFile(base)) return base
  if (isFile(join(base, 'index.html'))) return join(base, 'index.html')
  if (isFile(`${base}.html`)) return `${base}.html`
  return null
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    res.writeHead(308, { Location: url.pathname.replace(/\/+$/, '') + url.search })
    res.end()
    return
  }
  const file = resolveFile(url.pathname)
  const target = file ?? join(root, '404.html')
  // The 404 page itself (/404 or /404.html) is also served with a 404 status.
  const status = file && target !== join(root, '404.html') ? 200 : 404
  const type = types[extname(target)] ?? 'application/octet-stream'
  const cache = target.includes(`${join(root, 'assets')}`) ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate'
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': cache, 'X-Content-Type-Options': 'nosniff' })
  createReadStream(target).pipe(res)
}).listen(port, () => {
  console.log(`Static preview: http://localhost:${port}  (root: ${root})`)
})
