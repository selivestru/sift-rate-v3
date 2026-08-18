import { toastApiError } from '~/common/api'
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

import { useDeletePostMutation } from '../hooks/useDeletePostMutation'

interface DeletePostModalProps {
  open: boolean
  postId?: string
  parentId?: string | null
  onClose: () => void
  onDeleted?: () => void
}

export const DeletePostModal = ({
  open,
  postId,
  parentId,
  onClose,
  onDeleted,
}: DeletePostModalProps) => {
  const deleteMutation = useDeletePostMutation(parentId ?? null)

  const isPending = deleteMutation.isPending

  const handleDelete = async () => {
    if (!postId) return

    try {
      await deleteMutation.mutateAsync(postId)
      onDeleted?.()
      onClose()
    } catch (error) {
      toastApiError(error)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isPending) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete post?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the post and its replies. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" isLoading={isPending} onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
