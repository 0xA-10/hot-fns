import { Bench } from 'tinybench';
import {
  countByHot,
  evolveHot,
  evolveHotFast,
  groupByHot,
  indexByHot,
  mapKeysHot,
  mapKeysHotFast,
  mapObjectHot,
  mapObjectHotFast,
  mapValuesHot,
  mapValuesHotFast,
  omitHot,
  pickHot,
} from '../src/index.js';

export const suite = new Bench({ time: 1000 });

// Test data
const objectArray = Array.from({ length: 10000 }, (_, i) => ({
  id: String(i),
  group: String(i % 10),
  value: i,
}));
const simpleObject = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));
const keysToOmit = ['key1', 'key2', 'key3', 'key4', 'key5'] as const;
const keysToPick = ['key1', 'key2', 'key3', 'key4', 'key5'] as const;
const evolveObject = { a: 1, b: 2, c: { d: 3, e: 4 }, f: 'hello' };
const evolveSpec = {
  a: (x: number) => x * 2,
  c: { d: (x: number) => x + 10 },
  f: (s: string) => s.toUpperCase(),
};

suite
  .add('groupByHot Map (10k items)', () => {
    groupByHot(objectArray, x => x.group);
  })
  .add('groupByHot Object (10k items)', () => {
    groupByHot(objectArray, x => x.group, true);
  })
  .add('groupByHot string path (10k items)', () => {
    groupByHot(objectArray, 'group');
  })
  .add('indexByHot (10k items)', () => {
    indexByHot(objectArray, x => x.id);
  })
  .add('countByHot (10k items)', () => {
    countByHot(objectArray, x => x.group);
  })
  .add('mapKeysHot (100 keys)', () => {
    mapKeysHot(simpleObject, k => String(k).toUpperCase());
  })
  .add('mapValuesHot (100 keys)', () => {
    mapValuesHot(simpleObject, v => v * 2);
  })
  .add('mapObjectHot (100 keys)', () => {
    mapObjectHot(
      simpleObject,
      k => String(k).toUpperCase(),
      v => v * 2,
    );
  })
  .add('omitHot (100 keys, omit 5)', () => {
    omitHot(simpleObject, keysToOmit);
  })
  .add('pickHot (100 keys, pick 5)', () => {
    pickHot(simpleObject, keysToPick);
  })
  .add('evolveHot (nested)', () => {
    evolveHot(evolveSpec, evolveObject);
  })
  // HotFast variants - use Object.keys() for ~15% speed boost at O(n) memory cost
  .add('mapKeysHotFast (100 keys)', () => {
    mapKeysHotFast(simpleObject, k => String(k).toUpperCase());
  })
  .add('mapValuesHotFast (100 keys)', () => {
    mapValuesHotFast(simpleObject, v => v * 2);
  })
  .add('mapObjectHotFast (100 keys)', () => {
    mapObjectHotFast(
      simpleObject,
      k => String(k).toUpperCase(),
      v => v * 2,
    );
  })
  .add('evolveHotFast (nested)', () => {
    evolveHotFast(evolveSpec, evolveObject);
  });
