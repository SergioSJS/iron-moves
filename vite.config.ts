/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base defaults to '/' for local dev/build; deploy.yml sets VITE_BASE to
// '/<repo-name>/' for the GH Pages build so asset URLs resolve correctly.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
