import { Bench } from 'tinybench';
import { pMapFast, pFilterFast } from '../src/index.js';

export const suite = new Bench({ time: 1000 });

// Test data - small arrays since async operations are slower
const smallArray = Array.from({ length: 100 }, (_, i) => i);

suite
  .add('pMapFast (100 items, sync mapper)', async () => {
    await pMapFast(smallArray, x => x * 2);
  })
  .add('pMapFast (100 items, concurrency=10)', async () => {
    await pMapFast(smallArray, async x => x * 2, { concurrency: 10 });
  })
  .add('pFilterFast (100 items, sync predicate)', async () => {
    await pFilterFast(smallArray, x => x > 50);
  });
