/** Allocate exactly 100 available points as evenly as possible. */
export function getEqualPointAllocation(count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor(100 / count);
  const remainder = 100 % count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}
