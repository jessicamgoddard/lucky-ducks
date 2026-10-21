import type { PickerItem } from './storage';
import { PUNS } from './puns';

const MAX_DECOYS = 5;

/**
 * What a duck hides: either one of the options or a decoy pun.
 */
export type DuckContent =
  | { kind: 'option'; optionId: string; label: string }
  | { kind: 'decoy'; pun: string };

/**
 * A duck in the pond. The id is stable so the duck keeps its animation.
 */
export type Duck = {
  id: string;
  content: DuckContent;
};

type Rng = () => number;

/**
 * Number of decoy ducks for a given number of options.
 * Roughly one per two options, at least 1 and at most MAX_DECOYS.
 * No options means an empty pond, so no decoys.
 */
export function decoyCount(optionCount: number): number {
  if (optionCount <= 0) return 0;
  return Math.min(MAX_DECOYS, Math.max(1, Math.ceil(optionCount / 2)));
}

/**
 * Return a shuffled copy of an array using the Fisher-Yates algorithm.
 */
export function shuffle<T>(list: T[], rng: Rng = Math.random): T[] {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Build the list of things the ducks hide: every option plus the decoys
 * (unless decoys are switched off).
 */
function buildContents(items: PickerItem[], rng: Rng, withDecoys: boolean): DuckContent[] {
  const options: DuckContent[] = items.map((item) => ({
    kind: 'option',
    optionId: item.id,
    label: item.label,
  }));
  const decoys: DuckContent[] = Array.from({ length: withDecoys ? decoyCount(items.length) : 0 }, () => ({
    kind: 'decoy',
    pun: PUNS[Math.floor(rng() * PUNS.length)],
  }));
  return [...options, ...decoys];
}

/**
 * Create a pond with one duck per option plus decoys, contents shuffled.
 */
export function buildPond(items: PickerItem[], rng: Rng = Math.random, withDecoys = true): Duck[] {
  return syncPond([], items, rng, withDecoys);
}

/**
 * Re-deal what the ducks hide so every pick is a fresh random draw, also used
 * when the options change. Existing ducks keep their ids; the pond is resized to match the options
 * (new ducks are added, surplus ducks are removed from the end).
 */
export function syncPond(ducks: Duck[], items: PickerItem[], rng: Rng = Math.random, withDecoys = true): Duck[] {
  const contents = shuffle(buildContents(items, rng, withDecoys), rng);
  return contents.map((content, i) => ({
    id: ducks[i]?.id ?? crypto.randomUUID(),
    content,
  }));
}

/**
 * Look up the contents of a duck by id.
 */
export function revealDuck(ducks: Duck[], duckId: string): DuckContent | null {
  return ducks.find((duck) => duck.id === duckId)?.content ?? null;
}
