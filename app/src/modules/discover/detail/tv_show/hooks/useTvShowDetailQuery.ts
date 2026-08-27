import { useSuspenseQuery } from '@tanstack/react-query'

import { useAppLocale } from '~/common/i18n'

import { tvShowDetailApi } from '../api/tv-show-detail.api'

export const useTvShowDetailQuery = (externalId: string) => {
  const { locale } = useAppLocale()

  return useSuspenseQuery({
    queryKey: ['discover', 'detail', 'tv_show', locale, externalId],
    queryFn: () => tvShowDetailApi.getTvShow(externalId),
  })
}
