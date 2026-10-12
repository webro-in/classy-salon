/**
 * Content readiness report.
 *
 *   npm run content:check          → report only (never fails on missing client data)
 *   npm run content:check:strict   → release gate: exits 1 on any blocker
 *
 * Rules live in scripts/content-rules.ts.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { buildEnv } from './env'
import { evaluateContent } from './content-rules'
import { business } from '../src/data/business'
import { serviceGroups } from '../src/data/services'
import { brands } from '../src/data/brands'
import { mediaSlots } from '../src/data/media'
import { reviews } from '../src/data/reviews'
import { faqItems } from '../src/data/faq'
import { aboutContent } from '../src/data/about'
import { teamMembers } from '../src/data/team'
import { galleryItems } from '../src/data/gallery'
import { consent } from '../src/data/consent'
import { legal } from '../src/data/legal'

const strict = process.argv.includes('--strict')
const rawContent = Object.fromEntries(
  readdirSync('content').filter((f) => f.endsWith('.json')).map((f) => [f, readFileSync(`content/${f}`, 'utf8')]),
)
const report = evaluateContent({ business, serviceGroups, brands, mediaSlots, about: aboutContent, reviews, faqItems, legal, analyticsProvider: buildEnv().analyticsProvider, galleryItems, peopleConsent: consent.peopleInMedia, siteUrl: buildEnv().siteUrl, rawContent })
if (teamMembers.length === 0) report.info.push('team: no approved people (team section hidden)')
if (faqItems.length === 0) report.info.push('faq: CLIENT FAQ CONTENT REQUIRED (optional: the FAQ section stays hidden in production until supplied)')

const print = (title: string, list: string[], mark: string) => {
  if (!list.length) return
  console.log(`\n${title} (${list.length})`)
  list.forEach((l) => console.log(`  ${mark} ${l}`))
}

console.log(`Content schemas valid ✓   mode: ${strict ? 'PRODUCTION (release gate)' : 'preview (placeholders allowed)'}`)
print(strict ? 'RELEASE BLOCKERS' : 'Needed before release', report.blockers, strict ? '✗' : '○')
print('Draft copy awaiting client review', report.warnings, '!')
print('Info', report.info, '·')

if (strict && report.blockers.length) {
  console.error(`\n✗ Release blocked: ${report.blockers.length} item(s) need verified client content.\n  Preview builds still work: npm run build`)
  process.exit(1)
}
console.log(strict ? '\n✓ Release content check passed.' : `\n${report.blockers.length} item(s) needed before release. Preview build continues.`)
