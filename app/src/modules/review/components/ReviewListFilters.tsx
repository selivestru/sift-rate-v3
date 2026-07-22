import { Search } from 'reicon-react'

import type { MediaType } from '~/common/constants/media-type'
import { Input } from '~/common/ui/Input'

import type { ReviewSort } from '../constants/sort'
import type { ReviewStats } from '../types/review.types'
import { ReviewMediaTypeSelect } from './ReviewMediaTypeSelect'
import { ReviewRatingSelect } from './ReviewRatingSelect'
import { ReviewSortSelect } from './ReviewSortSelect'

interface ReviewListFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  mediaType?: MediaType
  onMediaTypeChange: (mediaType: MediaType | undefined) => void
  rating?: number
  onRatingChange: (rating: number | undefined) => void
  sort: ReviewSort
  onSortChange: (sort: ReviewSort) => void
  stats?: ReviewStats
}

export const ReviewListFilters = ({
  query,
  onQueryChange,
  mediaType,
  onMediaTypeChange,
  rating,
  onRatingChange,
  sort,
  onSortChange,
  stats,
}: ReviewListFiltersProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search your reviews"
        startIcon={<Search />}
        aria-label="Search reviews"
      />

      <div className="grid gap-2 max-sm:grid-rows-3 sm:grid-cols-3">
        <ReviewMediaTypeSelect
          value={mediaType}
          onChange={onMediaTypeChange}
          total={stats?.total}
          counts={stats?.byMediaType}
        />
        <ReviewRatingSelect
          value={rating}
          onChange={onRatingChange}
          total={stats?.total}
          counts={stats?.byRating}
        />
        <ReviewSortSelect value={sort} onChange={onSortChange} />
      </div>
    </div>
  )
}
