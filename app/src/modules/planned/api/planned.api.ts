import { api } from '~/common/api'

import type {
  AddToPlannedListBody,
  PlannedListItem,
  PlannedListResponse,
} from '../types/planned.types'

export const plannedApi = {
  getPlannedList: () => {
    return api.get<PlannedListResponse>('/planned').json()
  },
  addToPlannedList: (body: AddToPlannedListBody) => {
    return api.post<PlannedListItem>('/planned', { json: body }).json()
  },
  deletePlannedItem: (id: string) => {
    return api.delete<PlannedListItem>(`/planned/${id}`).json()
  },
}
