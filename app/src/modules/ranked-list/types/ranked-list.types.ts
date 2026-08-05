import type { MediaType } from '~/common/constants/media-type'

export interface RankedMedia {
  id: string
  externalId: string
  mediaType: MediaType
  title: string
  posterUrl: string | null
  watchUrl?: string | null
}

export interface RankedListEntry {
  id: string
  listId: string
  mediaId: string
  position: number
  createdAt: string
  media: RankedMedia
}

export interface RankedListItem {
  id: string
  userId: string
  title: string
  items: RankedListEntry[]
  createdAt: string
  updatedAt: string
}

export interface RankedListResponse {
  data: RankedListItem[]
}

export interface UpsertRankedListBody {
  title: string
}

export interface ReorderRankedItemBody {
  position: number
}

export type RankedListServer = Omit<RankedListItem, 'items'>

export interface AddRankedItemVariables {
  listId: string
  mediaId: string
  media: RankedMedia
}

export interface DeleteRankedItemVariables {
  listId: string
  itemId: string
}

export interface ReorderRankedItemVariables {
  listId: string
  itemId: string
  position: number
}

export interface UpdateRankedListVariables extends UpsertRankedListBody {
  listId: string
}
