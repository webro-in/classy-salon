# DRD — Development Requirements

Status: **Phase 1 implemented (rev. 3)**. Versions and the static-generation strategy below are verified in code.

---

## 1. Technology (installed, pinned exact)

| Concern | Package | Version | Note |
|---|---|---|---|
| UI | react / react-dom | 19.3.0 | |
| Build | vite | 8.3.1 | |
| Static generation | vite-react-ssg | 0.9.2 | Verified working. See §3 |
| Routing | react-router-dom | 6.30.6 | Pinned to v6: vite-react-ssg peer `^6.14.1` |
| Styling | tailwindcss + @tailwindcss/vite | 4.3.3 | Tokens in `src/styles/tokens.css` |
| Validation | zod | 4.6.5 | Build-time content schemas |
| Motion | gsap / @gsap/react | 3.15.0 / 2.1.2 | Client-only effects |
| 3D | three / @react-three/fiber | 0.186.1 / 9.8.1 | Lazy, gated. drei **not** installed |
| Fonts | @fontsource/instrument-serif, @fontsource-variable/hanken-grotesk | 5.3.0 | Self-hosted, latin preloaded |
| Language | typescript | 6.0.3 | Not 7.x: typescript-eslint supports `<6.1` |
| Unit tests | vitest + Testing Library + jsdom | 5.0.3 | |
| E2E | @playwright/test + @axe-core/playwright | 1.56.1 / 4.13.0 | 1.56.1 matches the installed Chromium; `playwright-core` overridden to 1.56.1 |
| Lint | eslint 9 + typescript-eslint 8.71 + jsx-a11y + react-hooks | | ESLint 9, not 10: jsx-a11y does not support 10 yet |

Deferred until real media exists (Phase 12): `vite-imagetools` (AVIF/WebP srcsets), `beasties` (critical CSS; its peer range lags the current release).

**Excluded:** backend, database, server, API, authentication, admin panel, CMS, Shadcn, Lucide, Framer Motion.

## 2. Folder structure

```
classy-unisex-salon/
├── public/
│   ├── media/{hero,salon,services,work,gallery,instagram,brands}/
│   ├── logo/   icons/   robots.txt
├── content/                      # human-editable source
│   ├── business.json  services.json  brands.json  reviews.json
│   ├── gallery.json   faq.json      legal/{privacy.md,terms.md}
├── scripts/
│   ├── content-check.ts          # lists unresolved content; --strict fails
│   ├── verify-dist.ts            # asserts every route has dist/<route>/index.html with content
│   └── sitemap.ts
├── src/
│   ├── main.tsx                  # ViteReactSSG entry (client + SSG)
│   ├── app/{routes.tsx, RootLayout.tsx, providers/}
│   ├── pages/{Home,About,Services,Gallery,Reviews,Contact,Privacy,Terms,NotFound}/
│   ├── sections/{hero,intro-trust,services-preview,hair-treatments,salon,
│   │            makeup-feature,work,brands,reviews,instagram,booking,visit}/
│   ├── components/{layout,navigation,buttons,media,accordion,gallery,forms,
│   │               reviews,typography,icons,motion,three}/
│   ├── data/{business,services,brands,reviews,gallery,media,navigation,faq}.ts
│   ├── config/{site,seo,motion}.ts
│   ├── lib/{links,analytics,content,client-only}.ts
│   ├── hooks/  types/  styles/{tokens.css,base.css,fonts.css}
├── tests/{unit,e2e}/
└── docs/
```

---

## 3. Static generation strategy (exact)

### 3.1 Why
A normal `vite build` produces **one** `index.html` with an empty root element. Every route would then be rendered in the browser only, so crawlers and link previews (WhatsApp, Facebook) would see no content or per-page meta. A plain Vite build does **not** produce per-route HTML.

### 3.2 How the pages are generated
`npm run build` runs `vite-react-ssg build`, which:

