export function flatArray<T>(items: T[]): T[] {
  if (items && Array.isArray(items)) {
    return items.reduce((acc, val) => acc.concat(val), []);
  }
  return [];
}
