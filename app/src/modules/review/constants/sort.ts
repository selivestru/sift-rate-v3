import { SortAsc, SortDesc, type IconComponent } from 'reicon-react'

export const REVIEW_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const

export type ReviewSort = (typeof REVIEW_SORT)[keyof typeof REVIEW_SORT]

export const DEFAULT_REVIEW_SORT = REVIEW_SORT.NEWEST

export const reviewSortMeta: {
  value: ReviewSort
  label: string
  icon: IconComponent
}[] = [
  {
    value: REVIEW_SORT.NEWEST,
    label: 'New ratings',
    icon: SortDesc,
  },
  {
    value: REVIEW_SORT.OLDEST,
    label: 'Old ratings',
    icon: SortAsc,
  },
]
