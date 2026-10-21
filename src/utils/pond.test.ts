import { describe, expect, it } from 'vitest';
import { buildPond, decoyCount, revealDuck, shuffle, syncPond } from './pond';
import type { PickerItem } from './storage';

const makeItems = (n: number): PickerItem[] =>
  Array.from({ length: n }, (_, i) => ({ id: `item-${i}`, label: `Item ${i}` }));

const optionIds = (ducks: ReturnType<typeof buildPond>) =>
  ducks.flatMap((d) => (d.content.kind === 'option' ? [d.content.optionId] : [])).sort();

describe('decoyCount', () => {
  it('is 0 when there are no options', () => {
    expect(decoyCount(0)).toBe(0);
  });

  it('is roughly one per two options, at least 1', () => {
    expect(decoyCount(1)).toBe(1);
    expect(decoyCount(2)).toBe(1);
    expect(decoyCount(3)).toBe(2);
    expect(decoyCount(6)).toBe(3);
  });

  it('caps at 5', () => {
    expect(decoyCount(10)).toBe(5);
    expect(decoyCount(50)).toBe(5);
  });
});

describe('shuffle', () => {
  it('keeps the same elements without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect(out.slice().sort()).toEqual(input);
  });
});

describe('buildPond', () => {
  it('is empty with no options', () => {
    expect(buildPond([])).toEqual([]);
  });

  it('has one duck per option plus decoys', () => {
    const items = makeItems(4);
    const ducks = buildPond(items);
    expect(ducks).toHaveLength(4 + decoyCount(4));
    expect(optionIds(ducks)).toEqual(items.map((i) => i.id));
    expect(ducks.filter((d) => d.content.kind === 'decoy')).toHaveLength(decoyCount(4));
  });

  it('has only the options when decoys are off', () => {
    const items = makeItems(4);
    const ducks = buildPond(items, Math.random, false);
    expect(ducks).toHaveLength(4);
    expect(ducks.some((d) => d.content.kind === 'decoy')).toBe(false);
  });

  it('gives every duck a unique id', () => {
    const ducks = buildPond(makeItems(8));
    expect(new Set(ducks.map((d) => d.id)).size).toBe(ducks.length);
  });
});

describe('syncPond', () => {
  it('keeps existing duck ids when the pond grows', () => {
    const before = buildPond(makeItems(2));
    const after = syncPond(before, makeItems(4));
    expect(after).toHaveLength(4 + decoyCount(4));
    expect(after.slice(0, before.length).map((d) => d.id)).toEqual(before.map((d) => d.id));
  });

  it('shrinks the pond when options are removed', () => {
    const before = buildPond(makeItems(6));
    const items = makeItems(2);
    const after = syncPond(before, items);
    expect(after).toHaveLength(2 + decoyCount(2));
    expect(optionIds(after)).toEqual(items.map((i) => i.id));
  });

  it('empties the pond when every option is removed', () => {
    expect(syncPond(buildPond(makeItems(3)), [])).toEqual([]);
  });

  it('re-deals contents with the rng', () => {
    const items = makeItems(5);
    const ducks = buildPond(items);
    const seen = new Set(
      Array.from({ length: 20 }, () => syncPond(ducks, items)[0].content).map((c) =>
        c.kind === 'option' ? c.optionId : c.pun,
      ),
    );
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('revealDuck', () => {
  it('returns the content of the duck with that id', () => {
    const ducks = buildPond(makeItems(3));
    expect(revealDuck(ducks, ducks[1].id)).toBe(ducks[1].content);
  });

  it('returns null for an unknown id', () => {
    expect(revealDuck(buildPond(makeItems(3)), 'nope')).toBeNull();
  });
});
