# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project

Random Picker: a React 19 + TypeScript + Vite single-page app. The user enters a list of items, shuffles them into hidden "slots" shown as rubber ducks on a track, and clicks a duck to reveal the item in a modal. State persists in `localStorage`. See `README.md` for the to-do list (a11y audit, Jest tests, styling, confetti).

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (type-checks, then bundles to `dist/`)
- `npm run lint` — ESLint (flat config in `eslint.config.js`)
- `npm run preview` — serve the production build

There is no test runner configured yet.

## Architecture

- `src/App.tsx` owns all state: `items` (`PickerItem[]`), `assignments` (`(string | null)[]`, item id per slot, indexed by slot), and `revealedLabel`. Both `items` and `assignments` are saved to `localStorage` via `useEffect`. Child components are presentational and receive callbacks.
- `ItemList` owns the add/edit/delete UI and its own Shuffle/Clear buttons (local state only: new label, editing id). `ItemTrack` renders one `Item` (a duck button) per slot, using `assignments.length` as the slot count; `RevealModal` shows the picked label.
- `Controls.tsx` is currently unused (superseded by the buttons in `ItemList`).
- Each `Item` picks its random animation timing once via `useState` initializers, so ducks keep their motion across re-renders.
- `src/utils/assign.ts` — `randomAssign` shuffles item ids (Fisher-Yates) and places them in random slots; extra slots stay `null` (shown as "Nothing here" on reveal).
- `src/utils/storage.ts` — versioned localStorage wrappers (`...-v1` keys); all reads/writes are try/catch-guarded. Bump the key suffix if the stored shape changes.
- `src/utils/general.ts` — layout helpers (`getItemTop`, `getRandomNumber`) for positioning ducks on the track.

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
