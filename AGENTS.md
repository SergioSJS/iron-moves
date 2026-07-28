# Agent Instructions

Read `SPEC.md` first — it's the full product/technical spec. This file is the quick-reference for any coding agent (Claude Code, Antigravity, Kilo Code/GLM, or otherwise) picking up work here cold, in a session with no memory of prior sessions.

## What this is

A mobile-first pocket reference app for Ironsworn/Starforged moves. Static React SPA, deployed to GitHub Pages via Actions. No backend.

Live at https://sergiosjs.github.io/iron-moves/ — repo `SergioSJS/iron-moves`, default branch `main`. Every push to `main` triggers `deploy.yml`, which builds with `VITE_BASE=/iron-moves/` and publishes via `actions/deploy-pages` (Pages source is "GitHub Actions", set via `gh api repos/SergioSJS/iron-moves/pages -X POST -f build_type=workflow`). Never commit `dist/` or deploy a local build manually.

## Source of truth

- `content/ironsworn_moves.md`, `content/starforged_moves.md` — hand-curated verbatim extraction of the rules text. **Never edit these to "fix" wording** — if something looks off, it's probably faithful to the source PDF; check `docs/*.pdf` before changing extracted text.
- `src/data/schema.ts` — the TS types every content consumer and UI component must use.
- `src/styles/tokens.ts` — the only place colors are defined. Never hardcode a hex in a component.
- `src/styles/gameTheme.ts` — per-game visual personality (display font for titles, body font for content, layered background per game × light/dark) plus the horizontal scanline texture, mirroring the companion app sergiosjs.github.io/iron-oracle. Its background gradients are the one sanctioned exception to "colors only in tokens.ts" — they're that app's palette taken verbatim, not book-extraction colors. Wired in tailwind.config.ts via `data-current-game` on `<html>`: the background goes on `body` plus a copy on `.app-tabbar` (both `background-attachment: fixed` so they align seamlessly; the tab bar must stay opaque on mobile), the body font on `body`, and the game display font on `.app-brand` (the "Pocket Moves" wordmark). The scanlines are the topmost background-image *layer* on `body`/`.app-tabbar` — never a `::before` overlay, which painted lines over cards/modals and was reverted. Dark-mode selectors must be compound (`.dark[data-current-game=...]`) since both live on `<html>`. Small uppercase labels (chips, table headers, outcome labels) use the neutral `font-display`, not the game display font — that one is for titles only.

## Content pipeline

`scripts/build-content.mjs` parses `content/*.md` into `src/data/en/{ironsworn,starforged}.generated.json` (typed per `schema.ts`). This runs fresh on every `pnpm dev`, `pnpm build`, `pnpm typecheck`, and `pnpm test` (chained via `pnpm content:build` in each script) — **the generated en JSON is not committed** (gitignored), so don't hand-edit it and don't "fix" a stale copy into git. If content looks wrong in the app, fix the parser or the `.md` source, then re-run; never patch the JSON directly, it'll be overwritten on the next run.

### pt-BR machine translation (placeholder)

`src/data/pt-BR/{ironsworn,starforged}.generated.json` are **machine-translated** from the en JSON by `scripts/translate-content.mjs` (`pnpm content:translate`, needs network — Google Translate gtx endpoint). Unlike the en JSON they **are committed** (`.gitignore` has an explicit exception), because CI/builds can't call the MT API. The script keeps a committed translation memory at `scripts/translation-cache/pt-BR.json`, so re-runs after content edits only re-translate changed lines. It preserves `{move:id}` cross-ref tokens and `**bold**` markers (validated per line), plus two hand-curated fixes over raw MT: only the verb is translated in `**Roll +stat**` formulas (stat names stay in English rather than guessing official pt-BR terms), and category names come from a fixed map keyed by the English name — pt-BR category buttons show just the qualifier ("Combate", "Desgaste", …) with a shared "Movimentos de" label above the list (`browse.categoryGroupLabel` in ui.json; empty in en, so nothing renders there). **Replacing with the official translation = overwrite those two JSON files** (same schema/ids) and delete the cache; no component changes needed — `src/data/index.ts` already falls back to en per-move for anything missing. `src/data/ptBRContent.test.ts` guards the structural 1:1 match (ids, tokens, field shapes).

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
9. i18n scaffold (pt-BR machine-translated placeholder shipped; see "pt-BR machine translation" above)
10. Accessibility/responsive polish

## Dice roller (post-v1 feature, `src/features/roll/`)

Action roll (1d6+bonus vs 2d10) with Strong/Weak/Miss resolution — an
overlay on the current screen triggered by the tab bar's dice button, **not
a route** (the 3D mode rolls dice over whatever page you're reading;
navigating away would defeat it). Two render modes, picked in Settings and
persisted via `diceMode.ts` (`pocket-moves:dice-mode`, default `'3d'`):

