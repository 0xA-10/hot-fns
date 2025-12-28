import { describe, expect, it } from 'vitest';
import { mapKeysHot, mapKeysHotFast } from '../../src/object/mapKeys.js';

describe('mapKeysHot', () => {
  it('transforms object keys', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeysHot(obj, key => key.toUpperCase())).toEqual({ A: 1, B: 2 });
  });

  it('handles empty objects', () => {
    expect(mapKeysHot({}, key => key)).toEqual({});
  });

  it('provides value to mapper', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeysHot(obj, (key, val) => `${key}_${val}`)).toEqual({ a_1: 1, b_2: 2 });
  });

  it('handles numeric keys', () => {
    const obj = { 1: 'a', 2: 'b' };
    expect(mapKeysHot(obj, key => `key_${key}`)).toEqual({ key_1: 'a', key_2: 'b' });
  });
});

describe('mapKeysHotFast', () => {
  it('transforms object keys', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeysHotFast(obj, key => key.toUpperCase())).toEqual({ A: 1, B: 2 });
  });

  it('handles empty objects', () => {
    expect(mapKeysHotFast({}, key => key)).toEqual({});
  });

  it('provides value to mapper', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeysHotFast(obj, (key, val) => `${key}_${val}`)).toEqual({ a_1: 1, b_2: 2 });
  });

  it('handles numeric keys', () => {
    const obj = { 1: 'a', 2: 'b' };
    expect(mapKeysHotFast(obj, key => `key_${key}`)).toEqual({ key_1: 'a', key_2: 'b' });
  });
});

describe('mapKeysHot edge cases', () => {
  it('handles prototype property names as output keys', () => {
    // Ensure output object doesn't have prototype pollution issues
    const obj = { a: 1, b: 2 };
    const result = mapKeysHot(obj, key => (key === 'a' ? 'toString' : 'constructor'));
    expect(result.toString).toBe(1);
    expect(result.constructor).toBe(2);
    expect(typeof result.toString).toBe('number');
  });

  it('handles duplicate keys (last wins)', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = mapKeysHot(obj, () => 'same');
    expect(result).toEqual({ same: 3 }); // Last value wins
  });
});
