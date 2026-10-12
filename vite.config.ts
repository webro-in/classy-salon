import { existsSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { NOT_FOUND_PRERENDER_PATH } from './src/app/paths'
import { getPrerenderPaths, postProcessPage } from './src/app/prerender'

/**
 * Static generation (docs/DRD.md §3).
 * `vite-react-ssg build` renders every path from getPrerenderPaths() to
 * dist/<path>/index.html. vite-react-ssg skips catch-all ("*") routes, so the
 * 404 page is rendered from the explicit "/404" path and moved to dist/404.html.
 */
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  const strict = env.VITE_STRICT_CONTENT === 'true'

  return {
    plugins: [react(), tailwindcss()],
    define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@content': fileURLToPath(new URL('./content', import.meta.url)),
      },
    },
    build: { target: 'es2022', sourcemap: false },
    ssgOptions: {
      entry: 'src/main.tsx',
      dirStyle: 'nested',
      formatting: 'none',
      script: 'async',
      beastiesOptions: false,
      includedRoutes: () => getPrerenderPaths(strict),
      onPageRendered: (_route: string, html: string) => postProcessPage(html),
      onFinished: (dir: string) => {
        const nested = join(dir, NOT_FOUND_PRERENDER_PATH, 'index.html')
        if (existsSync(nested)) {
          renameSync(nested, join(dir, '404.html'))
          rmSync(join(dir, NOT_FOUND_PRERENDER_PATH), { recursive: true, force: true })
        }
      },
    },
  }
})
