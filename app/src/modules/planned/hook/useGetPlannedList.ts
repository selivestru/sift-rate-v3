import { useSuspenseQuery } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useAppLocale } from '~/common/i18n'

import { plannedApi } from '../api/planned.api'

export const useGetPlannedList = () => {
  const { locale } = useAppLocale()

  return useSuspenseQuery({
    queryKey: [...QUERIES_KEYS.plannedList, locale],
    queryFn: plannedApi.getPlannedList,
  })
}
