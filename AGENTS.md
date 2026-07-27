# Agent Instructions

Read `SPEC.md` first — it's the full product/technical spec. This file is the quick-reference for any coding agent (Claude Code, Antigravity, Kilo Code/GLM, or otherwise) picking up work here cold, in a session with no memory of prior sessions.

## What this is

A mobile-first pocket reference app for Ironsworn/Starforged moves. Static React SPA, deployed to GitHub Pages via Actions. No backend.

## Source of truth

- `content/ironsworn_moves.md`, `content/starforged_moves.md` — hand-curated verbatim extraction of the rules text. **Never edit these to "fix" wording** — if something looks off, it's probably faithful to the source PDF; check `docs/*.pdf` before changing extracted text.
- `src/data/schema.ts` — the TS types every content consumer and UI component must use.
- `src/styles/tokens.ts` — the only place colors are defined. Never hardcode a hex in a component.
- `src/styles/gameTheme.ts` — per-game visual personality (display font for titles, body font for content, layered background per game × light/dark) plus the app-wide horizontal scanline texture (`body::before`, fixed, `pointer-events: none`, high z-index so it covers the tab bar and modals too), mirroring the companion app sergiosjs.github.io/iron-oracle. Its background gradients are the one sanctioned exception to "colors only in tokens.ts" — they're that app's palette taken verbatim, not book-extraction colors. Wired in tailwind.config.ts via `data-current-game` on `<html>`: the background goes on `body` plus a copy on `.app-tabbar` (both `background-attachment: fixed` so they align seamlessly; the tab bar must stay opaque on mobile), the body font on `body`, and the game display font on `.app-brand` (the "Pocket Moves" wordmark). Dark-mode selectors must be compound (`.dark[data-current-game=...]`) since both live on `<html>`. Small uppercase labels (chips, table headers, outcome labels) use the neutral `font-display`, not the game display font — that one is for titles only.

## Content pipeline

`scripts/build-content.mjs` parses `content/*.md` into `src/data/en/{ironsworn,starforged}.generated.json` (typed per `schema.ts`). This runs fresh on every `pnpm dev`, `pnpm build`, `pnpm typecheck`, and `pnpm test` (chained via `pnpm content:build` in each script) — **the generated JSON is not committed** (gitignored), so don't hand-edit it and don't "fix" a stale copy into git. If content looks wrong in the app, fix the parser or the `.md` source, then re-run; never patch the JSON directly, it'll be overwritten on the next run.

## Commands

```
pnpm i
pnpm dev          # local dev server
pnpm build        # production build (must pass before any PR)
pnpm typecheck
pnpm lint
pnpm test         # vitest
pnpm test:e2e     # playwright — one mobile-viewport smoke test, SPEC §2/§10
```

All four of `build`, `typecheck`, `lint`, `test` must pass locally before opening a PR — CI enforces this and blocks merge on failure. `test:e2e` is not part of the CI gate (SPEC §9 lists exactly those four) — it builds + serves the app itself (`pnpm preview`), so run it locally when touching navigation/routing.

## Conventions

- Functional components only, TypeScript strict mode, no `any`.
- Tailwind for styling; use CSS variables from `tokens.ts` for anything color-related, not literal hex values.
- No new state-management library — React state + `localStorage` (favorites, settings) is enough for this app's size.
- Keep PRs scoped to one ticket from `SPEC.md` §8. Don't drive-by refactor unrelated files.
- Every PR description should say which `SPEC.md` section it implements, since the next agent reading it may not have this conversation's context either.

## Build order (see SPEC.md §8 for detail)

All 10 tickets have landed — this is a complete v1. Still don't start a later
ticket's *kind* of work before its dependencies would logically support it if
you're doing a substantial rework of an early piece (e.g. don't redo Search
without checking what Favorites/Browse assume about it).

1. Scaffold + CI/CD
2. Content pipeline + schema
3. Design tokens + theming
4. Navigation shell
5. Browse + move detail
6. Search
7. Favorites
8. PWA/offline
9. i18n scaffold (pt-BR stub, not translated yet)
10. Accessibility/responsive polish

## Things that look like bugs but aren't

- Ironsworn moves have no per-category color (only a dark/light two-tone) — this is correct, it's how the source PDF is designed. Don't invent category colors for it.
- Some move cross-references (e.g. `*Pay the Price*`) are italicized in the `.md` source as an editorial addition for linking purposes, not because the original PDF uses italics there (Starforged's PDF doesn't italicize cross-refs at all; Ironsworn's does, per its own stated convention). Both should render as tappable links in the app regardless.
- pt-BR locale files are intentionally stubs/absent — this is expected until a translation is provided, not a missing feature to build now.
- `MoveCard`'s favorite star is a *sibling* of the row's title `<Link>`, not nested inside it, using a "stretched link" (`after:absolute after:inset-0` on the link) to make the whole row clickable. A button nested inside an anchor is invalid HTML and pollutes the link's accessible name with the button's own label — this bit an earlier version of the Playwright smoke test (a `getByRole('link', { name: 'Favorites' })` nav click matched every move row too, because each row's link "name" included its nested button's "Add to favorites" label). Don't put another interactive element back inside the title link.
- At md+, `MoveDetailPage` renders as a centered modal (reusing `BottomSheet`), not a 3rd side-by-side pane next to the category grid + move list. A literal 3-pane layout was tried first and the detail column was too narrow to read comfortably — the modal floats over the still-visible category/move list instead. Don't "fix" this back into a 3rd flex column.
- `TabBar`'s desktop sidebar is `md:sticky md:top-0 md:h-screen`, not `md:h-full` on a `flex` parent — `h-full` needs an ancestor with a *definite* height to resolve against, which `min-h-screen` on a flex container doesn't reliably provide, and the border-right ended up stopping at the nav content's height instead of the viewport. Same reasoning applies if you add another full-height sidebar-style element.
