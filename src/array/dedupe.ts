/**
 * Remove duplicate values from an array using Set (reference equality).
 * Preserves order of first occurrence.
 *
 * @param arr - Input array
 * @returns New array with duplicates removed
 */
export function dedupeFast<T>(arr: readonly T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Alias for dedupeFast.
 */
export const uniqueFast = dedupeFast;
