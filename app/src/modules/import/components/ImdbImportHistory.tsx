import { AlertTriangle, CheckCircle, ChevronRight } from 'reicon-react'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { Badge, type BadgeProps } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { SettingsSection } from '~/modules/settings'

import { useGetImdbImportHistoryQuery } from '../hooks/useGetImdbImportHistoryQuery'
import type { ImportJobStatus, ImportJobSummary } from '../types/import.types'

const HISTORY_STATUS_BADGE: Record<
  ImportJobStatus,
  { variant: BadgeProps['variant']; label: string; startIcon?: React.ReactNode }
> = {
  PENDING: { variant: 'outline', label: 'Queued' },
  PROCESSING: { variant: 'default', label: 'Processing' },
  COMPLETED: {
    variant: 'default',
    label: 'Completed',
    startIcon: <CheckCircle className="text-success" aria-hidden />,
  },
  FAILED: {
    variant: 'destructive',
    label: 'Failed',
    startIcon: <AlertTriangle aria-hidden />,
  },
}

const getJobSummary = (job: ImportJobSummary) => {
  const parts: string[] = []

  if (job.created > 0) parts.push(`${job.created.toLocaleString('en-US')} imported`)
  if (job.skippedExisting > 0)
    parts.push(`${job.skippedExisting.toLocaleString('en-US')} already in library`)
  if (job.skippedType > 0) parts.push(`${job.skippedType.toLocaleString('en-US')} unsupported`)
  if (job.notFound > 0) parts.push(`${job.notFound.toLocaleString('en-US')} not found`)
  if (job.invalid > 0) parts.push(`${job.invalid.toLocaleString('en-US')} invalid`)
  if (job.errorCount > 0) parts.push(`${job.errorCount.toLocaleString('en-US')} errors`)

  if (parts.length === 0) {
    return job.total > 0 ? `${job.total.toLocaleString('en-US')} rows` : 'No rows'
  }

  return parts.join(' · ')
}

type ImdbImportHistoryProps = {
  selectedJobId: string | null
  onSelect: (id: string) => void
}

export const ImdbImportHistory = ({ selectedJobId, onSelect }: ImdbImportHistoryProps) => {
  const historyQuery = useGetImdbImportHistoryQuery()
  const { data, isPending, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = historyQuery

  const jobs = data?.pages.flatMap((page) => page.data) ?? []

  const loadMoreRef = useIntersectionObserver(
    () => void fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  return (
    <SettingsSection
      title="Import history"
      description="Every IMDb import you have run, newest first. Select one to see its full report above."
    >
      {isPending && (
        <div className="flex flex-col gap-2">
          {['job-1', 'job-2', 'job-3'].map((key) => (
            <Skeleton key={key} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="border-border bg-background flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3">
          <p className="text-muted-foreground text-xs leading-relaxed">
            Could not load your import history.
          </p>
          <Button variant="outline" size="xs" onClick={() => void historyQuery.refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isPending && !isError && jobs.length === 0 && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          No imports yet. Upload your ratings export to get started.
        </p>
      )}

      {jobs.length > 0 && (
        <ul className="flex flex-col gap-2">
          {jobs.map((job) => {
            const badge = HISTORY_STATUS_BADGE[job.status]
            const isSelected = job.id === selectedJobId
            return (
              <li key={job.id}>
                <button
                  type="button"
                  aria-current={isSelected || undefined}
                  onClick={() => onSelect(job.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors duration-200',
                    'focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none',
                    isSelected
                      ? 'border-ring/50 bg-accent'
                      : 'border-border bg-background hover:bg-muted',
                  )}
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex flex-wrap items-center gap-2">
                      <Badge variant={badge.variant} size="sm" startIcon={badge.startIcon}>
                        {badge.label}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(job.createdAt)}
                      </span>
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {getJobSummary(job)}
                    </span>
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {job.processed.toLocaleString('en-US')} of {job.total.toLocaleString('en-US')}
                  </span>
                  <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div ref={loadMoreRef} className={cn(isFetchingNextPage && 'flex justify-center py-2')}>
        {isFetchingNextPage && (
          <Spinner className="text-muted-foreground size-5" aria-label="Loading more imports" />
        )}
      </div>
    </SettingsSection>
  )
}
