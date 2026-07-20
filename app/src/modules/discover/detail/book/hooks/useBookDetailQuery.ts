import { useQuery } from '@tanstack/react-query'

import { bookDetailApi } from '../api/book-detail.api'

export const useBookDetailQuery = (externalId: string) => {
  return useQuery({
    queryKey: ['discover', 'detail', 'book', externalId],
    queryFn: () => bookDetailApi.getBook(externalId),
    enabled: externalId.length > 0,
  })
}
