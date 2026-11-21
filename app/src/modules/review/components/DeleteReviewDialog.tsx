import { useIntlayer } from 'react-intlayer'

import { toastApiError } from '~/common/api'
import { MEDIA_TYPES, type MediaType } from '~/common/constants/media-type'
import { useDisclosure } from '~/common/hooks/useDisclosure'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/common/ui/AlertDialog'
import { cn } from '~/common/utils/cn'

import { useDeleteReviewMutation } from '../hooks/useDeleteReviewMutation'

interface DeleteReviewDialogProps {
  reviewId: string
  rating: number
  mediaType: MediaType
  seasonNumber?: number | null
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const DeleteReviewDialog = ({
  reviewId,
  rating,
  mediaType,
  seasonNumber,
  children,
}: DeleteReviewDialogProps) => {
  const content = useIntlayer('delete-review-dialog')
  const shared = useIntlayer('shared')
  const { opened, open, close } = useDisclosure()

  const mutation = useDeleteReviewMutation()

  const isSeason = seasonNumber != null
  const isShow = !isSeason && mediaType === MEDIA_TYPES.TV_SHOW

  const title = isSeason
    ? content.deleteSeasonTitle({ season: content.seasonLabel({ season: seasonNumber }) })
    : isShow
      ? content.deleteShowTitle.value
      : content.deleteTitle.value

  const description = isSeason
    ? content.deleteSeasonDescription({
        season: content.seasonLabel({ season: seasonNumber }),
      })
    : isShow
      ? content.deleteShowDescription.value
      : content.deleteTitleDescription.value

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync({ id: reviewId, rating, mediaType })
      close()
    } catch (error) {
      await toastApiError(error)
    }
  }

  return (
    <>
      {children({ open })}
      <AlertDialog open={opened} onOpenChange={close}>
        <AlertDialogContent className={cn(mutation.isPending && 'pointer-events-none')}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              {shared.cancel.value}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              isLoading={mutation.isPending}
            >
              {shared.delete.value}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
