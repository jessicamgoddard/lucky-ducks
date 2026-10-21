// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { loadItems, saveItems } from './storage';

const KEY = 'random-picker-items';

describe('storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns an empty list when nothing is saved', () => {
    expect(loadItems()).toEqual([]);
  });

  it('round-trips saved items', () => {
    const items = [{ id: 'a', label: 'Alice' }];
    saveItems(items);
    expect(loadItems()).toEqual(items);
  });

  it('ignores data that is not valid JSON', () => {
    localStorage.setItem(KEY, 'not json');
    expect(loadItems()).toEqual([]);
  });

  it.each(['null', '{"a":1}', '"text"', '5'])('ignores saved data that is not a list (%s)', (raw) => {
    localStorage.setItem(KEY, raw);
    expect(loadItems()).toEqual([]);
  });

  it('drops malformed entries but keeps good ones', () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: 'a', label: 'Alice' }, 1, null, { id: 2, label: 'x' }, { id: 'b' }]));
    expect(loadItems()).toEqual([{ id: 'a', label: 'Alice' }]);
  });
});
