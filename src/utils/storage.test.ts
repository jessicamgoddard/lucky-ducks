// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, loadItems, loadSettings, saveItems, saveSettings } from './storage';

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

  it('drops entries with a blank label', () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: 'a', label: '' }, { id: 'b', label: '   ' }, { id: 'c', label: 'Cy' }]));
    expect(loadItems()).toEqual([{ id: 'c', label: 'Cy' }]);
  });

  it('drops malformed entries but keeps good ones', () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: 'a', label: 'Alice' }, 1, null, { id: 2, label: 'x' }, { id: 'b' }]));
    expect(loadItems()).toEqual([{ id: 'a', label: 'Alice' }]);
  });
});

describe('settings', () => {
  const SETTINGS_KEY = 'random-picker-settings';

  beforeEach(() => localStorage.clear());

  it('defaults to everything on', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(DEFAULT_SETTINGS).toEqual({ sounds: true, decoys: true });
  });

  it('round-trips saved settings', () => {
    saveSettings({ sounds: false, decoys: true });
    expect(loadSettings()).toEqual({ sounds: false, decoys: true });
  });

  it('falls back to defaults for bad data', () => {
    localStorage.setItem(SETTINGS_KEY, 'not json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ sounds: 'no', decoys: false }));
    expect(loadSettings()).toEqual({ sounds: true, decoys: false });
  });
});
