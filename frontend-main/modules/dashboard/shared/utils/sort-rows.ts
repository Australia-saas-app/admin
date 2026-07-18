export type SortDirection = "Up" | "Down"

export function parseMoney(value: string): number {
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/)
  return match ? Number(match[0]) : 0
}

export function sortByString<T>(rows: T[], getValue: (row: T) => string, dir: SortDirection): T[] {
  return [...rows].sort((a, b) => {
    const cmp = getValue(a).localeCompare(getValue(b), undefined, { numeric: true, sensitivity: "base" })
    return dir === "Up" ? cmp : -cmp
  })
}

export function sortByMoney<T>(rows: T[], getValue: (row: T) => string, dir: SortDirection): T[] {
  return [...rows].sort((a, b) => {
    const cmp = parseMoney(getValue(a)) - parseMoney(getValue(b))
    return dir === "Up" ? cmp : -cmp
  })
}
