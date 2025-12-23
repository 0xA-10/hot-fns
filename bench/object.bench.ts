import { Bench } from 'tinybench';
import { countByFast, groupByFast, indexByFast, mapKeysFast, mapObjectFast } from '../src/index.js';

export const suite = new Bench({ time: 1000 });

// Test data
const objectArray = Array.from({ length: 10000 }, (_, i) => ({ id: String(i), group: String(i % 10), value: i }));
const simpleObject = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));

suite
  .add('groupByFast Map (10k items)', () => {
    groupByFast(objectArray, x => x.group);
  })
  .add('groupByFast Object (10k items)', () => {
    groupByFast(objectArray, x => x.group, true);
  })
  .add('indexByFast (10k items)', () => {
    indexByFast(objectArray, x => x.id);
  })
  .add('countByFast (10k items)', () => {
    countByFast(objectArray, x => x.group);
  })
  .add('mapKeysFast (100 keys)', () => {
    mapKeysFast(simpleObject, k => k.toUpperCase());
  })
  .add('mapObjectFast (100 keys)', () => {
    mapObjectFast(simpleObject, v => v * 2);
  });
