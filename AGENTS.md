# Agent Instructions

Read `SPEC.md` first — it's the full product/technical spec. This file is the quick-reference for any coding agent (Claude Code, Antigravity, Kilo Code/GLM, or otherwise) picking up work here cold, in a session with no memory of prior sessions.

## What this is

A mobile-first pocket reference app for Ironsworn/Starforged moves. Static React SPA, deployed to GitHub Pages via Actions. No backend.

## Source of truth

- `content/ironsworn_moves.md`, `content/starforged_moves.md` — hand-curated verbatim extraction of the rules text. **Never edit these to "fix" wording** — if something looks off, it's probably faithful to the source PDF; check `docs/*.pdf` before changing extracted text.
- `src/data/schema.ts` — the TS types every content consumer and UI component must use.
- `src/styles/tokens.ts` — the only place colors are defined. Never hardcode a hex in a component.

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
```

All four of `build`, `typecheck`, `lint`, `test` must pass locally before opening a PR — CI enforces this and blocks merge on failure.

## Conventions

- Functional components only, TypeScript strict mode, no `any`.
- Tailwind for styling; use CSS variables from `tokens.ts` for anything color-related, not literal hex values.
- No new state-management library — React state + `localStorage` (favorites, settings) is enough for this app's size.
- Keep PRs scoped to one ticket from `SPEC.md` §8. Don't drive-by refactor unrelated files.
- Every PR description should say which `SPEC.md` section it implements, since the next agent reading it may not have this conversation's context either.

## Build order (see SPEC.md §8 for detail)

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

Don't start a later ticket before its dependencies (per §8) have landed on `main`.

## Things that look like bugs but aren't

- Ironsworn moves have no per-category color (only a dark/light two-tone) — this is correct, it's how the source PDF is designed. Don't invent category colors for it.
- Some move cross-references (e.g. `*Pay the Price*`) are italicized in the `.md` source as an editorial addition for linking purposes, not because the original PDF uses italics there (Starforged's PDF doesn't italicize cross-refs at all; Ironsworn's does, per its own stated convention). Both should render as tappable links in the app regardless.
- pt-BR locale files are intentionally stubs/absent — this is expected until a translation is provided, not a missing feature to build now.
