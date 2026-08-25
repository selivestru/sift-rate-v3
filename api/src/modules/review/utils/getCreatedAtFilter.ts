export const getCreatedAtFilter = (year?: number, month?: number) => {
  if (year === undefined) return undefined

  const start = month === undefined ? Date.UTC(year, 0, 1) : Date.UTC(year, month - 1, 1)
  const end = month === undefined ? Date.UTC(year + 1, 0, 1) : Date.UTC(year, month, 1)

  return {
    gte: new Date(start),
    lt: new Date(end),
  }
}
