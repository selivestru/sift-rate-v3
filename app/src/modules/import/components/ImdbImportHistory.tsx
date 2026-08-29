import { useIntlayer } from 'react-intlayer'
import { AlertTriangle, CheckCircle, ChevronRight } from 'reicon-react'

import { useIntersectionObserver } from '~/common/hooks/useIntersectionObserver'
import { getCurrentLocale, useAppLocale } from '~/common/i18n'
import { Badge, type BadgeProps } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { SettingsSection } from '~/modules/settings'

import { useGetImdbImportHistoryQuery } from '../hooks/useGetImdbImportHistoryQuery'
import type { ImportJobStatus, ImportJobSummary } from '../types/import.types'

type ImdbImportHistoryProps = {
  selectedJobId: string | null
  onSelect: (id: string) => void
}

export const ImdbImportHistory = ({ selectedJobId, onSelect }: ImdbImportHistoryProps) => {
  const { locale } = useAppLocale()
  const content = useIntlayer('imdb-import-history')
  const shared = useIntlayer('shared')
  const statusContent = useIntlayer('imdb-import-job-status')
  const historyQuery = useGetImdbImportHistoryQuery()
  const { data, isPending, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = historyQuery

  const historyStatusBadge: Record<
    ImportJobStatus,
    { variant: BadgeProps['variant']; label: string; startIcon?: React.ReactNode }
  > = {
    PENDING: { variant: 'outline', label: statusContent.queued.value },
    PROCESSING: { variant: 'default', label: statusContent.processing.value },
    COMPLETED: {
      variant: 'default',
      label: statusContent.completed.value,
      startIcon: <CheckCircle className="text-success" aria-hidden />,
    },
    FAILED: {
      variant: 'destructive',
      label: statusContent.failed.value,
      startIcon: <AlertTriangle aria-hidden />,
    },
  }

  const jobs = data?.pages.flatMap((page) => page.data) ?? []

  const loadMoreRef = useIntersectionObserver(
    () => void fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  )

  const getJobSummary = (job: ImportJobSummary) => {
    const parts: string[] = []
    const formatCount = (count: number) => count.toLocaleString(getCurrentLocale())

    if (job.created > 0) parts.push(content.imported({ count: formatCount(job.created) }).value)
    if (job.skippedExisting > 0) {
      parts.push(content.alreadyInLibrary({ count: formatCount(job.skippedExisting) }).value)
    }
    if (job.skippedType > 0) {
      parts.push(content.unsupported({ count: formatCount(job.skippedType) }).value)
    }
    if (job.notFound > 0) parts.push(content.notFound({ count: formatCount(job.notFound) }).value)
    if (job.invalid > 0) parts.push(content.invalid({ count: formatCount(job.invalid) }).value)
    if (job.errorCount > 0) parts.push(content.errors({ count: formatCount(job.errorCount) }).value)

    if (parts.length === 0) {
      return job.total > 0 ? content.rows(job.total).value : content.noRows.value
    }

    return parts.join(' · ')
  }

  return (
    <SettingsSection title={content.title.value} description={content.description.value}>
      {isPending && (
        <div className="flex flex-col gap-2">
          {['job-1', 'job-2', 'job-3'].map((key) => (
            <Skeleton key={key} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="border-border bg-background flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3">
          <p className="text-muted-foreground text-xs leading-relaxed">{content.loadError.value}</p>
          <Button variant="outline" size="xs" onClick={() => void historyQuery.refetch()}>
            {shared.retry.value}
          </Button>
        </div>
      )}

      {!isPending && !isError && jobs.length === 0 && (
        <p className="text-muted-foreground text-sm leading-relaxed">{content.noImports.value}</p>
      )}

      {jobs.length > 0 && (
        <ul className="flex flex-col gap-2">
          {jobs.map((job) => {
            const badge = historyStatusBadge[job.status]
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
                      ? 'border-border bg-accent'
                      : 'border-border bg-background hover:bg-accent',
                  )}
                >
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className="flex flex-wrap items-center gap-2">
                      <Badge variant={badge.variant} size="sm" startIcon={badge.startIcon}>
                        {badge.label}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(job.createdAt, locale)}
                      </span>
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {getJobSummary(job)}
                    </span>
                  </span>
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {
                      content.processedOfTotal({
                        processed: job.processed.toLocaleString(getCurrentLocale()),
                        total: job.total.toLocaleString(getCurrentLocale()),
                      }).value
                    }
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
          <Spinner
            className="text-muted-foreground size-5"
            aria-label={content.loadingMoreImports.value}
          />
        )}
      </div>
    </SettingsSection>
  )
}
