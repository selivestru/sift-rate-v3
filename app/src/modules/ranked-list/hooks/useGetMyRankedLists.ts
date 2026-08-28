import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAppLocale } from '~/common/i18n'

import { rankedListApi } from '../api/ranked-list.api'

export const useGetMyRankedLists = () => {
  const { locale } = useAppLocale()

  return useSuspenseQuery({
    queryKey: [...QUERIES_KEYS.rankedLists, locale],
    queryFn: rankedListApi.getMyRankedLists,
  })
}
