import { Search, X } from 'reicon-react'

import type { MediaType } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'
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
  const handleClear = () => {
    onQueryChange('')
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search your reviews"
        startIcon={<Search />}
        endIcon={
          query.length > 0 && (
            <Button isIconOnly variant="ghost" size="sm" onClick={handleClear}>
              <X className="size-4" />
            </Button>
          )
        }
        aria-label="Search reviews"
        className="pr-0"
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
