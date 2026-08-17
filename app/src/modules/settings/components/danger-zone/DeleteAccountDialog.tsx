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
import { PasswordField } from '~/common/ui/PasswordField'
import { TwoFactorDialog } from '~/common/ui/TwoFactorDialog'
import { cn } from '~/common/utils/cn'
import { AUTH_METHOD, useAuthStore } from '~/modules/auth'

import { useDeleteAccountForm } from '../../hooks/useDeleteAccountForm'

interface DeleteAccountDialogProps {
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const DeleteAccountDialog = ({ children }: DeleteAccountDialogProps) => {
  const { opened, open, close } = useDisclosure()
  const user = useAuthStore((state) => state.user)
  const isCredentials = user?.method === AUTH_METHOD.CREDENTIALS

  const { register, errors, onSubmit, isLoading, serverError, twoFactorState } =
    useDeleteAccountForm({
      requirePassword: isCredentials,
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
              This would permanently remove your profile, reviews, lists, and media archive.
              We&apos;ll send a confirmation link to your email first — your account is only deleted
              after you confirm it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {serverError && (
            <Alert variant="destructive">
              <XCircle />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}

          {isCredentials && (
            <PasswordField
              label="Password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={errors.password}
              {...register('password')}
            />
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

      <TwoFactorDialog
        isOpen={twoFactorState.isOpen}
        onClose={twoFactorState.onClose}
        onSubmit={twoFactorState.onSubmit}
        isLoading={twoFactorState.isLoading}
        error={twoFactorState.error}
      />
    </>
  )
}
