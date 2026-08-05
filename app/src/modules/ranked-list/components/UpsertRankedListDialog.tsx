import { Controller } from 'react-hook-form'
import { XCircle } from 'reicon-react'

import { useDisclosure } from '~/common/hooks/useDisclosure'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/common/ui/Dialog'
import { Field, FieldError, FieldLabel } from '~/common/ui/Field'
import { Input } from '~/common/ui/Input'
import { cn } from '~/common/utils/cn'

import { useUpsertRankedListForm } from '../hooks/useUpsertRankedListForm'
import type { RankedListItem } from '../types/ranked-list.types'

interface UpsertRankedListDialogProps {
  list?: RankedListItem | null
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const UpsertRankedListDialog = ({ list, children }: UpsertRankedListDialogProps) => {
  const { opened, open, close } = useDisclosure()

  const onClose = () => {
    close()
    setTimeout(reset, 200)
  }

  const { onSubmit, control, reset, isLoading, serverError, isEdit } = useUpsertRankedListForm({
    list,
    onClose,
  })

  return (
    <>
      {children({ open })}
      <Dialog open={opened} onOpenChange={onClose}>
        <DialogContent showCloseButton className="gap-4 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit list' : 'New ranked list'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the title and who can see this ranking.'
                : 'Name a ranking and choose how visible it is.'}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={onSubmit}
            className={cn('flex flex-col gap-4', isLoading && 'pointer-events-none')}
          >
            {serverError && (
              <Alert variant="destructive">
                <XCircle />
                <AlertTitle>{serverError}</AlertTitle>
              </Alert>
            )}

            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="ranked-list-title">Title</FieldLabel>
                  <Input
                    id="ranked-list-title"
                    placeholder="Top films of the decade"
                    autoComplete="off"
                    aria-invalid={!!fieldState.error}
                    {...field}
                  />
                  {fieldState.error?.message && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {isEdit ? 'Save changes' : 'Create list'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
