import { Bench } from 'tinybench';
import { dedupeFast, filterFast, findIndicesFast, partitionFast, uniqueByKeyFast } from '../src/index.js';

export const suite = new Bench({ time: 1000 });

// Test data
const largeArray = Array.from({ length: 10000 }, (_, i) => i % 100);
const objectArray = Array.from({ length: 10000 }, (_, i) => ({ id: i, group: String(i % 10) }));

suite
  .add('dedupeFast (10k items, 100 unique)', () => {
    dedupeFast(largeArray);
  })
  .add('filterFast (10k items)', () => {
    filterFast(largeArray, x => x > 50);
  })
  .add('partitionFast (10k items)', () => {
    partitionFast(largeArray, x => x > 50);
  })
  .add('findIndicesFast (10k items)', () => {
    findIndicesFast(largeArray, x => x === 50);
  })
  .add('uniqueByKeyFast (10k objects)', () => {
    uniqueByKeyFast(objectArray, x => x.group);
  });
