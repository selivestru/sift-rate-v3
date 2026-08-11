import type {
  RankedListEntry,
  RankedListItem,
  RankedListResponse,
  RankedListServer,
  RankedMedia,
} from '../types/ranked-list.types'

export const createTempId = () => `temp-${crypto.randomUUID()}`

export const isTempId = (id: string) => id.startsWith('temp-')

export const emptyRankedLists = (): RankedListResponse => ({ data: [] })

export const mapLists = (
  prev: RankedListResponse | undefined,
  map: (lists: RankedListItem[]) => RankedListItem[],
): RankedListResponse | undefined => {
  if (!prev) return prev

  return {
    data: map(prev.data),
  }
}

export const renumberPositions = (items: RankedListEntry[]): RankedListEntry[] => {
  return items
    .sort((a, b) => a.position - b.position)
    .map((item, index) => Object.assign(item, { position: index + 1 }))
}

export const reorderItems = (
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

export const optimisticCreateList = (
  prev: RankedListResponse | undefined,
  input: {
    tempId: string
    userId: string
    title: string
  },
): RankedListResponse => {
  const now = new Date().toISOString()
  const list: RankedListItem = {
    id: input.tempId,
    userId: input.userId,
    title: input.title,
    items: [],
    createdAt: now,
    updatedAt: now,
  }

  return {
    data: [list, ...(prev?.data ?? [])],
  }
}

export const reconcileCreateList = (
  prev: RankedListResponse | undefined,
  tempId: string,
  server: RankedListServer,
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) =>
    lists.map((list) => {
      if (list.id !== tempId) return list

      return {
        ...list,
        ...server,
        items: list.items,
      }
    }),
  )
}

export const optimisticUpdateList = (
  prev: RankedListResponse | undefined,
  listId: string,
  patch: Pick<RankedListItem, 'title'>,
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) =>
    lists.map((list) => {
      if (list.id !== listId) return list

      return {
        ...list,
        title: patch.title,
        updatedAt: new Date().toISOString(),
      }
    }),
  )
}

export const reconcileUpdateList = (
  prev: RankedListResponse | undefined,
  server: RankedListServer,
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) =>
    lists.map((list) => {
      if (list.id !== server.id) return list

      return {
        ...list,
        title: server.title,
        updatedAt: server.updatedAt,
      }
    }),
  )
}

export const optimisticDeleteList = (
  prev: RankedListResponse | undefined,
  listId: string,
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) => lists.filter((list) => list.id !== listId))
}

export const optimisticAddItem = (
  prev: RankedListResponse | undefined,
  input: {
    tempId: string
    listId: string
    mediaId: string
    media: RankedMedia
  },
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) =>
    lists.map((list) => {
      if (list.id !== input.listId) return list

      const maxPosition = list.items.reduce((max, item) => Math.max(max, item.position), 0)
      const entry: RankedListEntry = {
        id: input.tempId,
        listId: input.listId,
        mediaId: input.mediaId,
        position: maxPosition + 1,
        createdAt: new Date().toISOString(),
        media: input.media,
      }

      return {
        ...list,
        items: [...list.items, entry],
        updatedAt: new Date().toISOString(),
      }
    }),
  )
}

export const reconcileAddItem = (
  prev: RankedListResponse | undefined,
  listId: string,
  tempId: string,
  server: RankedListEntry,
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) =>
    lists.map((list) => {
      if (list.id !== listId) return list

      return {
        ...list,
        items: list.items.map((item) => (item.id === tempId ? server : item)),
      }
    }),
  )
}

export const optimisticDeleteItem = (
  prev: RankedListResponse | undefined,
  listId: string,
  itemId: string,
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) =>
    lists.map((list) => {
      if (list.id !== listId) return list

      return {
        ...list,
        items: renumberPositions(list.items.filter((item) => item.id !== itemId)),
        updatedAt: new Date().toISOString(),
      }
    }),
  )
}

export const optimisticReorderItem = (
  prev: RankedListResponse | undefined,
  listId: string,
  itemId: string,
  position: number,
): RankedListResponse | undefined => {
  return mapLists(prev, (lists) =>
    lists.map((list) => {
      if (list.id !== listId) return list

      return {
        ...list,
        items: reorderItems(list.items, itemId, position),
        updatedAt: new Date().toISOString(),
      }
    }),
  )
}
