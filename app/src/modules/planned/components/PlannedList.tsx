import type { PlannedListResponse } from '../types/planned.types'
import { PlannedMediaCard } from './PlannedMediaCard'

interface PlannedListProps {
  data: PlannedListResponse['data']
}

export const PlannedList = ({ data }: PlannedListProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {data.map((item) => (
        <PlannedMediaCard key={item.id} item={item} />
      ))}
    </div>
  )
}
