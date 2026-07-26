# Pocket Moves — App Spec

Mobile-first pocket reference for **Ironsworn** and **Starforged** moves, deployed as a static site via GitHub Actions → GitHub Pages. Source content lives in `content/ironsworn_moves.md` and `content/starforged_moves.md` (verbatim extractions from the official PDFs, with reconstructed markup and extracted color/typography metadata — see those files' legends).

This doc is the contract for whichever agent(s) build the app. It's written to be actionable cold, without this conversation's context.

## 1. Goal & priorities

A quick-lookup rules reference for use **during play**, primarily on a phone. In priority order:

1. **Speed of lookup** — find a move in ≤2 taps from app open (search) or ≤3 taps browsing (game → category → move).
2. **Readability at a glance** — trigger, roll stats, and strong/weak/miss outcomes must be visually distinct without reading dense paragraphs.
3. **Works with no signal** — installable PWA, fully offline after first load. Tables don't have wifi.
4. **Visual continuity with the books** — category colors and light/dark tone should feel drawn from Ironsworn/Starforged, not generic Material/Bootstrap defaults.
5. **Responsive**, but mobile is the primary target — design the phone layout first, then adapt up to tablet/desktop, not the reverse.

Non-goals for v1: character sheets, dice rolling, oracles/codex content (only "Section 1: Moves" was extracted), account/sync, content editing UI.

## 2. Stack

- **Vite + React + TypeScript** — SPA, static output.
- **Tailwind CSS** for utility styling, extended with a design-tokens theme (§5) rather than default palette.
- **React Router** (`createHashRouter` or `BrowserRouter` with the Pages base path — see §7) for game/category/move routes so links are shareable/bookmarkable.
- **Fuse.js** for fuzzy client-side search (small dataset, no backend needed).
- **i18next** + `react-i18next` for UI strings, structured for a pt-BR locale that doesn't exist yet (§6).
- **vite-plugin-pwa** (Workbox) for offline caching + installability.
- **Vitest + React Testing Library** for component tests; **Playwright** (optional, one smoke test) for a real-viewport mobile check.
- Package manager: pnpm (fast installs matter when multiple agents `pnpm i` repeatedly).

No backend, no database, no build-time network calls. Everything ships as static assets.

## 3. Repo layout

```
/
├── content/                        # source-of-truth rules text (already extracted)
│   ├── ironsworn_moves.md
│   └── starforged_moves.md
├── docs/                           # original PDFs (reference only, not shipped)
├── scripts/
│   └── build-content.mjs           # content/*.md -> src/data/*.generated.json
├── src/
│   ├── data/
│   │   ├── schema.ts                # TS types shared by content + UI (§4)
│   │   ├── ironsworn.generated.json
│   │   └── starforged.generated.json
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en/ui.json
│   │       └── pt-BR/ui.json        # stub, see §6
│   ├── styles/
│   │   └── tokens.ts                 # color/typography tokens extracted from the PDFs
│   ├── components/                  # MoveCard, CategoryChip, OutcomeBlock, SearchBar, TabBar…
│   ├── features/
│   │   ├── browse/                   # game → category → move list
│   │   ├── move-detail/
│   │   ├── search/
│   │   ├── favorites/
│   │   └── settings/                 # theme, language, game default
│   ├── app/                          # routing shell, layout, providers
│   └── main.tsx
├── public/                           # manifest, icons
├── .github/workflows/
│   ├── ci.yml                        # lint+typecheck+test+build on PRs
│   └── deploy.yml                    # build+deploy to Pages on main
├── AGENTS.md                         # instructions for any coding agent (§8)
├── SPEC.md                           # this file
└── package.json
```

## 4. Content pipeline & data model

`content/*.md` is hand-curated (already done) and stays the human-readable source of truth. `scripts/build-content.mjs` parses it into typed JSON at build time (or run once and commit the output — either is fine, but the script must exist so edits to the `.md` files can be regenerated instead of hand-edited in JSON).

```ts
// src/data/schema.ts
export type Game = "ironsworn" | "starforged";

export interface Category {
  id: string;            // slug, e.g. "adventure-moves"
  game: Game;
  name: string;           // "Adventure Moves"
  color: string;          // hex, from the extraction legend
}

export interface Table {
  headers: string[];
  rows: string[][];
}

export interface Sidebar {
  title?: string;
  body: string;           // markdown-ish rich text, may contain move cross-refs
}

export interface Move {
  id: string;              // slug, e.g. "face-danger"
  game: Game;
  categoryId: string;
  title: string;
  tag?: string;            // "Progress Move", "Scene Challenge Mode", etc.
  trigger: string;         // rich text incl. **bold** trigger clause
  rollOptions?: string[];  // the "If you act… Roll +x" bullet list, when present
  bullets?: string[];      // generic bullet list not tied to strong/weak/miss
  outcomes: {
    hit?: string;
    strongHit?: string;
    weakHit?: string;
    miss?: string;
  };
  tables?: Table[];
  sidebars?: Sidebar[];
  crossRefs: string[];     // move ids this move's text references, for linking
  sourcePage?: number;
}
```

Rich-text fields keep light markdown (`**bold**`, `*italic*`) rendered with a tiny inline renderer (not a full markdown lib — the grammar used is deliberately narrow). Cross-referenced move names in the source `.md` are already italicized (`*Pay the Price*`); the parser turns those into `{move:pay-the-price}` tokens so the UI can render them as tappable chips/links instead of plain italic text.

Category colors come directly from the legends in the two `.md` files — do not invent new ones. Ironsworn only has the two-tone `bar-dark`/`stripe-light` system (no per-category color), so its `Category.color` should all resolve to the same dark accent (`#30393D`) with categories distinguished by name/iconography instead of hue. Starforged has 11 distinct per-category hexes — use them as-is.

## 5. Design tokens & theming

Single source of truth in `src/styles/tokens.ts`, feeding both Tailwind config and CSS variables (so category colors can be applied dynamically per-move without a Tailwind class per color).

```ts
export const ironswornTokens = {
  ink: "#2E271E",
  paper: "#FFFFFF",
  barDark: "#30393D",
  stripeLight: "#E2E6E9",
  stripeMid: "#B5BDC4",
};

export const starforgedCategoryColors: Record<string, string> = {
  session: "#3F8C8A",
  adventure: "#206087",
  quest: "#805A90",
  connection: "#4A5791",
  exploration: "#427FAA",
  combat: "#818992",
  suffer: "#883529",
  recover: "#488B44",
  threshold: "#1D1D1B",
  legacy: "#4F5A69",
  fate: "#8F477B",
};
```

Requirements:
- **Dark mode is not optional** — this is a bedside/table lookup app, contrast in a dim room matters. Derive dark-theme surface colors algorithmically from the tokens above (don't hand-pick a second unrelated palette); category accent hues stay recognizable in both themes, only lightness/saturation shift for contrast (target WCAG AA for text on any accent-colored surface — several of the extracted hexes, e.g. `#883529` or `#1D1D1B`, need a light-text override, others need dark text; compute per-color, don't assume).
- Respect `prefers-color-scheme` by default; add a manual override in Settings, persisted to `localStorage`.
- Category color shows up as: a left border/accent bar on move list rows, the category chip background, and the header bar on the move-detail screen. Don't tint entire backgrounds — this is a reading app, body text stays on neutral surfaces.
- Typography: pick one condensed/display webfont for headings (evoking Modesto Poster / Poster Gothic Round without needing the actual licensed fonts — a free alternative with similar bold-condensed-display character, e.g. "Oswald" or "Bebas Neue") and one readable text face for body (system font stack is fine — this is a rules-lookup app, not a book-reading app).

## 6. Internationalization (pt-BR is coming, not yet)

The user expects a pt-BR translation of the rules text to become available later. Build the i18n seams now so that drop-in is additive, not a refactor:

- **UI strings** (nav labels, buttons, settings copy): `react-i18next`, `src/i18n/locales/{en,pt-BR}/ui.json`. Ship `en` fully populated; ship `pt-BR/ui.json` as a stub with the same keys pointing at placeholder/English values (or machine-translated placeholders clearly marked), so the language switcher can exist in Settings today without being a dead end.
- **Move content** is a separate concern from UI strings — don't bolt translated rules text onto `ui.json`. Structure generated content as locale-namespaced from day one:
  ```
  src/data/en/ironsworn.generated.json
  src/data/en/starforged.generated.json
  src/data/pt-BR/ironsworn.generated.json   # doesn't exist yet
  src/data/pt-BR/starforged.generated.json  # doesn't exist yet
  ```
  The data loader takes `(game, locale)` and **falls back to `en` per-move** if the `pt-BR` file is missing or missing that move's id — never a blank screen, never a mixed-language move (fall back at the whole-move granularity, not field-by-field, so you don't get a Portuguese trigger with an English outcome).
