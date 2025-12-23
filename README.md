# fast-utils

Performance-focused lodash-like utilities backed by vanilla JS.

[![CI](https://github.com/0xA-10/fast-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/0xA-10/fast-utils/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/fast-utils)](https://www.npmjs.com/package/fast-utils)

## Installation

```bash
npm install fast-utils
# or
pnpm add fast-utils
```

## Features

- **Zero dependencies** - Pure vanilla JS implementations
- **Tree-shakeable** - ESM with subpath exports
- **Dual format** - ESM and CJS builds
- **TypeScript** - Full type definitions included
- **Performance** - Optimized for hot paths

## Usage

```typescript
import {dedupeFast, groupByFast, pMapFast} from 'fast-utils';

// Or import specific modules for optimal tree-shaking
import {dedupeFast} from 'fast-utils/array';
import {groupByFast} from 'fast-utils/object';
import {pMapFast} from 'fast-utils/promise';
```

## API

### Array Utilities

```typescript
import {dedupeFast, filterFast, partitionFast} from 'fast-utils/array';
```

| Function | Description |
|----------|-------------|
| `dedupeFast(arr)` | Remove duplicates using Set |
| `uniqueFast(arr)` | Alias for dedupeFast |
| `uniqueByKeyFast(arr, keyFn)` | Dedupe by key selector |
| `uniqueByPredicateFast(arr, predicate)` | Dedupe by equality predicate |
| `filterFast(arr, predicate)` | Filter with type guard support |
| `partitionFast(arr, predicate)` | Split into [pass, fail] |
| `findIndicesFast(arr, predicate)` | Find all matching indices |

### Object Utilities

```typescript
import {groupByFast, indexByFast, countByFast} from 'fast-utils/object';
```

| Function | Description |
|----------|-------------|
| `groupByFast(arr, keyFn)` | Group by key (Map or Object) |
| `indexByFast(arr, keyFn)` | Index array items by key |
| `countByFast(arr, keyFn)` | Count occurrences by key |
| `mapKeysFast(obj, mapper)` | Transform object keys |
| `mapObjectFast(obj, mapper)` | Transform object values |

### Promise Utilities

```typescript
import {pMapFast, pFilterFast, pRetryFast} from 'fast-utils/promise';
```

| Function | Description |
|----------|-------------|
| `pMapFast(items, mapper, opts)` | Async map with concurrency |
| `pFilterFast(items, predicate, opts)` | Async filter with concurrency |
| `pRetryFast(fn, opts)` | Retry with delays/conditions |
| `pSettleFast(promises)` | Settle all promises |

### Stream Utilities

```typescript
import {createTransformFast, pipelineFast} from 'fast-utils/stream';
```

| Function | Description |
|----------|-------------|
| `createTransformFast(fn)` | Create Transform stream |
| `createFilterStreamFast(predicate)` | Create filter stream |
| `createMapStreamFast(mapper)` | Create map stream |
| `pipelineFast(...streams)` | Type-safe pipeline |

## Examples

### Dedupe with custom key

```typescript
import {uniqueByKeyFast} from 'fast-utils';

const users = [
  {id: 1, name: 'Alice'},
  {id: 2, name: 'Bob'},
  {id: 1, name: 'Alice (duplicate)'},
];

const unique = uniqueByKeyFast(users, user => user.id);
// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
```

### Group by with Map

```typescript
import {groupByFast} from 'fast-utils';

const items = [
  {type: 'fruit', name: 'apple'},
  {type: 'vegetable', name: 'carrot'},
  {type: 'fruit', name: 'banana'},
];

const grouped = groupByFast(items, item => item.type);
// Map { 'fruit' => [...], 'vegetable' => [...] }

// Or as plain object:
const groupedObj = groupByFast(items, item => item.type, true);
// { fruit: [...], vegetable: [...] }
```

### Async map with concurrency

```typescript
import {pMapFast} from 'fast-utils';

const urls = ['url1', 'url2', 'url3', /* ... */];

const results = await pMapFast(
  urls,
  async url => fetch(url).then(r => r.json()),
  {concurrency: 5}
);
```

### Retry with exponential backoff

```typescript
import {pRetryFast} from 'fast-utils';

const result = await pRetryFast(
  () => fetch('https://api.example.com/data'),
  {
    retries: 3,
    delay: attempt => Math.pow(2, attempt) * 1000, // 1s, 2s, 4s
    shouldRetry: (err) => err.status >= 500,
  }
);
```

## Publishing (Maintainers)

This package uses [release-please](https://github.com/googleapis/release-please) for automated releases.

1. Commits to `main` following [Conventional Commits](https://www.conventionalcommits.org/) will automatically create/update a release PR
2. Merging the release PR creates a GitHub release and publishes to npm

### Commit Message Format

- `feat: add new feature` - Minor version bump
- `fix: bug fix` - Patch version bump
- `feat!: breaking change` - Major version bump
- `chore: maintenance` - No version bump

## License

MIT
