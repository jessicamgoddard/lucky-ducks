import { describe, expect, it } from 'vitest';
import { getItemTop } from './general';

describe('getItemTop', () => {
  it('puts a lone duck at the top of the track', () => {
    expect(getItemTop(0, 1)).toBe(0);
  });

  it('spreads ducks evenly across the 60px lane area', () => {
    const tops = Array.from({ length: 4 }, (_, i) => getItemTop(i, 4));
    expect(tops).toEqual([0, 15, 30, 45]);
  });

  it('re-spaces when the pond size changes', () => {
    expect(getItemTop(1, 2)).not.toBe(getItemTop(1, 6));
  });
});