- Locale switcher lives in Settings, persisted, independent of device locale (don't force pt-BR on every Brazilian phone by default before the translation actually exists — default to `en` until a pt-BR content file is present and complete enough to promote).
- When the pt-BR rules text does arrive, it should be addable by dropping in the two JSON files above (or re-running `build-content.mjs` against `content/pt-BR/*.md` if the translation arrives as marked-up text) — no component code should need to change.

## 7. Navigation & UX (mobile-first)

**Bottom tab bar** (thumb zone), 4 items: **Browse**, **Search**, **Favorites**, **Settings**. Game system (Ironsworn/Starforged) is a persistent segmented control at the top of Browse/Search — not a 5th tab — because switching game is a frequent, layout-preserving action, not a separate destination.

- **Browse**: category list (colored chips/cards per §5) → tap → move list for that category (title + one-line trigger snippet, category color as left accent) → tap → move detail.
- **Move detail**: title, optional tag badge (e.g. "Progress Move"), trigger (bold clause visually emphasized), roll-option bullets if present, then **Strong Hit / Weak Hit / Miss** as visually separated blocks (not just paragraphs — think stat-block cards: a colored label + the text), tables rendered as scrollable-if-needed compact tables, sidebars as a visually distinct callout, cross-referenced moves as tappable chips. Tapping a cross-ref opens that move in a bottom sheet/modal so the user doesn't lose their place in a fight or a scene.
- **Search**: instant fuzzy search (Fuse.js) across move titles + trigger + outcome text, scoped to the currently selected game by default with a toggle to search both. Big touch targets, results grouped by category.
- **Favorites**: star any move from list or detail view; stored in `localStorage`; surfaced as its own tab so frequently-used moves (Face Danger, Pay the Price, Ask the Oracle…) are one tap away without browsing.
- **Settings**: theme (system/light/dark), language (en/pt-BR, per §6), default game on launch.

**Responsive behavior**: at `md`+ breakpoints, Browse/Search become a two-pane master-detail layout (list on the left, detail on the right) instead of full-screen navigation; the bottom tab bar becomes a left sidebar. Build mobile single-pane first, then add the wider layout — not the other way around.

**Offline/PWA**: `vite-plugin-pwa` with a precache-everything strategy (the whole content set is small — pure text). Add to home screen should work; icon/splash should use the category-color system, not a generic placeholder.

## 8. Multi-agent build workflow

This project is expected to be built collaboratively across multiple AI coding tools (Claude Code, Antigravity, Kilo Code running GLM models, etc.), likely in separate sessions/branches rather than one continuous conversation. Plan accordingly:

- **`AGENTS.md`** at repo root is the single canonical instruction file (build/test/lint commands, conventions, definition-of-done). Add thin pointer files for tool-specific discovery where needed (e.g. a `CLAUDE.md` that just says "see AGENTS.md") rather than maintaining duplicate instructions in multiple places.
- **CI is the arbiter, not human review bandwidth.** `.github/workflows/ci.yml` must run typecheck + lint + test + build on every PR and block merge on failure — this matters more than usual here because different agents/models will have different quirks and no shared memory of each other's decisions.
- **Strict typing + lint + Prettier, enforced**, so output style converges regardless of which model wrote it. No `any`, no unused exports, one formatter config, pre-commit hook if feasible.
- **Design tokens (§5) and data schema (§4) are the integration contract.** Any agent touching UI must consume colors from `tokens.ts` and data via `schema.ts` types — never hardcode a hex or reshape the JSON locally. This is what keeps five different sessions' output visually and structurally consistent.
- **Task slicing** — prefer tickets sized for one agent session each, with minimal file overlap:
  1. Scaffold: Vite/TS/Tailwind/ESLint/Prettier + CI + Pages deploy workflow (do first; everything else branches from it).
  2. Content pipeline: `build-content.mjs` + `schema.ts` + generated JSON.
  3. Design tokens + light/dark theming.
  4. Navigation shell: routing, bottom tab bar / sidebar, game switcher.
  5. Browse + move-detail components.
  6. Search (Fuse.js integration).
  7. Favorites (localStorage).
  8. PWA/offline (manifest, icons, Workbox config).
  9. i18n scaffold (en populated, pt-BR stub wired per §6).
  10. Accessibility + responsive polish + one Playwright smoke test.
  - Dependency order: 1 blocks all; 2 and 3 block 4; 4 blocks 5/6/7 (which can run in parallel once it lands); 8/9/10 last. Whoever merges should keep this order — don't let a later-numbered ticket land before its dependencies just because an agent finished it first.
- **Self-contained PRs**: each PR's description should restate the relevant slice of this spec (don't assume the reviewing agent/human has this doc loaded) and note which section of `SPEC.md` it implements.

