export type QueryState = 'loading' | 'empty' | 'error' | 'success'

interface GetQueryStateParams<T> {
  data?: T
  isLoading: boolean
  isError: boolean
  isEmpty?: (data: T) => boolean
}

const defaultIsEmpty = <T>(data: T): boolean => {
  if (data == null) return true
  if (Array.isArray(data)) return data.length === 0
  return false
}

export const getQueryState = <T>({
  data,
  isLoading,
  isError,
  isEmpty = defaultIsEmpty,
}: GetQueryStateParams<T>): QueryState => {
  if (isLoading) return 'loading'
  if (isError) return 'error'
  if (data === undefined || isEmpty(data)) return 'empty'
  return 'success'
}
