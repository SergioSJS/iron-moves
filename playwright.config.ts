import { defineConfig, devices } from '@playwright/test'

// One real-viewport mobile smoke test (SPEC §2) — not part of the CI gate
// (§9 lists exactly typecheck/lint/test/build), run locally via
// `pnpm test:e2e`. Builds + previews so it's testing the same static output
// GitHub Pages actually serves, not the dev server.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    ...devices['iPhone 13'],
  },
  webServer: {
    command: 'pnpm build && pnpm preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
