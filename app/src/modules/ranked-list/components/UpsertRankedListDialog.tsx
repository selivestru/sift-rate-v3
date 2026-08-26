import { Controller } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'
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
  const content = useIntlayer('upsert-ranked-list-dialog')
  const shared = useIntlayer('shared')
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
            <DialogTitle>{isEdit ? content.editTitle.value : content.newTitle.value}</DialogTitle>
            <DialogDescription>
              {isEdit ? content.editDescription.value : content.newDescription.value}
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
                  <FieldLabel htmlFor="ranked-list-title">{content.titleLabel.value}</FieldLabel>
                  <Input
                    id="ranked-list-title"
                    placeholder={content.titlePlaceholder.value}
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
                {shared.cancel.value}
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {isEdit ? content.saveChanges.value : content.createList.value}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
