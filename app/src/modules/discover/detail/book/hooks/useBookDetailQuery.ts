import { useSuspenseQuery } from '@tanstack/react-query'

import { bookDetailApi } from '../api/book-detail.api'

export const useBookDetailQuery = (externalId: string) => {
  return useSuspenseQuery({
    queryKey: ['discover', 'detail', 'book', externalId],
    queryFn: () => bookDetailApi.getBook(externalId),
  })
}
