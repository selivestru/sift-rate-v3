import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useIntlayer } from 'react-intlayer'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { getCurrentLocale } from '~/common/i18n'
import { Badge, type BadgeProps } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'
import { Spinner } from '~/common/ui/Spinner'
import { Tabs, TabsIndicator, TabsList, TabsTab } from '~/common/ui/Tabs'
import { cn } from '~/common/utils/cn'

import { useGetImdbImportRowsQuery } from '../hooks/useGetImdbImportRowsQuery'
import type { ImportJobResponse, ImportJobSummary, ImportRowStatus } from '../types/import.types'

type RowFilterValue = ImportRowStatus | 'all'

type ImdbImportRowsProps = {
  job: ImportJobResponse
}

export const ImdbImportRows = ({ job }: ImdbImportRowsProps) => {
  const content = useIntlayer('imdb-import-rows')
  const shared = useIntlayer('shared')
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<RowFilterValue>('all')

  const rowFilters: Array<{
    label: string
    value: RowFilterValue
    count: (summary: ImportJobSummary) => number
  }> = [
    { label: shared.all.value, value: 'all', count: (summary) => summary.total },
    { label: content.imported.value, value: 'CREATED', count: (summary) => summary.created },
    {
      label: content.alreadyExisted.value,
      value: 'SKIPPED_EXISTING',
      count: (summary) => summary.skippedExisting,
    },
    {
      label: content.unsupported.value,
      value: 'SKIPPED_TYPE',
      count: (summary) => summary.skippedType,
    },
    { label: content.notFound.value, value: 'NOT_FOUND', count: (summary) => summary.notFound },
    { label: content.invalid.value, value: 'INVALID', count: (summary) => summary.invalid },
    { label: content.errors.value, value: 'ERROR', count: (summary) => summary.errorCount },
  ]

  const rowBadge: Record<ImportRowStatus, { variant: BadgeProps['variant']; label: string }> = {
    PENDING: { variant: 'outline', label: content.queued.value },
    CREATED: { variant: 'default', label: content.imported.value },
    SKIPPED_EXISTING: { variant: 'default', label: content.alreadyExisted.value },
    SKIPPED_TYPE: { variant: 'default', label: content.unsupported.value },
    NOT_FOUND: { variant: 'warning', label: content.notFound.value },
    INVALID: { variant: 'default', label: content.invalid.value },
    ERROR: { variant: 'destructive', label: content.error.value },
  }

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
        <h3 className="text-sm font-medium">{content.rowResults.value}</h3>
        {isFetching && !isFetchingNextPage && !isPending && (
          <Spinner
            className="text-muted-foreground size-4"
            aria-label={content.updatingRows.value}
          />
        )}
      </div>

      <Tabs value={statusFilter} onValueChange={handleFilterChange} className="gap-0">
        <TabsList className="h-auto max-w-full scrollbar-none overflow-x-auto p-0.5">
          <TabsIndicator className="h-7" />
          {rowFilters.map((filter) => (
            <TabsTab key={filter.value} value={filter.value} className="h-7 flex-none px-2 text-xs">
              {filter.label}
              <span className="text-muted-foreground tabular-nums">
                {filter.count(job).toLocaleString(getCurrentLocale())}
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
          <p className="text-muted-foreground text-xs leading-relaxed">{content.loadError.value}</p>
          <Button variant="outline" size="xs" onClick={() => void rowsQuery.refetch()}>
            {shared.retry.value}
          </Button>
        </div>
      )}

      {!isPending && !isError && rows.length === 0 && (
        <p className="text-muted-foreground border-border bg-background rounded-xl border border-dashed px-3.5 py-6 text-center text-xs leading-relaxed">
          {statusFilter === 'all' ? content.noRows.value : content.noRowsWithStatus.value}
        </p>
      )}

      {rows.length > 0 && (
        <div className="border-border bg-background max-h-96 overflow-y-auto rounded-xl border">
          <ul className="divide-border divide-y">
            {rows.map((row) => {
              const badge = rowBadge[row.status]
              return (
                <li key={row.id} className="flex flex-col gap-1.5 px-3.5 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-sm font-medium">{row.title || row.imdbId}</p>
                      <p className="text-muted-foreground truncate text-xs tabular-nums">
                        #{(row.position + 1).toLocaleString(getCurrentLocale())} · {row.imdbId}
                        {row.titleType && ` · ${row.titleType}`}
                        {row.rating != null && (
                          <>
                            {' '}
                            · {content.rated.value} {row.rating}/10
                          </>
                        )}
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
              <Spinner
                className="text-muted-foreground size-5"
                aria-label={content.loadingMoreRows.value}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
