import { expect, test } from '@playwright/test'

// Real-viewport mobile smoke test (SPEC §2/§10) — the golden path: land on
// Browse, drill into a category, open a move, follow a cross-ref into the
// bottom sheet, search, and star a favorite. Not exhaustive coverage (that's
// what the component/unit tests are for) — this just proves the built app
// actually works end to end on a phone-sized viewport.
test('golden path: browse → move detail → cross-ref → search → favorite', async ({
  page,
}) => {
  const consoleErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })

  await page.goto('/')
  await expect(page).toHaveURL(/#\/starforged\/browse/)

  await page.getByRole('link', { name: /adventure moves/i }).click()
  await expect(page.getByRole('link', { name: /face danger/i })).toBeVisible()

  await page.getByRole('link', { name: /face danger/i }).click()
  await expect(page.getByRole('heading', { name: 'Face Danger' })).toBeVisible()
  // exact: true — a hidden MoveCard's line-clamped trigger snippet
  // (unrelated Adventure move, still in the DOM under a CSS-hidden master
  // pane) is a spurious substring-match candidate otherwise.
  await expect(page.getByText('Strong Hit', { exact: true })).toBeVisible()

  // Cross-ref chip opens the bottom sheet without navigating away.
  await page.getByRole('button', { name: 'Pay the Price' }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: 'Pay the Price' }),
  ).toBeVisible()
  // Two "Close" buttons in the sheet (backdrop + visible label) — click the
  // visible one specifically.
  await page.getByRole('dialog').getByText('Close', { exact: true }).click()
  await expect(page.getByRole('dialog')).toBeHidden()

  // Search finds the move we were just looking at.
  const nav = page.getByRole('navigation')
  await nav.getByRole('link', { name: 'Search', exact: true }).click()
  await page.getByRole('searchbox').fill('danger')
  await expect(page.getByRole('link', { name: /face danger/i })).toBeVisible()

  // Star it, then confirm it shows up under Favorites. Scoped by the row's
  // <li> since the favorite button is a sibling of the row's link, not a
  // descendant (MoveCard uses a "stretched link" — a button nested inside
  // an anchor is invalid HTML and would pollute the link's accessible name).
  await page
    .locator('li')
    .filter({ hasText: 'Face Danger' })
    .getByRole('button', { name: /add to favorites/i })
    .click()
  await nav.getByRole('link', { name: 'Favorites', exact: true }).click()
  await expect(page.getByRole('link', { name: /face danger/i })).toBeVisible()

  expect(consoleErrors).toEqual([])
})
