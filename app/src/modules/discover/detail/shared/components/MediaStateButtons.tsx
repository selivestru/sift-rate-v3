import { useIntlayer } from 'react-intlayer'
import { Star, Trash6 } from 'reicon-react'

import type { MediaType } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'
import { cn } from '~/common/utils/cn'
import { PlannedToggleButton } from '~/modules/planned'
import { DeleteReviewDialog, UpsertReviewDialog } from '~/modules/review'

import { useGetMediaState } from '../hooks/useGetMediaState'

interface MediaStateButtonsProps {
  externalId: string
  mediaType: MediaType
  className?: string
}

export const MediaStateButtons = ({ className, ...props }: MediaStateButtonsProps) => {
  const content = useIntlayer('discover-detail')
  const { data, isLoading, isError } = useGetMediaState(props)

  if (isLoading) {
    return (
      <div className={cn('flex gap-1.5', className)}>
        {Array.from({ length: 2 }).map((_, index) => (
          // oxlint-disable-next-line react/no-array-index-key
          <Skeleton key={index} className="h-10 w-20 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data || isError) {
    return
  }

  const hasReview = !!data.review

  return (
    <div className={cn('flex gap-1.5', className)}>
      <UpsertReviewDialog
        key={data.review?.id ? 'edit' : 'create'}
        media={props}
        initialData={data.review}
      >
        {({ open }) => (
          <Button
            variant={hasReview ? 'secondary' : 'default'}
            className={cn(hasReview && 'text-rating')}
            startIcon={
              <Star weight="Filled" className={cn(hasReview && 'text-rating')} aria-hidden />
            }
            onClick={open}
            aria-label={
              hasReview
                ? content.editRating({ rating: data.review!.rating })
                : content.rateTitle.value
            }
          >
            {hasReview ? data.review!.rating : content.rate.value}
          </Button>
        )}
      </UpsertReviewDialog>
      {hasReview ? (
        <DeleteReviewDialog
          reviewId={data.review!.id}
          rating={data.review!.rating}
          mediaType={props.mediaType}
        >
          {({ open }) => (
            <Button
              isIconOnly
              variant="destructive-soft"
              onClick={open}
              aria-label={content.deleteReview.value}
            >
              <Trash6 weight="Filled" />
            </Button>
          )}
        </DeleteReviewDialog>
      ) : (
        <PlannedToggleButton id={data.plannedItem?.id} {...props} />
      )}
    </div>
  )
}
