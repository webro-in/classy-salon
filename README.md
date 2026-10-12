# Classy Unisex Salon — Website

Frontend-only, statically generated brand website for Classy Unisex Salon, Jagatpura, Jaipur.
Built by WEBRO. Planning documents live in [`docs/`](docs/).

**Status:** All pages built: Home, About, Our Services, Gallery, Reviews, Contact / Visit, Privacy Policy, Terms & Conditions and the custom 404, using the salon's real photos and videos (marked placeholders only where client content is still pending).

## Quick start

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # preview build (placeholders allowed)
npm run preview          # serve dist/ like a static host: http://localhost:4173
```

## Build modes

| Command | Mode | Missing client data | Use it for |
|---|---|---|---|
| `npm run dev` | Development | Never checked. Placeholders and dashed `[CLIENT DATA REQUIRED]` markers show | Day-to-day work |
| `npm run build` | Preview | Reported, **never fatal**. Placeholders, markers and `/styleguide` included | Client previews, staging, QA, e2e |
| `npm run build:production` | Production release | **Fails the build** | The final live release |
| `npm run preview` | n/a | n/a | Serves `dist/` like a static host on :4173 |

`npm run build:production` sets `VITE_STRICT_CONTENT=true` and fails on any of:

- pending business data (story, legal business name) and legal details (effective date, governing law in `content/legal.json`)
- no approved client reviews, missing brand logo files, or missing consent for people in photos
- analytics enabled without updating the Privacy Policy
- fake-looking contact data (e.g. `+91XXXXXXXXXX`, `test@example.com`)
- unconfirmed service names (`labelStatus: needs-confirmation`) or missing service descriptions
- required media still placeholders, missing logo files (optional slots such as per-service images and the hero video may stay empty)
- reference-site / competitor wording, partnership claims, unapproved names or filler text in `content/`
- a missing production `VITE_SITE_URL`
- and, as a second check on the rendered HTML: any content marker, placeholder media or unbuilt section scaffold, or the `/styleguide` page

Run `npm run content:check` at any time to see what is still needed (report only).
`npm run content:check:strict` runs just the release content gate.

## Quality gates

```bash
npm run typecheck
npm run lint
npm test                 # unit tests (Vitest)
npm run e2e              # end-to-end against dist/ (run `npm run build` first)
```

Node ≥ 20.19. E2E uses Playwright 1.56.1. On a new machine run `npx playwright install chromium` once.

## How the site is built

`vite-react-ssg` renders every route to finished HTML (`dist/about/index.html`, …, `dist/404.html`).
The browser then hydrates that HTML. No server is needed: deploy `dist/` to any static host.
Details: `docs/DRD.md §3`, `docs/DEPLOYMENT.md`.

## Where things live

| To change… | Edit |
|---|---|
| Phone, WhatsApp, email, hours, address, Google rating + review count | `content/business.json` |
| Client reviews (verbatim, approved) | `content/reviews.json` |
| FAQ (client questions + answers) | `content/faq.json` |
| Legal business name | `content/business.json → legalName` |
| Legal effective date, governing law, appointment policy | `content/legal.json` |
| Privacy Policy / Terms wording (draft for legal review, not legal advice) | `src/data/legal.ts` |
| Services | `content/services.json` |
| Brands | `content/brands.json` (+ logo slot in `src/data/media.ts`) |
| Gallery items | files in `public/media/gallery` + entry in `content/gallery.json` |
| Publishing consent for people in photos | `content/consent.json` |
| Photos / videos | file in `public/media/photos` or `public/media/video` + entry in the `supplied` map in `src/data/media.ts` |
| Logo / icons | `public/logo/*.svg`, then `npx tsx scripts/generate-icons.ts` |
| Page titles & descriptions | `src/config/seo.ts` |
| Navigation | `src/data/navigation.ts` |
| Colours, type, spacing | `src/styles/tokens.css` |
| Routes | `src/app/paths.ts` + `src/app/routes.tsx` |

Content fields use `status`: `verified` (shipped), `draft` (WEBRO copy awaiting client review, shipped)
or `pending` (client data required). Pending content shows as a marker in development/preview and
blocks `npm run build:production`.

## Folder structure

```
content/            client-editable JSON (validated with zod at build time)
docs/               PRD, DRD, DESIGN, ARCHITECTURE, CONTENT-MAP, MEDIA-MANIFEST, QA, DEPLOYMENT, CHANGELOG
public/             icons, media, logo (real client files go here)
scripts/            content-check, verify-dist, sitemap, serve-static, icon generator
src/app/            routes, paths, layout, prerender hooks
src/components/     layout, navigation, buttons, media, typography, icons, motion, three, seo, content
src/config/         site, seo, motion
src/data/           typed adapters over content/ + media slot registry
src/lib/            links (WhatsApp/tel/mailto/maps/instagram), analytics, content helpers
src/pages/          one folder per route
src/styles/         tokens.css, base.css, fonts.css
tests/unit, tests/e2e
```

## Rules

No invented business facts, services, prices, reviews, awards or partnership claims.
No reference-site, stock or AI imagery. See `docs/PRD.md §10`.
