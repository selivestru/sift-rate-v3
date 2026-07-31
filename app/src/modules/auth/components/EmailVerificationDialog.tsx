import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/common/ui/AlertDialog'

interface EmailVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EmailVerificationDialog = ({ open, onOpenChange }: EmailVerificationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify your email address</AlertDialogTitle>
          <AlertDialogDescription>
            We've sent a verification email to your email address. Open the email and click the
            verification link to activate your account and sign in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
