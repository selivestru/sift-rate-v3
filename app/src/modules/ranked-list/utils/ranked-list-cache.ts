import type { QueryClient } from '@tanstack/react-query'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'

import type {
  RankedListEntry,
  RankedListItem,
  RankedListResponse,
  RankedListServer,
} from '../types/ranked-list.types'

const mapLists = (
  prev: RankedListResponse | undefined,
  map: (lists: RankedListItem[]) => RankedListItem[],
): RankedListResponse | undefined => {
  if (!prev) return prev

  return {
    data: map(prev.data),
  }
}

const renumberPositions = (items: RankedListEntry[]): RankedListEntry[] => {
  return items
    .sort((a, b) => a.position - b.position)
    .map((item, index) => Object.assign(item, { position: index + 1 }))
}

const reorderItems = (
  items: RankedListEntry[],
  itemId: string,
  newPosition: number,
): RankedListEntry[] => {
  const currentIndex = items.findIndex((item) => item.id === itemId)

  if (currentIndex === -1) {
    return items
  }

  const updatedItems = [...items]
  const [movedItem] = updatedItems.splice(currentIndex, 1)

  const targetIndex = newPosition - 1

  const clampedIndex = Math.max(0, Math.min(targetIndex, updatedItems.length))

  updatedItems.splice(clampedIndex, 0, movedItem)

  return updatedItems.map((item, index) => Object.assign(item, { position: index + 1 }))
}

const setRankedLists = (
  client: QueryClient,
  map: (lists: RankedListItem[]) => RankedListItem[],
) => {
  client.setQueryData<RankedListResponse>(QUERIES_KEYS.rankedLists, (prev) => mapLists(prev, map))
}

export const addRankedListToCache = (client: QueryClient, server: RankedListServer) => {
  setRankedLists(client, (lists) => {
    const existing = lists.find((list) => list.id === server.id)

    if (existing) {
      return lists.map((list) =>
        list.id === server.id ? { ...list, ...server, items: list.items } : list,
      )
    }

    return [{ ...server, items: [] }, ...lists]
  })
}

export const updateRankedListInCache = (client: QueryClient, server: RankedListServer) => {
  setRankedLists(client, (lists) =>
    lists.map((list) =>
      list.id === server.id ? { ...list, title: server.title, updatedAt: server.updatedAt } : list,
    ),
  )
}

export const removeRankedListFromCache = (client: QueryClient, server: RankedListServer) => {
  setRankedLists(client, (lists) => lists.filter((list) => list.id !== server.id))
}

export const addRankedItemToCache = (client: QueryClient, server: RankedListEntry) => {
  setRankedLists(client, (lists) =>
    lists.map((list) => {
      if (list.id !== server.listId) return list

      const hasItem = list.items.some((item) => item.id === server.id)

      return {
        ...list,
        items: hasItem
          ? list.items.map((item) => (item.id === server.id ? server : item))
          : [...list.items, server],
      }
    }),
  )
}

export const removeRankedItemFromCache = (client: QueryClient, server: RankedListEntry) => {
  setRankedLists(client, (lists) =>
    lists.map((list) => {
      if (list.id !== server.listId) return list

      return {
        ...list,
        items: renumberPositions(list.items.filter((item) => item.id !== server.id)),
      }
    }),
  )
}

export const reorderRankedItemInCache = (client: QueryClient, server: RankedListEntry) => {
  setRankedLists(client, (lists) =>
    lists.map((list) => {
      if (list.id !== server.listId) return list

      const items = reorderItems(list.items, server.id, server.position)

      return {
        ...list,
        items: items.map((item) => (item.id === server.id ? Object.assign(item, server) : item)),
      }
    }),
  )
}
