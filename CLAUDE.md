# Claude Code Notes

Developer notes and implementation details for AI assistants working on this codebase.

## Build & Test

```bash
pnpm install      # Install dependencies
pnpm build        # Build ESM + CJS
pnpm test:run     # Run tests
pnpm lint         # Check code style
pnpm fix          # Auto-fix lint issues
```

## Benchmarks

```bash
pnpm bench              # Run performance benchmarks
pnpm bench:compare      # Compare against lodash/radash/ramda
pnpm bench:memory       # Run memory benchmarks
pnpm bench:baseline     # Save new baseline (local only)
```

Baseline files (`bench/baseline.json`, `bench/memory-baseline.json`) are local-only and excluded from git. CI generates its own baselines.

## Architecture Decisions

### Prototype Pollution Protection

All functions that create result objects using dynamic keys use `Object.create(null)` instead of `{}` to prevent prototype pollution attacks.

**Why?** If a key selector returns `"toString"`, `"constructor"`, or other prototype property names, using `{}` would incorrectly find those properties on the prototype chain.

**Affected functions:**
- `uniqueByKeyHot` - `src/array/uniqueByKey.ts`
- `countByHot` - `src/object/countBy.ts`
- `groupByHot` (asObject mode) - `src/object/groupBy.ts`
- `indexByHot` - `src/object/indexBy.ts`

**Example of the bug this prevents:**
```typescript
// With {} instead of Object.create(null):
const items = [{ name: 'toString' }];
countByHot(items, x => x.name);
// BUG: result.toString would be the Function, not 1
```

### HotFast Variants

Functions with `HotFast` suffix trade memory for speed:
- Use `Object.keys()` + indexed loop (O(n) memory for keys array)
- ~15% faster than `for-in` + `hasOwn` (O(1) iteration memory)

Use HotFast when:
- Processing objects once (no memory pressure)
- Speed is critical
- Objects have many keys

Use regular Hot when:
- Memory constrained
- Processing many objects in a loop
- Object size is small (negligible speed difference)

### Path Caching

`src/internal/iteratee.ts` caches parsed paths (e.g., `"user.profile.email"` → `["user", "profile", "email"]`):
- Cache limit: 1000 entries
- Eviction: FIFO (oldest first)
- Purpose: Avoid repeated `split('.')` allocations

### setPath Array Creation

`setPath` automatically creates arrays when the next key is numeric:
```typescript
setPath({}, ['items', 0], 'first')  // { items: ['first'] }
setPath({}, 'items.0', 'first')     // { items: ['first'] }
```

Numeric detection: `isArrayIndex()` checks for non-negative integers.

## Testing Patterns

### Prototype Pollution Tests

All functions that use `Object.create(null)` should have a test for prototype property names:
```typescript
it('handles prototype property names as keys', () => {
  const items = [{ name: 'toString' }, { name: 'constructor' }];
  const result = functionUnderTest(items, x => x.name);
  // Verify results are correct, not prototype methods
});
```

### Sparse Array Tests

Array functions handle sparse arrays by treating holes as `undefined`:
```typescript
const sparse = [1, , 3];  // Hole at index 1
// Iteration sees: 1, undefined, 3
```
