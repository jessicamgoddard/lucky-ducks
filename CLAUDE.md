# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project

Random Picker: a React 19 + TypeScript + Vite single-page app styled as a carnival duck pond. Enter options, press Start, then click a duck to reveal what it hides. Deployed to GitHub Pages at https://jessicamgoddard.github.io/random-picker/ (workflow in `.github/workflows/deploy.yml`, runs on push to `main`; Vite `base` is `/random-picker/`). See `README.md` for the to-do list.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (type-checks, then bundles to `dist/`)
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm test` — Vitest (`vitest run`); tests sit next to the code as `*.test.ts`
- `npm run preview` — serve the production build

## Architecture

- `src/App.tsx` owns all state: `items` (`PickerItem[]`, the options), `phase` (`'setup'` | `'pond'`), `ducks` (`Duck[]`), `editing` and `revealed`. Only `items` is saved to `localStorage`; the pond is never persisted, so a refresh returns to setup.
- Setup shows `ItemList` and a Start button. The pond phase shows `ItemTrack`, plus an action bar (Reshuffle, Edit options, Back to setup) that reveals `ItemList` so options can be added/removed mid-game (the pond is re-synced on every change).
- `src/utils/pond.ts` is the pure game logic: one duck per option plus decoy ducks (`decoyCount`: about one per two options, min 1, max 5, none when there are no options). `syncPond` re-deals what the ducks hide, keeping duck ids stable and resizing the pond; picks and option changes both call it, so every pick is a fresh draw. Decoys reveal a random pun from `src/utils/puns.ts`. All ducks look identical.
- `ItemTrack` renders one `Item` (a duck button) per duck, keyed by duck id. Each `Item` picks its random animation timing once via `useState` initializers. `Reveal` is the result overlay: a duck pops up and a label card appears; real options also fire a CSS-only confetti burst (no dependency). It moves focus to Close, closes on Escape/backdrop, restores focus, and honours `prefers-reduced-motion`.
- `src/utils/storage.ts` — localStorage wrapper for items, try/catch-guarded.
- `src/utils/general.ts` — layout helpers (`getItemTop`, `getRandomNumber`) for positioning ducks.

## Styling

- Sass, not CSS modules. `src/scss/index.scss` is imported in `main.tsx` (global styles, `@use './mixins'`); each component imports its own partial from `src/scss/components/_<name>.scss`.
- BEM-style class names (`item-track__items`). Shared mixins live in `src/scss/_mixins.scss`.
- Autoprefixer runs through `postcss.config.cjs`; browserslist is in `package.json`.
- The layout uses container queries (`cqw` units) on `.container`; keep that in mind when changing sizes.

## Conventions

- Function components with default exports, a `Props` type above the component, and a JSDoc block per component/function.
- Code is heavily commented line-by-line; match that density.
- 2-space indentation in TS/TSX, single quotes, semicolons.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`jessicamgoddard/random-picker`), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
