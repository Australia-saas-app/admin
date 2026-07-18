type AnyObject = Record<string, any>;

export function addDuplicateCount<T extends AnyObject>(
  arr: T[],
  key: keyof T
): (T & { duplicateCount: number })[] {
  const countMap: Record<string, number> = {};

  // Count how many times each key value appears
  for (const item of arr) {
    const value = item[key];
    if (value !== undefined && value !== null) {
      const strValue = String(value);
      countMap[strValue] = (countMap[strValue] || 0) + 1;
    }
  }

  // Add duplicateCount to each object
  return arr.map((item) => ({
    ...item,
    duplicateCount: countMap[String(item[key])] || 0,
  }));
}
