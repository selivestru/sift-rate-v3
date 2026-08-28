import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAppLocale } from '~/common/i18n'

import { feedApi } from '../api/feed.api'

export const useGetFeedQuery = () => {
  const { locale } = useAppLocale()

  return useSuspenseInfiniteQuery({
    queryKey: [...QUERIES_KEYS.feed, locale],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => feedApi.getFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