1. Runs a normal **client build** (hashed JS/CSS → `dist/assets/`).
2. Runs a **server (SSR) build** of the same entry (`src/main.tsx`) into a temporary directory.
3. Collects route paths from `src/app/routes.tsx` (static paths; no dynamic routes in v1).
4. For each path, in Node: creates a static router, renders the tree with `react-dom/server`, collects `<Head>` tags, inlines critical CSS (beasties) and writes:
   ```
   dist/index.html
   dist/about/index.html
   dist/services/index.html
   dist/gallery/index.html
   dist/reviews/index.html
   dist/contact/index.html
   dist/privacy/index.html
   dist/terms/index.html
   dist/404.html            # from the catch-all route, via the ssgOptions route config
   ```
5. In the browser, the client bundle **hydrates** the existing HTML. Later navigations are client-side.

Configuration lives in `vite.config.ts → ssgOptions` (`dirStyle: 'nested'`, `formatting: 'none'`, `beastiesOptions`), with `includedRoutes()` returning the route list plus the 404 path.

### 3.3 Verification (CI gate)
`scripts/verify-dist.ts` runs after the build and fails it if any expected file is missing, or lacks its `<title>`, meta description, canonical, `<h1>` or a minimum amount of body text. This proves the HTML is really prerendered.

### 3.4 SSR-safety rules
- No `window`, `document`, `matchMedia` or `localStorage` during render. Browser APIs only inside `useEffect` / `useGSAP`, or behind `lib/client-only.ts` (`<ClientOnly>`).
- GSAP and ScrollTrigger register in effects. Initial CSS states must be **visible**, so content is readable without JS (animations progressively enhance).
- three/R3F: `React.lazy` inside `<ClientOnly>`. Never in the SSR bundle path.
- Deterministic render (no `Date.now()`/random in markup) to avoid hydration mismatches.

### 3.5 Phase 1 findings (verified)
- **404:** vite-react-ssg filters out catch-all (`*`) routes. The build prerenders an explicit `/404` path (which matches the `*` route) and `ssgOptions.onFinished` moves `dist/404/index.html` → `dist/404.html`.
- **Charset position:** vite-react-ssg inserts head tags at the start of `<head>`, pushing `<meta charset>` to byte ~2800 (the spec requires the first 1024). `onPageRendered` → `hoistCriticalHead()` moves charset + viewport first. Guarded by verify-dist.
- **3D preload leak:** vite-react-ssg modulepreloads every dynamic import of a rendered route, which would download the 3D bundle (242 KB gz) on every visit, mobile included. Convention: scene modules are named `*.scene.tsx`; `stripScenePreloads()` removes their preloads. Guarded by verify-dist + e2e.
- **Hydration race (fixed):** the library's default client router ignores `window.__staticRouterHydrationData` and injects a static-data `loader` into every route. The router then starts uninitialised and races a JSON fetch against hydration; under load about 2–10% of loads mounted the app **twice** with no console error. `src/main.tsx` supplies a `customCreateRouter` that strips the unused loaders and passes the hydration data. Verified 0 duplicates in 195 stressed loads; e2e asserts exactly one `<main>` per page.

### 3.6 Fallback (not needed)
If vite-react-ssg is ever abandoned or breaks, the **fallback** is a custom prerender with Vite's own SSR mode:
`vite build` (client) → `vite build --ssr src/entry-server.tsx` → `scripts/prerender.ts` imports `render(url)` (uses `StaticRouter` + `renderToString` + helmet context), loops over the routes and writes the same `dist/` tree. The output layout is identical, so deployment is unaffected.

---

## 4. Component architecture
- Pages compose sections. Sections read `src/data`. Components are presentational.
- No hard-coded URLs, phones, service names or asset paths in components.
- One `Button` (variants), one `ActionLink` (uses `lib/links` + `lib/analytics`), one `Media` (resolves slots).
- `Accordion` follows the WAI-ARIA disclosure pattern. It supports nesting and `#hash` auto-open, animates height with GSAP and is fully open-able without JS (`<details>`-style fallback state in SSR HTML).
- Files kept to roughly 200 lines or fewer.

## 5. Data model (abridged)

