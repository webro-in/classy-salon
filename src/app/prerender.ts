/**
 * Build-time only (imported by vite.config.ts, never by the browser bundle).
 * Lists every path vite-react-ssg renders to static HTML.
 */
import { NOT_FOUND_PRERENDER_PATH, PATHS, PUBLIC_PATHS } from './paths'

export function getPrerenderPaths(strict: boolean): string[] {
  return [
    ...PUBLIC_PATHS,
    // Internal foundation styleguide: previews only, never in strict production builds.
    ...(strict ? [] : [PATHS.styleguide]),
    `/${NOT_FOUND_PRERENDER_PATH}`,
  ]
}

/**
 * vite-react-ssg inserts head tags at the start of <head>, which pushes
 * <meta charset> past the first 1024 bytes required by the HTML spec.
 * Move charset + viewport back to the top of <head> on every rendered page.
 */
export function hoistCriticalHead(html: string): string {
  const critical: string[] = []
  let out = html
  for (const re of [/<meta charset="[^"]*"\s*\/?>/i, /<meta name="viewport"[^>]*>/i]) {
    const match = out.match(re)
    if (match) {
      critical.push(match[0])
      out = out.replace(match[0], '')
    }
  }
  return out.replace(/<head([^>]*)>/i, (head) => `${head}${critical.join('')}`)
}

/**
 * vite-react-ssg emits <link rel="modulepreload"> for every dynamic import in a
 * rendered route, which would download the 3D bundle on every visit (including
 * mobile) before canRender3D() runs. Chunks from *.scene.tsx modules are
 * stripped from the preload list so they load only when actually rendered.
 */
export function stripScenePreloads(html: string): string {
  return html.replace(/<link rel="modulepreload"[^>]*href="[^"]*\.scene-[^"]*"[^>]*>/g, '')
}

/** Post-processing applied to every prerendered page. */
export function postProcessPage(html: string): string {
  return stripScenePreloads(hoistCriticalHead(html))
}
