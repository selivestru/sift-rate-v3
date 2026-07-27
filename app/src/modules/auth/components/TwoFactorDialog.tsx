import { useState } from 'react'

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
import { InputOTP } from '~/common/ui/InputOTP'

interface TwoFactorDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (code: string) => void
  isLoading?: boolean
  error?: string | null
}

export const TwoFactorDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
}: TwoFactorDialogProps) => {
  const [code, setCode] = useState('')

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCode('')
      onClose()
    }
  }

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    if (code.length < 6 || isLoading) return
    onSubmit(code)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Two-factor authentication</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code from your authenticator app to sign in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <p>{error}</p>
            </Alert>
          )}

          <InputOTP value={code} onChange={setCode} isInvalid={!!error} disabled={isLoading} />

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCode('')
                onClose()
              }}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isDisabled={code.length < 6} isLoading={isLoading}>
              Verify
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
