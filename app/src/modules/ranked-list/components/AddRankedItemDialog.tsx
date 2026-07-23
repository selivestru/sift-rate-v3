import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Search, Star } from 'reicon-react'

import { toastApiError } from '~/common/api'
import { MEDIA_TYPES } from '~/common/constants/media-type'
import { useDebouncedValue } from '~/common/hooks/useDebouncedValue'
import { useDisclosure } from '~/common/hooks/useDisclosure'
import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { Button } from '~/common/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/common/ui/Dialog'
import { Input } from '~/common/ui/Input'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { useMyReviewsQuery } from '~/modules/review/hooks/useMyReviewsQuery'

import { useAddRankedItem } from '../hooks/useAddRankedItem'
import type { RankedListItem } from '../types/ranked-list.types'

interface AddRankedItemDialogProps {
  list: RankedListItem
  children: ({ open }: { open: () => void }) => React.ReactNode
}

export const AddRankedItemDialog = ({ list, children }: AddRankedItemDialogProps) => {
  const { opened, open, close } = useDisclosure()
  const [query, setQuery] = useState('')
  const debouncedQ = useDebouncedValue(query, 300)
  const [pendingMediaId, setPendingMediaId] = useState<string | null>(null)

  const reviewsQuery = useMyReviewsQuery({
    q: debouncedQ,
    enabled: opened,
  })
  const addMutation = useAddRankedItem()

  const existingMediaIds = new Set(list.items.map((item) => item.mediaId))

  const reviews = (reviewsQuery.data?.pages ?? []).flatMap((page) => page.data)

  const candidates = reviews.filter((review) => !existingMediaIds.has(review.media.id))

  const loadMoreRef = useIntersectionObserver(
    () => {
      void reviewsQuery.fetchNextPage()
    },
    opened && !!reviewsQuery.hasNextPage && !reviewsQuery.isFetchingNextPage,
  )

  const handleClose = () => {
    close()
    setQuery('')
    setPendingMediaId(null)
  }

  const handleAdd = async (review: (typeof candidates)[number]) => {
    setPendingMediaId(review.media.id)

    try {
      await addMutation.mutateAsync({
        listId: list.id,
        mediaId: review.media.id,
        media: {
          id: review.media.id,
          externalId: review.media.externalId,
          mediaType: review.media.mediaType,
          title: review.media.title,
          posterUrl: review.media.posterUrl,
        },
      })
    } catch (error) {
      await toastApiError(error)
    } finally {
      setPendingMediaId(null)
    }
  }

  const isInitialLoading =
    reviewsQuery.isPending ||
    (reviewsQuery.isFetching && !reviewsQuery.isFetchingNextPage && !reviewsQuery.data)
  const isSearchLoading =
    reviewsQuery.isFetching && !reviewsQuery.isFetchingNextPage && !!reviewsQuery.data
  const showListLoader =
    isInitialLoading || (isSearchLoading && candidates.length === 0 && reviews.length === 0)

  return (
    <>
      {children({ open })}
      <Dialog open={opened} onOpenChange={handleClose}>
        <DialogContent
          showCloseButton
          className="flex h-[min(52rem,92dvh)] max-h-[min(52rem,92dvh)] flex-col gap-4 sm:max-w-xl"
        >
          <DialogHeader>
            <DialogTitle>Add to “{list.title}”</DialogTitle>
            <DialogDescription>
              Only media you have already rated can join a ranked list.
            </DialogDescription>
          </DialogHeader>

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your reviews"
            startIcon={<Search />}
            aria-label="Search reviews"
          />

          <div className="flex min-h-0 flex-1 scrollbar-none flex-col gap-2 overflow-y-auto p-1">
            {showListLoader && (
              <div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 py-10 text-sm">
                <Spinner className="size-5" />
                Loading reviews…
              </div>
            )}

            {reviewsQuery.isError && (
              <p role="alert" className="text-destructive py-8 text-center text-sm">
                Couldn&apos;t load reviews.
              </p>
            )}

            {!showListLoader && !reviewsQuery.isError && candidates.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-2 py-10 text-center">
                <p className="text-foreground text-sm font-medium">
                  {reviews.length === 0
                    ? debouncedQ.trim()
                      ? 'No matches'
                      : 'No rated media yet'
                    : 'Everything here is already on the list'}
                </p>
                <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
                  {reviews.length === 0
                    ? debouncedQ.trim()
                      ? 'Try another search.'
                      : 'Rate something first, then come back to place it on the podium.'
                    : 'Pick a different title or open Discover to rate more media.'}
                </p>
                {reviews.length === 0 && !debouncedQ.trim() && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    render={<Link to="/discover" />}
                  >
                    Browse Discover
                  </Button>
                )}
              </div>
            )}

            {!showListLoader &&
              candidates.map((review) => {
                const isPending = pendingMediaId === review.media.id
                const isMusic =
                  review.media.mediaType === MEDIA_TYPES.TRACK ||
                  review.media.mediaType === MEDIA_TYPES.ALBUM

                return (
                  <button
                    key={review.id}
                    type="button"
                    disabled={addMutation.isPending}
                    onClick={() => handleAdd(review)}
                    className={cn(
                      'group/row border-border bg-card hover:bg-accent focus-visible:ring-ring/40 flex w-full items-center gap-3.5 rounded-xl border p-2.5 text-left transition-colors duration-200 outline-none focus-visible:ring-2',
                      isPending && 'pointer-events-none opacity-60',
                    )}
                  >
                    <div
                      className={cn(
                        'bg-muted border-border relative shrink-0 overflow-hidden rounded-lg border',
                        isMusic ? 'size-20' : 'aspect-2/3 w-20',
                      )}
                    >
                      {review.media.posterUrl ? (
                        <img
                          src={review.media.posterUrl}
                          alt={review.media.title}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="text-foreground line-clamp-2 text-base font-semibold tracking-tight">
                        {review.media.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <MediaTypeBadge mediaType={review.media.mediaType} size="sm" />
                        <span className="text-rating inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
                          <Star weight="Filled" className="text-rating size-4" />
                          {review.rating}/10
                        </span>
                      </div>
                    </div>

                    <span className="bg-muted text-muted-foreground group-hover/row:bg-background flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200">
                      <Plus className="size-4" />
                    </span>
                  </button>
                )
              })}

            {isSearchLoading && candidates.length > 0 && (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-3 text-xs">
                <Spinner className="size-4" />
                Searching…
              </div>
            )}

            <div
              ref={loadMoreRef}
              className={cn(reviewsQuery.isFetchingNextPage && 'py-4 text-center')}
            >
              {reviewsQuery.isFetchingNextPage && <Spinner className="inline-flex size-8" />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
