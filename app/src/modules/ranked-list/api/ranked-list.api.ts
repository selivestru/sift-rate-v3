import { api } from '~/common/api'

import type {
  RankedListEntry,
  RankedListResponse,
  RankedListServer,
  ReorderRankedItemBody,
  UpsertRankedListBody,
} from '../types/ranked-list.types'

export const rankedListApi = {
  getMyRankedLists: () => {
    return api.get<RankedListResponse>('/ranked-list/me').json()
  },

  createList: (body: UpsertRankedListBody) => {
    return api.post<RankedListServer>('/ranked-list', { json: body }).json()
  },

  updateList: (listId: string, body: UpsertRankedListBody) => {
    return api.put<RankedListServer>(`/ranked-list/${listId}`, { json: body }).json()
  },

  deleteList: (listId: string) => {
    return api.delete<RankedListServer>(`/ranked-list/${listId}`).json()
  },

  addItem: (listId: string, mediaId: string) => {
    return api.post<RankedListEntry>(`/ranked-list/${listId}/${mediaId}`).json()
  },

  deleteItem: (listId: string, itemId: string) => {
    return api.delete<RankedListEntry>(`/ranked-list/${listId}/${itemId}`).json()
  },

  reorderItem: (listId: string, itemId: string, body: ReorderRankedItemBody) => {
    return api.put<RankedListEntry>(`/ranked-list/${listId}/${itemId}`, { json: body }).json()
  },
}
