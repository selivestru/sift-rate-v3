import { Controller } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'
import { Star, XCircle } from 'reicon-react'

import { useDisclosure } from '~/common/hooks/useDisclosure'
import { CONTENT_MAX_LENGTH } from '~/common/schema/content.schema'
import type { MediaRef } from '~/common/types/media-ref.types'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Dialog, DialogContent, DialogFooter } from '~/common/ui/Dialog'
import { Field, FieldError, FieldLabel } from '~/common/ui/Field'
import { Textarea } from '~/common/ui/Textarea'
import { cn } from '~/common/utils/cn'

import { useUpsertReviewForm } from '../hooks/useUpsertReviewForm'
import type { Review } from '../types/review.types'

interface UpsertReviewDialogProps {
  initialData?: Review | null
  media: MediaRef
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const UpsertReviewDialog = ({ initialData, media, children }: UpsertReviewDialogProps) => {
  const content = useIntlayer('upsert-review-dialog')
  const shared = useIntlayer('shared')
  const { opened, open, close } = useDisclosure()

  const { onSubmit, control, reset, isLoading, serverError } = useUpsertReviewForm(
    media,
    () => {
      close()
      setTimeout(reset, 200)
    },
    initialData,
  )

  const onClose = () => {
    close()
    setTimeout(reset, 200)
  }

  return (
    <>
      {children({ open })}
      <Dialog open={opened} onOpenChange={onClose} disablePointerDismissal>
        <DialogContent showCloseButton className="gap-2 sm:max-w-xl">
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
              name="rating"
              control={control}
              render={({ field }) => (
                <Field className="items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-18 items-center gap-2">
                      <Star
                        weight="Filled"
                        className="text-rating size-7 transition-colors duration-300"
                      />
                      <span
                        className={cn(
                          'text-5xl font-bold tracking-tight tabular-nums',
                          field.value ? 'text-rating' : 'text-muted-foreground',
                        )}
                      >
                        {field.value ?? '—'}
                      </span>
                      <span className="text-muted-foreground mt-2 text-sm font-medium tabular-nums">
                        /10
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {field.value == null ? content.pickScore.value : content.tapToChange.value}
                    </span>
                  </div>

                  <div
                    role="group"
                    aria-label={content.ratingAria.value}
                    className="flex w-full gap-1.5"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
                      const isSelected = field.value === value
                      const isFilled = value <= field.value

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          className={cn(
                            'group focus-visible:ring-ring/40 flex aspect-square flex-1 cursor-pointer items-center justify-center rounded-xl border transition-all duration-300 ease-out outline-none focus-visible:ring-3 border-border sm:rounded-2xl',
                            isSelected
                              ? 'bg-secondary hover:bg-accent'
                              : isFilled
                                ? 'bg-secondary hover:bg-accent'
                                : 'bg-muted hover:bg-accent',
                          )}
                          aria-pressed={isSelected}
                          aria-label={content.rateAria({ value })}
                        >
                          <Star
                            weight={isSelected || isFilled ? 'Filled' : 'Outline'}
                            className={cn(
                              'size-[60%] transition-transform duration-300 ease-out group-hover:-translate-y-1',
                              isSelected || isFilled
                                ? 'text-rating'
                                : 'text-muted-foreground group-hover:text-foreground',
                            )}
                          />
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}
            />
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="review-content">{content.reviewOptional.value}</FieldLabel>
                    <span
                      className={cn(
                        'text-xs tabular-nums',
                        field.value &&
                          field.value.length >= CONTENT_MAX_LENGTH &&
                          'text-destructive',
                      )}
                      aria-live="polite"
                    >
                      {field.value?.length ?? 0}/{CONTENT_MAX_LENGTH}
                    </span>
                  </div>
                  <Textarea
                    id="review-content"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    placeholder={content.placeholder.value}
                    maxLength={CONTENT_MAX_LENGTH}
                    className="border-border h-50 scrollbar-none break-all"
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
                {content.saveRating.value}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
