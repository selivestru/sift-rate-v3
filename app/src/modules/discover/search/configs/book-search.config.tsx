import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverSearchApi } from '../api/discover-search.api'
import { BookSearchCard } from '../components/book/BookSearchCard'
import { BookSearchSkeleton } from '../components/book/BookSearchSkeleton'
import type { BookSearchItem, DiscoverSearchConfig } from '../types/discover-search.types'

export const bookSearchConfig: DiscoverSearchConfig<BookSearchItem> = {
  mediaType: MEDIA_TYPES.BOOK,
  resultsClassName: 'flex flex-col gap-3',
  skeletonCount: 9,
  pageSize: 9,
  queryKey: ['discover', 'search', 'book'],
  queryFn: discoverSearchApi.searchBooks,
  Card: BookSearchCard,
  Skeleton: BookSearchSkeleton,
  getItemKey: (item) => item.id,
}
