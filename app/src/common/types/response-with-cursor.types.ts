export interface ResponseWithCursor<T> {
  data: T[]
  nextCursor: string | null
}
