import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAppLocale } from '~/common/i18n'

import { profileApi } from '../api/profile.api'

export const useGetUserFeedQuery = (username: string) => {
  const { locale } = useAppLocale()

  return useSuspenseInfiniteQuery({
    queryKey: [...QUERIES_KEYS.userFeed(username), locale],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => profileApi.getUserFeed(username, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
