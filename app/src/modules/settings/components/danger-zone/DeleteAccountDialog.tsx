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
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes your profile, reviews, lists, and media archive. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void onSubmit()}
              isLoading={isLoading}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
