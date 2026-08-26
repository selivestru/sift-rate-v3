import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { Badge, type BadgeProps } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'
import { Spinner } from '~/common/ui/Spinner'
import { Tabs, TabsIndicator, TabsList, TabsTab } from '~/common/ui/Tabs'
import { cn } from '~/common/utils/cn'

import { useGetImdbImportRowsQuery } from '../hooks/useGetImdbImportRowsQuery'
import type { ImportJobResponse, ImportJobSummary, ImportRowStatus } from '../types/import.types'

type RowFilterValue = ImportRowStatus | 'all'

const ROW_FILTERS: Array<{
  label: string
  value: RowFilterValue
  count: (job: ImportJobSummary) => number
}> = [
  { label: 'All', value: 'all', count: (job) => job.total },
  { label: 'Imported', value: 'CREATED', count: (job) => job.created },
  { label: 'Already existed', value: 'SKIPPED_EXISTING', count: (job) => job.skippedExisting },
  { label: 'Unsupported', value: 'SKIPPED_TYPE', count: (job) => job.skippedType },
  { label: 'Not found', value: 'NOT_FOUND', count: (job) => job.notFound },
  { label: 'Invalid', value: 'INVALID', count: (job) => job.invalid },
  { label: 'Errors', value: 'ERROR', count: (job) => job.errorCount },
]

const ROW_BADGE: Record<ImportRowStatus, { variant: BadgeProps['variant']; label: string }> = {
  PENDING: { variant: 'outline', label: 'Queued' },
  CREATED: { variant: 'default', label: 'Imported' },
  SKIPPED_EXISTING: { variant: 'default', label: 'Already existed' },
  SKIPPED_TYPE: { variant: 'default', label: 'Unsupported' },
  NOT_FOUND: { variant: 'warning', label: 'Not found' },
  INVALID: { variant: 'default', label: 'Invalid' },
  ERROR: { variant: 'destructive', label: 'Error' },
}

type ImdbImportRowsProps = {
  job: ImportJobResponse
}

export const ImdbImportRows = ({ job }: ImdbImportRowsProps) => {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<RowFilterValue>('all')

  const rowsQuery = useGetImdbImportRowsQuery(
    job.id,
    statusFilter === 'all' ? undefined : statusFilter,
  )
  const { data, isPending, isError, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    rowsQuery

  const rows = data?.pages.flatMap((page) => page.data) ?? []

  const loadMoreRef = useIntersectionObserver(
    () => void fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  const lastStatusRef = useRef(job.status)

  useEffect(() => {
    if (lastStatusRef.current === job.status) return
    lastStatusRef.current = job.status

    if (job.status === 'COMPLETED' || job.status === 'FAILED') {
      queryClient.invalidateQueries({ queryKey: QUERIES_KEYS.imdbImportRows(job.id) })
    }
  }, [job.status, job.id, queryClient])

  const handleFilterChange = (value: string | number | null) => {
    if (typeof value === 'string') {
      setStatusFilter(value as RowFilterValue)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">Row results</h3>
        {isFetching && !isFetchingNextPage && !isPending && (
          <Spinner className="text-muted-foreground size-4" aria-label="Updating rows" />
        )}
      </div>

      <Tabs value={statusFilter} onValueChange={handleFilterChange} className="gap-0">
        <TabsList className="h-auto max-w-full scrollbar-none overflow-x-auto p-0.5">
          <TabsIndicator className="h-7" />
          {ROW_FILTERS.map((filter) => (
            <TabsTab key={filter.value} value={filter.value} className="h-7 flex-none px-2 text-xs">
              {filter.label}
              <span className="text-muted-foreground tabular-nums">
                {filter.count(job).toLocaleString('en-US')}
              </span>
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>

      {isPending && (
        <div className="border-border bg-background divide-border divide-y rounded-xl border">
          {['row-1', 'row-2', 'row-3', 'row-4', 'row-5'].map((key) => (
            <div key={key} className="flex items-center justify-between gap-3 px-3.5 py-3">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="border-border bg-background flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3">
          <p className="text-muted-foreground text-xs leading-relaxed">
            Could not load the rows for this import.
          </p>
          <Button variant="outline" size="xs" onClick={() => void rowsQuery.refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isPending && !isError && rows.length === 0 && (
        <p className="text-muted-foreground border-border bg-background rounded-xl border border-dashed px-3.5 py-6 text-center text-xs leading-relaxed">
          {statusFilter === 'all'
            ? 'No rows in this import yet.'
            : 'No rows with this status in this import.'}
        </p>
      )}

      {rows.length > 0 && (
        <div className="border-border bg-background max-h-96 overflow-y-auto rounded-xl border">
          <ul className="divide-border divide-y">
            {rows.map((row) => {
              const badge = ROW_BADGE[row.status]
              return (
                <li key={row.id} className="flex flex-col gap-1.5 px-3.5 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-sm font-medium">{row.title || row.imdbId}</p>
                      <p className="text-muted-foreground truncate text-xs tabular-nums">
                        #{(row.position + 1).toLocaleString('en-US')} · {row.imdbId}
                        {row.titleType && ` · ${row.titleType}`}
                        {row.rating != null && ` · Rated ${row.rating}/10`}
                      </p>
                    </div>
                    <Badge variant={badge.variant} size="sm" className="mt-0.5">
                      {badge.label}
                    </Badge>
                  </div>
                  {row.error && (
                    <p className="text-muted-foreground text-xs leading-relaxed">{row.error}</p>
                  )}
                </li>
              )
            })}
          </ul>
          <div ref={loadMoreRef} className={cn(isFetchingNextPage && 'flex justify-center py-3')}>
            {isFetchingNextPage && (
              <Spinner className="text-muted-foreground size-5" aria-label="Loading more rows" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
