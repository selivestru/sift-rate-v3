import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/common/ui/Select'

import {
  DEFAULT_REVIEW_SORT,
  REVIEW_SORT,
  reviewSortMeta,
  type ReviewSort,
} from '../constants/sort'

const items = reviewSortMeta.map((item) => ({
  value: item.value,
  label: item.label,
}))

const sortMetaByValue = Object.fromEntries(
  reviewSortMeta.map((item) => [item.value, item]),
) as Record<ReviewSort, (typeof reviewSortMeta)[number]>

interface ReviewSortSelectProps {
  value: ReviewSort
  onChange: (sort: ReviewSort) => void
}

export const ReviewSortSelect = ({ value, onChange }: ReviewSortSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next === REVIEW_SORT.NEWEST || next === REVIEW_SORT.OLDEST) {
          onChange(next)
        }
      }}
      items={items}
    >
      <SelectTrigger aria-label="Sort reviews">
        <SelectValue>
          {(selected: ReviewSort) => {
            const meta = sortMetaByValue[selected ?? DEFAULT_REVIEW_SORT]
            const Icon = meta.icon

            return (
              <span className="inline-flex items-center gap-1.5">
                <Icon />
                {meta.label}
              </span>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        {reviewSortMeta.map((item) => {
          const Icon = item.icon

          return (
            <SelectItem key={item.value} value={item.value}>
              <span className="inline-flex items-center gap-2">
                <Icon />
                {item.label}
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
