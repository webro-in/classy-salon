import { defineConfig, devices } from '@playwright/test'

/**
 * E2E runs against the production static build (dist/) served exactly like a
 * static host: per-route HTML, real 404 status, no SPA fallback.
 * Run `npm run build` first.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  timeout: 60_000,
  use: { baseURL: 'http://localhost:4173', trace: 'off' },
  webServer: {
    command: 'npx tsx scripts/serve-static.ts dist',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
