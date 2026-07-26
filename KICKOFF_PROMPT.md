You're implementing "Pocket Moves" — a mobile-first pocket reference app for Ironsworn/Starforged moves.

Before doing anything else, read these two files in full:
- `SPEC.md` — full product/technical spec (goal, stack, data model, design tokens, UX, deploy, multi-agent workflow).
- `AGENTS.md` — quick-reference conventions, commands, build order, and "things that look like bugs but aren't."

The rules content is already extracted and is the source of truth — do not rewrite or "clean up" the wording in `content/ironsworn_moves.md` / `content/starforged_moves.md`; they're verbatim transcriptions from the official PDFs (also in `docs/`), including the extracted color/typography legends you should use for the design tokens.

## Start here

Work `SPEC.md` §8's build order **one ticket at a time**, starting with **Ticket 1: Scaffold** (Vite + React + TS + Tailwind + ESLint + Prettier + CI workflow + GitHub Pages deploy workflow). Don't jump ahead to a later ticket until its dependencies have actually landed and work — the ordering in §8 is deliberate.

After Ticket 1, move to **Ticket 2 (content pipeline)** and **Ticket 3 (design tokens/theming)**, which unblock everything else.

## Critical: keep me testing as you go

I want to open this in a browser and click around as it's being built, not just see a finished result at the end. So:

- The **moment** `pnpm dev` is running for the first time, tell me the local URL/port before doing anything else. Don't silently keep coding for another 20 minutes first.
- If the dev server ever restarts on a different port, tell me immediately.
- At the end of **every ticket**, stop and tell me: which ticket just landed, what's now testable/clickable that wasn't before, and the URL/port to look at it. A one- or two-line note is enough — I don't need a full report, just enough to know where to look and what to try.
- If something is only partially working (e.g. navigation shell exists but move detail is still a stub), say so explicitly rather than letting me discover it.

Treat each ticket boundary as a natural checkpoint to pause and let me react before continuing to the next one, rather than batching multiple tickets into one silent run.
