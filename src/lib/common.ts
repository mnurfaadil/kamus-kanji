export function merge<T>(...arrays: ReadonlyArray<ReadonlyArray<T>>): T[] {
  const out: T[] = [];
  const seen = new Set<T>();

  for (const arr of arrays) {
    for (const item of arr) {
      if (seen.has(item)) continue;
      seen.add(item);
      out.push(item);
    }
  }

  return out;
}