## 9. GitHub Actions deploy

Two workflows:

**`ci.yml`** — on `pull_request`: `pnpm i --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`. No deploy.

**`deploy.yml`** — on `push` to `main` (+ `workflow_dispatch`):
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    steps:
      - actions/checkout
      - pnpm/action-setup
      - actions/setup-node (with pnpm cache)
      - pnpm i --frozen-lockfile
      - pnpm build            # vite build, base: '/<repo-name>/'
      - actions/upload-pages-artifact (dist/)
  deploy:
    needs: build
    environment: github-pages
    steps:
      - actions/deploy-pages
```
Set `base` in `vite.config.ts` to the repo name (or read from an env var so the same config works if the repo is ever renamed/forked). Enable Pages in repo settings with source "GitHub Actions".

## 10. Open items for whoever picks this up

- Pick and license-check the display font substitute (§5) — don't ship the actual "Modesto Poster" / "Poster Gothic Round ATF" webfonts, they're commercial.
- Decide whether `build-content.mjs` runs at every `pnpm build` (content parsed fresh each time) or is a one-off script whose output is committed — either works, but document the choice in `AGENTS.md` once made so agents don't "fix" it into the other mode.
- No accessibility audit has been done yet on the extracted color set against WCAG contrast requirements — do that as part of ticket 3, before it's baked into components everywhere.
