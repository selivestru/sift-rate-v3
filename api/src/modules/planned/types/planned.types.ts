import { PlannedItem } from '~/generated/prisma/client'

export interface PlannedItemsResponse {
  data: PlannedItem[]
  totalResults: number
}
