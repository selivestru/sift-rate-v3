import { useIntlayer } from 'react-intlayer'
import { Star } from 'reicon-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/common/ui/Select'

const RATING_VALUES = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] as const

interface ReviewRatingSelectProps {
  value?: number
  onChange: (rating: number | undefined) => void
  total?: number
  counts?: Partial<Record<number, number>>
}

export const ReviewRatingSelect = ({
  value,
  onChange,
  total = 0,
  counts,
}: ReviewRatingSelectProps) => {
  const content = useIntlayer('review-rating-select')
  const items = [
    { value: null, label: content.allRatings.value },
    ...RATING_VALUES.map((rating) => ({ value: rating, label: String(rating) })),
  ]

  return (
    <Select
      value={value ?? null}
      onValueChange={(next) => onChange(next ?? undefined)}
      items={items}
    >
      <SelectTrigger aria-label={content.filterByRating.value}>
        <SelectValue placeholder={content.allRatings.value}>
          {(selected: number | null) => {
            if (selected == null) {
              return (
                <span className="text-rating inline-flex items-center gap-1.5">
                  <Star weight="Filled" className="text-rating" />
                  {content.allRatings.value}
                </span>
              )
            }

            return (
              <span className="text-rating inline-flex items-center gap-1.5">
                <Star weight="Filled" />
                <span className="font-semibold tabular-nums">{selected}</span>
              </span>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-max" alignItemWithTrigger={false} align="center">
        <SelectItem value={null}>
          <span className="flex w-full items-center justify-between gap-3">
            <span className="text-rating inline-flex items-center gap-2">
              <Star weight="Filled" className="text-rating" />
              {content.allRatings.value}
            </span>
            <span className="text-primary text-xs tabular-nums">{total}</span>
          </span>
        </SelectItem>

        {RATING_VALUES.map((rating) => {
          const count = counts?.[rating] ?? 0

          return (
            <SelectItem key={rating} value={rating} disabled={count === 0}>
              <span className="flex w-full items-center justify-between gap-3">
                <span className="text-rating inline-flex items-center gap-1.5">
                  <Star weight="Filled" />
                  <span className="font-semibold tabular-nums">{rating}</span>
                </span>
                <span className="text-primary text-xs tabular-nums">{count}</span>
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
