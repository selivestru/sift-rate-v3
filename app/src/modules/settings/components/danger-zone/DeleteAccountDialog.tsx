import { useIntlayer } from 'react-intlayer'
import { AlertTriangle, XCircle } from 'reicon-react'

import { useDisclosure } from '~/common/hooks/useDisclosure'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '~/common/ui/AlertDialog'
import { cn } from '~/common/utils/cn'

import { useDeleteAccountForm } from '../../hooks/useDeleteAccountForm'

interface DeleteAccountDialogProps {
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const DeleteAccountDialog = ({ children }: DeleteAccountDialogProps) => {
  const content = useIntlayer('delete-account-dialog')
  const shared = useIntlayer('shared')
  const { opened, open, close } = useDisclosure()

  const { onSubmit, isLoading, serverError } = useDeleteAccountForm({
    onSuccess: close,
  })

  return (
    <>
      {children({ open })}
      <AlertDialog
        open={opened}
        onOpenChange={(next) => {
          if (!next && !isLoading) close()
        }}
      >
        <AlertDialogContent className={cn(isLoading && 'pointer-events-none')}>
          <AlertDialogHeader>
            <AlertDialogMedia variant="destructive">
              <AlertTriangle />
            </AlertDialogMedia>
            <AlertDialogTitle>{content.title}</AlertDialogTitle>
            <AlertDialogDescription>{content.description}</AlertDialogDescription>
          </AlertDialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>{shared.cancel}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void onSubmit()}
              isLoading={isLoading}
            >
              {shared.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
