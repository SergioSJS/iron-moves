/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base defaults to '/' for local dev/build; deploy.yml sets VITE_BASE to
// '/<repo-name>/' for the GH Pages build so asset URLs resolve correctly.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Precache everything — SPEC §7: "the whole content set is small,
      // pure text". No runtime caching rules needed since there's no
      // backend and no build-time network calls to work around.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
      },
      manifest: {
        name: 'Pocket Moves',
        short_name: 'Pocket Moves',
        description: 'Mobile-first pocket reference for Ironsworn and Starforged moves.',
        // Ironsworn's dark accent (src/styles/tokens.ts ironswornTokens.barDark)
        // and paper (#FFFFFF, shared by both books) — not invented separately.
        theme_color: '#30393D',
        background_color: '#FFFFFF',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
