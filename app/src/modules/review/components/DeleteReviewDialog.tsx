import { toastApiError } from '~/common/api'
import type { MediaType } from '~/common/constants/media-type'
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

interface DialogReviewDialogProps {
  reviewId: string
  rating: number
  mediaType: MediaType
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const DialogReviewDialog = ({
  reviewId,
  rating,
  mediaType,
  children,
}: DialogReviewDialogProps) => {
  const { opened, open, close } = useDisclosure()

  const mutation = useDeleteReviewMutation()

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
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              Your review for this title will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="danger-soft"
              onClick={handleDelete}
              isLoading={mutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
