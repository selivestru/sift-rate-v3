import { Controller } from 'react-hook-form'
import { Star, XCircle } from 'reicon-react'

import { useDisclosure } from '~/common/hooks/useDisclosure'
import type { MediaRef } from '~/common/types/media-ref.types'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Dialog, DialogContent, DialogFooter } from '~/common/ui/Dialog'
import { Field, FieldError, FieldLabel } from '~/common/ui/Field'
import { Switch } from '~/common/ui/Switch'
import { Tabs, TabsIndicator, TabsList, TabsTab } from '~/common/ui/Tabs'
import { Textarea } from '~/common/ui/Textarea'
import { cn } from '~/common/utils/cn'

import { VISIBILITY_OPTIONS } from '../constants/visibility'
import { useUpsertReviewForm } from '../hooks/useUpsertReviewForm'
import { MAX_REVIEW_LENGTH } from '../schema/rate.schema'
import type { Review } from '../types/review.types'

interface UpsertReviewDialogProps {
  initialData?: Review | null
  media: MediaRef
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const UpsertReviewDialog = ({ initialData, media, children }: UpsertReviewDialogProps) => {
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
      <Dialog open={opened} onOpenChange={onClose}>
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
                      {field.value == null ? 'Pick a score' : 'Tap to change'}
                    </span>
                  </div>

                  <div
                    role="group"
                    aria-label="Rating from 1 to 10"
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
                            'group focus-visible:ring-ring/30 flex aspect-square min-h-11 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-2xl border transition-all duration-300 ease-out outline-none focus-visible:ring-3 border-border',
                            isSelected
                              ? 'bg-rating/20 hover:bg-rating/30'
                              : isFilled
                                ? 'bg-rating/20 hover:bg-rating/30'
                                : 'bg-muted hover:bg-muted',
                          )}
                          aria-pressed={isSelected}
                          aria-label={`Rate ${value} out of 10`}
                        >
                          <Star
                            weight={isSelected || isFilled ? 'Filled' : 'Outline'}
                            className={cn(
                              'size-5 transition-transform duration-300 ease-out group-hover:-translate-y-1',
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
            <div className="bg-muted ring-border flex flex-col gap-4 rounded-2xl p-4 ring-1">
              <Controller
                name="content"
                control={control}
                render={({ field, fieldState }) => (
                  <Field>
                    <div className="flex items-center justify-between gap-2">
                      <FieldLabel htmlFor="review-content">Review (optional)</FieldLabel>
                      <span
                        className={cn(
                          'text-xs tabular-nums',
                          field.value &&
                            field.value.length >= MAX_REVIEW_LENGTH &&
                            'text-destructive',
                        )}
                        aria-live="polite"
                      >
                        {field.value?.length ?? 0}/{MAX_REVIEW_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="review-content"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      placeholder="What stayed with you?"
                      maxLength={MAX_REVIEW_LENGTH}
                      className="border-border h-50 scrollbar-none break-all"
                    />
                    {fieldState.error?.message && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="hasSpoiler"
                control={control}
                render={({ field }) => (
                  <Field orientation="horizontal" className="w-fit items-center">
                    <FieldLabel onClick={() => field.onChange(!field.value)}>
                      Contains spoilers
                    </FieldLabel>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </Field>
                )}
              />
            </div>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Visibility</FieldLabel>
                  <Tabs value={field.value} onValueChange={field.onChange}>
                    <TabsList className="h-11 w-full">
                      <TabsIndicator />
                      {VISIBILITY_OPTIONS.map((option) => {
                        const Icon = option.icon

                        return (
                          <TabsTab key={option.value} value={option.value}>
                            <Icon className="size-3.5" />
                            <span className="truncate">{option.label}</span>
                          </TabsTab>
                        )
                      })}
                    </TabsList>
                  </Tabs>
                </Field>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Save rating
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
