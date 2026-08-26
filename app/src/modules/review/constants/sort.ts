import { SortAsc, SortDesc, type IconComponent } from 'reicon-react'

export const REVIEW_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const

export type ReviewSort = (typeof REVIEW_SORT)[keyof typeof REVIEW_SORT]

export const DEFAULT_REVIEW_SORT = REVIEW_SORT.NEWEST

export const reviewSortMeta: {
  value: ReviewSort
  labelKey: 'newest' | 'oldest'
  icon: IconComponent
}[] = [
  {
    value: REVIEW_SORT.NEWEST,
    labelKey: 'newest',
    icon: SortDesc,
  },
  {
    value: REVIEW_SORT.OLDEST,
    labelKey: 'oldest',
    icon: SortAsc,
  },
]
