import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { mediaTypeToSlug } from '~/common/constants/media-type'

import type { DiscoverSearchConfig } from '../types/discover-search.types'

interface UseDiscoverSearchQueryOptions<T> {
  config: DiscoverSearchConfig<T>
  q: string
  page: number
}

export const useDiscoverSearchQuery = <T>({
  config,
  q,
  page,
}: UseDiscoverSearchQueryOptions<T>) => {
  const pageSize = config.pageSize
  const trimmedQuery = q.trim()
  const enabled = trimmedQuery.length >= 2

  const query = useQuery({
    queryKey: [...config.queryKey, trimmedQuery, page],
    queryFn: () =>
      config.queryFn({
        slug: mediaTypeToSlug[config.mediaType],
        q: trimmedQuery,
        page,
        pageSize,
      }),
    enabled,
    placeholderData: keepPreviousData,
  })

  return {
    ...query,
    enabled,
    pageSize,
    trimmedQuery,
  }
}