```ts
type Pending = { status: 'pending'; note: string };
type Verified<T> = { status: 'verified'; value: T; checkedOn?: string };
type Field<T> = Verified<T> | Pending;

interface Business {
  name: 'Classy Unisex Salon';
  address: PostalAddress;                         // verified
  phone: Field<string>; whatsapp: Field<string>; email: Field<string>;
  hours: Field<OpeningHours[]>;
  rating: Field<{ value: number; count: number; display: string; source: 'Google' }>; // PENDING
  instagram: { primary: string; secondary: Field<string> };
  mapsUrl: string;
}
interface ServiceItem {
  id: string;
  sourceLabel: string;            // exact wording from the sheet
  proposedLabel?: string;         // shown only when labelStatus === 'confirmed'
  labelStatus: 'as-source' | 'needs-confirmation' | 'confirmed';
  description: Field<string>;
  media?: MediaSlotId;
}
interface Brand {
  id: string; name: string; kind: 'logo' | 'name';
  logo?: MediaSlotId; claim: 'none';  // no partnership claims supported in v1
}
```
Display label = `labelStatus === 'confirmed' && proposedLabel ? proposedLabel : sourceLabel` (capitalisation normalised).

## 6. Content validation modes
| Mode | Command | Behaviour |
|---|---|---|
| Development | `npm run dev` | No content validation. Markers and placeholders render |
| Preview | `npm run build` | Schemas validated; missing client data reported, never fatal |
| Production | `npm run build:production` | `VITE_STRICT_CONTENT=true`; `content:check --strict` must pass, then verify-dist rejects any marker/placeholder/scaffold in HTML |

Rules: `scripts/content-rules.ts` (pure, unit-tested), forbidden patterns: `scripts/forbidden.ts`, orchestration: `scripts/build.ts`.
Each media slot carries `required`; optional slots (per-service images, hero video, text-brand logos) never block a release.
In production builds, components with pending data are omitted and dev markers are not rendered.

## 7. Media system
`data/media.ts` slots: `{ id, kind, src?, poster?, alt, ratio, mobileRatio?, focal?, status: 'placeholder'|'supplied' }`.
`<Media slot>` renders a `MediaPlaceholder` (exact ratio, tonal surface, slot label + ratio in dev) when `src` is missing, so layouts are final before photos arrive. Real files: drop into `public/media/...`, set `src`, flip `status`. Images get build-time AVIF/WebP srcsets. Video: MP4 + WebM + poster. The hero autoplays muted, inline and looped. Paused for reduced motion and `saveData`. `onError` → placeholder surface.

## 8. Motion & 3D
Motion tokens live in `config/motion.ts`. Patterns: line-mask text reveals, clip-path media reveals with inner parallax, pinned horizontal strips (desktop), accordion height, menu and page curtains (≤ 450 ms, never blocking navigation).

**Subtle 3D (hero only):** a slow, matte arched-mirror form catching a soft light sweep behind the hero type, layered over/under hero media. Gated by `canRender3D()` (WebGL2, no reduced motion, ≥ 1024 px, `deviceMemory ≥ 4`, not `saveData`). Lazy chunk ≤ 180 KB gz, error boundary → poster, paused offscreen. Cut in Phase 11 if it costs > 150 ms LCP or noticeably drops FPS.

## 9. Accessibility
WCAG 2.2 AA: landmarks, skip link, one `h1`/page, visible focus, 44 px targets, focus trap + ESC + focus return (menu, lightbox), `aria-live` feedback, required alt text (schema-enforced), contrast verified for all token pairs and media scrims.

## 10. Performance budgets
LCP ≤ 2.0 s (4G) · CLS ≤ 0.05 · INP ≤ 150 ms · initial JS ≤ 130 KB gz (excl. 3D) · hero video ≤ 2.5 MB, poster-only on mobile · ≤ 2 font files.

## 11. SEO
Per-route meta/OG/canonical from `config/seo.ts`, rendered into static HTML. JSON-LD `HairSalon` with verified fields only (`aggregateRating` omitted while the rating is pending). `sitemap.xml` + `robots.txt` generated after the SSG step.

## 12. Testing & CI
`typecheck → lint → unit → content:check → build (SSG) → verify-dist → preview → Playwright e2e + axe + overflow at 7 widths`.
