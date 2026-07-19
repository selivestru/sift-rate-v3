import { MEDIA_TYPES } from '~/common/constants/media-type'

import { discoverApi } from '../../../api/discover.api'
import { BookSearchCard } from '../components/media/book/BookSearchCard'
import { BookSearchSkeleton } from '../components/media/book/BookSearchSkeleton'
import type { BookSearchItem, DiscoverSearchConfig } from '../types/discover-search.types'

export const bookSearchConfig: DiscoverSearchConfig<BookSearchItem> = {
  mediaType: MEDIA_TYPES.BOOK,
  title: 'Find books',
  description: 'Search pages and shelves for your archive.',
  searchPlaceholder: 'Search books…',
  resultsClassName: 'flex flex-col gap-3',
  skeletonCount: 9,
  pageSize: 9,
  queryKey: ['discover', 'search', 'book'],
  queryFn: discoverApi.searchBooks,
  Card: BookSearchCard,
  Skeleton: BookSearchSkeleton,
  getItemKey: (item) => item.id,
}
