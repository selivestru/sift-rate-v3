import { Alert } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/common/ui/Dialog'
import { TimerButton } from '~/common/ui/TimerButton'

import type { ResendVerificationResponse } from '../types/auth.type'

interface ResendVerificationDialogProps {
  isOpen: boolean
  email: string | null
  isLoading?: boolean
  result?: ResendVerificationResponse | null
  error?: string | null
  cooldownSeconds: number
  onResend: () => void
  onClose: () => void
}

export const ResendVerificationDialog = ({
  isOpen,
  email,
  isLoading = false,
  result,
  error = null,
  cooldownSeconds,
  onResend,
  onClose,
}: ResendVerificationDialogProps) => {
  const hasSent = Boolean(result) || cooldownSeconds > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Verify your email</DialogTitle>
          <DialogDescription>
            {hasSent ? (
              <>
                We sent a verification link to{' '}
                <span className="text-foreground font-medium">{email}</span>. Check your inbox and
                spam folder.
              </>
            ) : (
              <>
                We sent a verification link to{' '}
                <span className="text-foreground font-medium">{email}</span> — check your inbox and
                spam folder. If it didn't arrive, press the button below to resend.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <p>{error}</p>
          </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          {cooldownSeconds > 0 ? (
            <TimerButton
              type="button"
              ttl={cooldownSeconds}
              label="Resend link"
              onClick={onResend}
            />
          ) : (
            <Button type="button" isLoading={isLoading} onClick={onResend}>
              {isLoading ? 'Sending…' : 'Send verification link'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
