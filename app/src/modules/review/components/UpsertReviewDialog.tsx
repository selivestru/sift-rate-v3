import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'
import { Star, Trash6, XCircle } from 'reicon-react'

import { MEDIA_TYPES } from '~/common/constants/media-type'
import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useDisclosure } from '~/common/hooks/useDisclosure'
import { useAppLocale } from '~/common/i18n'
import { CONTENT_MAX_LENGTH } from '~/common/schema/content.schema'
import type { MediaRef } from '~/common/types/media-ref.types'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Dialog, DialogContent, DialogFooter } from '~/common/ui/Dialog'
import { Field, FieldError, FieldLabel } from '~/common/ui/Field'
import { Textarea } from '~/common/ui/Textarea'
import { cn } from '~/common/utils/cn'
import { useAuthStore } from '~/modules/auth'
import { discoverDetailApi } from '~/modules/discover/detail/shared/api/discover-detail.api'
import { tvShowDetailApi } from '~/modules/discover/detail/tv_show/api/tv-show-detail.api'

import { useUpsertReviewForm } from '../hooks/useUpsertReviewForm'
import type { Review } from '../types/review.types'
import { DeleteReviewDialog } from './DeleteReviewDialog'

interface UpsertReviewDialogProps {
  initialData?: Review | null
  media: MediaRef
  lockedSeasonNumber?: number
  children: ({ open }: { open: () => void }) => React.ReactNode
}

const chipClassName = (active: boolean) =>
  cn(
    'focus-visible:ring-ring/40 flex cursor-pointer items-center gap-1 rounded-full border px-3.5 py-1.5 text-sm font-medium tabular-nums transition-colors duration-200 outline-none focus-visible:ring-2',
    active
      ? 'border-border bg-secondary text-rating'
      : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
  )

export const UpsertReviewDialog = ({
  initialData,
  media,
  lockedSeasonNumber,
  children,
}: UpsertReviewDialogProps) => {
  const content = useIntlayer('upsert-review-dialog')
  const shared = useIntlayer('shared')
  const { locale } = useAppLocale()
  const { opened, open, close } = useDisclosure()

  const isTvShow = media.mediaType === MEDIA_TYPES.TV_SHOW
  const isSeasonSelectable = isTvShow && lockedSeasonNumber == null

  const [seasonNumber, setSeasonNumber] = useState<number | null>(
    lockedSeasonNumber ?? initialData?.seasonNumber ?? null,
  )

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const { data: state } = useQuery({
    queryKey: QUERIES_KEYS.mediaState(media),
    queryFn: () => discoverDetailApi.getMediaState(media.mediaType, media.externalId),
    enabled: isTvShow && isAuthenticated && opened,
  })

  const { data: tvDetail } = useQuery({
    queryKey: ['discover', 'detail', 'tv_show', locale, media.externalId],
    queryFn: () => tvShowDetailApi.getTvShow(media.externalId),
    enabled: isSeasonSelectable && opened,
  })

  const seasons = useMemo(
    () => tvDetail?.seasons.filter((season) => season.seasonNumber > 0) ?? [],
    [tvDetail],
  )

  const showReview = useMemo(() => {
    if (initialData && initialData.seasonNumber == null) return initialData
    return state?.review ?? null
  }, [initialData, state])

  const seasonReviews = state?.seasonReviews ?? []

  const activeReview = useMemo(() => {
    if (seasonNumber == null) return showReview

    return (
      seasonReviews.find((review) => review.seasonNumber === seasonNumber) ??
      (initialData?.seasonNumber === seasonNumber ? initialData : null)
    )
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonNumber, showReview, seasonReviews, initialData])

  const { onSubmit, control, reset, isLoading, serverError } = useUpsertReviewForm(
    media,
    activeReview,
    seasonNumber,
    () => {
      close()
      setTimeout(reset, 200)
    },
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

            {isSeasonSelectable && seasons.length > 0 && (
              <Field>
                <FieldLabel>{content.rateTarget.value}</FieldLabel>
                <div
                  role="group"
                  aria-label={content.rateTarget.value}
                  className="flex flex-wrap gap-1.5"
                >
                  <button
                    type="button"
                    onClick={() => setSeasonNumber(null)}
                    className={chipClassName(seasonNumber == null)}
                    aria-pressed={seasonNumber == null}
                  >
                    {showReview && (
                      <Star weight="Filled" className="text-rating size-3.5" aria-hidden />
                    )}
                    {content.wholeShow.value}
                  </button>
                  {seasons.map((season) => {
                    const isActive = seasonNumber === season.seasonNumber
                    const seasonReview = seasonReviews.find(
                      (review) => review.seasonNumber === season.seasonNumber,
                    )

                    return (
                      <button
                        key={season.seasonNumber}
                        type="button"
                        onClick={() => setSeasonNumber(season.seasonNumber)}
                        className={chipClassName(isActive)}
                        aria-pressed={isActive}
                      >
                        {seasonReview && (
                          <Star weight="Filled" className="text-rating size-3.5" aria-hidden />
                        )}
                        {`S${season.seasonNumber}`}
                      </button>
                    )
                  })}
                </div>
              </Field>
            )}

            {lockedSeasonNumber != null && (
              <div className="flex items-center gap-2">
                <span className={cn(chipClassName(true), 'cursor-default')} aria-hidden>
                  {`S${lockedSeasonNumber}`}
                </span>
              </div>
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
            <DialogFooter className="justify-between">
              {activeReview ? (
                <DeleteReviewDialog
                  reviewId={activeReview.id}
                  rating={activeReview.rating}
                  mediaType={media.mediaType}
                  seasonNumber={activeReview.seasonNumber}
                >
                  {({ open: openDelete }) => (
                    <Button
                      type="button"
                      variant="destructive-soft"
                      startIcon={<Trash6 weight="Filled" />}
                      onClick={openDelete}
                      className="mr-auto"
                      aria-label={content.deleteReview.value}
                    >
                      {shared.delete.value}
                    </Button>
                  )}
                </DeleteReviewDialog>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  {shared.cancel.value}
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {content.saveRating.value}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
