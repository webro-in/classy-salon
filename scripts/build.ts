/**
 * Build entry with two explicit modes (docs/DEPLOYMENT.md).
 *
 *   npm run build               PREVIEW: placeholders + dev markers allowed,
 *                               missing client data is reported, never fatal.
 *   npm run build:production    RELEASE: VITE_STRICT_CONTENT=true. Fails on any
 *                               missing/unverified client data, unconfirmed
 *                               service names, required placeholder media,
 *                               fake or reference content, and on any marker,
 *                               placeholder or scaffold left in the HTML.
 *
 * Cross-platform (no shell env syntax). `npm run dev` never runs these checks.
 */
import { spawnSync } from 'node:child_process'

const production = process.argv.includes('--production')
const env = { ...process.env, VITE_STRICT_CONTENT: production ? 'true' : 'false' }

const steps: Array<[string, string[]]> = [
  ['tsx', ['scripts/content-check.ts', ...(production ? ['--strict'] : [])]],
  ['vite-react-ssg', ['build']],
  ['tsx', ['scripts/sitemap.ts']],
  ['tsx', ['scripts/verify-dist.ts']],
]

console.log(`\n▸ Build mode: ${production ? 'PRODUCTION (release validation)' : 'PREVIEW (placeholders allowed)'}\n`)
for (const [cmd, args] of steps) {
  const r = spawnSync('npx', [cmd, ...args], { stdio: 'inherit', env, shell: process.platform === 'win32' })
  if (r.status !== 0) {
    console.error(`\n✗ ${production ? 'Production' : 'Preview'} build failed at: ${cmd} ${args.join(' ')}`)
    process.exit(r.status ?? 1)
  }
}
console.log(`\n✓ ${production ? 'Production release build passed' : 'Preview build complete'} → dist/`)
