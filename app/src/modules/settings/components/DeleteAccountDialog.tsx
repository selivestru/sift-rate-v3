import { useState } from 'react'
import { AlertTriangle } from 'reicon-react'
import { toast } from 'sonner'

import { useDisclosure } from '~/common/hooks/useDisclosure'
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

import { mockDelay } from '../utils/mock-delay'

interface DeleteAccountDialogProps {
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const DeleteAccountDialog = ({ children }: DeleteAccountDialogProps) => {
  const { opened, open, close } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await mockDelay()
      toast.success('Account deletion requested (demo only)')
      close()
    } finally {
      setIsLoading(false)
    }
  }

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
              This would permanently remove your profile, reviews, lists, and media archive. This
              demo does not call the API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirm} isLoading={isLoading}>
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
