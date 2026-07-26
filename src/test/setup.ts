import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement matchMedia; useTheme (src/styles/useTheme.ts) reads
// prefers-color-scheme via it, so components using that hook need a stub.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
}
