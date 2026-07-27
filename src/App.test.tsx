import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the app shell', () => {
    render(<App />)
    // Appears twice: mobile header + desktop sidebar brand mark (CSS-hidden
    // per breakpoint, both present in the DOM).
    expect(screen.getAllByText('Pocket Moves').length).toBeGreaterThan(0)
  })
})