- **3D**: `@3d-dice/dice-box` (BabylonJS + Ammo physics, MIT, ships CC0
  d6/d10 models). The Babylon chunks (~4 MB) are dynamic-imported on the
  first 3D roll only, then kept as a module singleton — `DiceBox3D` must
  stay mounted (RollFlow always is, via RootLayout) or the canvas is
  orphaned. Between rolls the canvas is toggled with dice-box's own
  `hide()`/`show()`, never `display:none` on the container (that leaves the
  canvas at 0×0). Init/roll failures fall back to the 2D roll for that
  attempt.
- **2D**: plain cycling-number animation (`Dice2D`), also the fallback.

Gotchas learned the hard way:

- dice-box ships **no TS types** — `src/types/dice-box.d.ts` declares the
  minimal API surface (v1.1.4 constructor takes a single config object;
  `roll(['1d6','2d10'])` resolves per-die results parsed by `sides`).
- Its canvas **must** be sized with CSS (`#dice-box-3d canvas { width:100%;
  height:100% }` in index.css, per the library README) — without it the
  canvas keeps its default 300×150 and the dice render minuscule in a
  strip at the top-left.
- Its d10 rolls 1–10 (verified via `colliderFaceMap` in the theme mesh) —
  no 0→10 remapping needed.
- Its postinstall prompts for an asset destination with a 10s timeout and
  copies to `public/assets/` (committed: ammo.wasm + theme textures/mesh).
  `assetPath` must include `import.meta.env.BASE_URL` or it breaks under
  the GH Pages base path.
- Workbox needed `wasm/jpg/json` in `globPatterns` and
  `maximumFileSizeToCacheInBytes` raised to 8 MiB (the offscreen-worker
  chunk is ~2.9 MB; the 2 MiB default silently skips it → 3D breaks
  offline).
- The outcome math (`actionRoll.ts`) is strict `total > d10`; a tie does
  not beat a challenge die. Ironsworn's "match" (equal d10s = critical) is
  intentionally not implemented yet.
- Dice are tinted per current game by default (`getGameDiceColor` in
  gameTheme.ts — iron-oracle's heading accents: Ironsworn bronze `#c9a961`,
  Starforged steel blue `#8ba3d4`), overridable in Settings via
  `diceColor.ts` presets (`pocket-moves:dice-color`, 'game' default) with a
  separate number-color setting (`pocket-moves:dice-number-color`, 'auto' =
  WCAG contrast pick via getAccentTextColor). The die color passes as
  dice-box's per-roll `themeColor` (which DOES tint the textured default
  theme); number color applies to the 2D chips only — the 3D models' labels
  come from light/dark face textures the library picks by die luminance.

## Things that look like bugs but aren't

- Ironsworn moves have no per-category color (only a dark/light two-tone) — this is correct, it's how the source PDF is designed. Don't invent category colors for it.
- Some move cross-references (e.g. `*Pay the Price*`) are italicized in the `.md` source as an editorial addition for linking purposes, not because the original PDF uses italics there (Starforged's PDF doesn't italicize cross-refs at all; Ironsworn's does, per its own stated convention). Both should render as tappable links in the app regardless.
- pt-BR move content is a **machine translation placeholder** (see "pt-BR machine translation" above), not the official translation — don't "fix" its terminology by hand; either tweak `translate-content.mjs`'s glossary or wait for the official files. UI strings in `src/i18n/locales/pt-BR/ui.json`, on the other hand, are genuinely translated.
- `MoveCard`'s favorite star is a *sibling* of the row's title `<Link>`, not nested inside it, using a "stretched link" (`after:absolute after:inset-0` on the link) to make the whole row clickable. A button nested inside an anchor is invalid HTML and pollutes the link's accessible name with the button's own label — this bit an earlier version of the Playwright smoke test (a `getByRole('link', { name: 'Favorites' })` nav click matched every move row too, because each row's link "name" included its nested button's "Add to favorites" label). Don't put another interactive element back inside the title link.
- At md+, `MoveDetailPage` renders as a centered modal (reusing `BottomSheet`), not a 3rd side-by-side pane next to the category grid + move list. A literal 3-pane layout was tried first and the detail column was too narrow to read comfortably — the modal floats over the still-visible category/move list instead. Don't "fix" this back into a 3rd flex column.
- `TabBar`'s desktop sidebar is `md:sticky md:top-0 md:h-screen`, not `md:h-full` on a `flex` parent — `h-full` needs an ancestor with a *definite* height to resolve against, which `min-h-screen` on a flex container doesn't reliably provide, and the border-right ended up stopping at the nav content's height instead of the viewport. Same reasoning applies if you add another full-height sidebar-style element.
