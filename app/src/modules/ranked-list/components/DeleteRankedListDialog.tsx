import { useIntlayer } from 'react-intlayer'

import { toastApiError } from '~/common/api'
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

import { useDeleteRankedList } from '../hooks/useDeleteRankedList'

interface DeleteRankedListDialogProps {
  listId: string
  title: string
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const DeleteRankedListDialog = ({
  listId,
  title,
  children,
}: DeleteRankedListDialogProps) => {
  const content = useIntlayer('delete-ranked-list-dialog')
  const shared = useIntlayer('shared')
  const { opened, open, close } = useDisclosure()
  const mutation = useDeleteRankedList()

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync(listId)
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
            <AlertDialogTitle>{content.title.value}</AlertDialogTitle>
            <AlertDialogDescription>{content.description({ title })}</AlertDialogDescription>
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
              {content.deleteList.value}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
