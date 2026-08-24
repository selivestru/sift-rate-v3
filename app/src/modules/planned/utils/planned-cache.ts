import type { QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import type { MediaStateResponse } from '~/modules/discover'

import type { PlannedListItem, PlannedListResponse } from '../types/planned.types'

export const addPlannedItemToCache = (client: QueryClient, item: PlannedListItem) => {
  client.setQueryData<PlannedListResponse>(QUERIES_KEYS.plannedList, (prev) => {
    if (!prev) return prev

    return {
      data: [...prev.data, item],
      totalResults: prev.totalResults + 1,
    }
  })

  const { media } = item

  client.setQueryData<MediaStateResponse>(
    QUERIES_KEYS.mediaState({ externalId: media.externalId, mediaType: media.mediaType }),
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        plannedItem: item,
      }
    },
  )
}

export const removePlannedItemFromCache = (client: QueryClient, item: PlannedListItem) => {
  client.setQueryData<PlannedListResponse>(QUERIES_KEYS.plannedList, (prev) => {
    if (!prev) return prev

    return {
      data: prev.data.filter((plannedItem) => plannedItem.id !== item.id),
      totalResults: prev.totalResults - 1,
    }
  })

  const { media } = item

  client.setQueryData<MediaStateResponse>(
    QUERIES_KEYS.mediaState({ externalId: media.externalId, mediaType: media.mediaType }),
    (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        plannedItem: null,
      }
    },
  )
}
