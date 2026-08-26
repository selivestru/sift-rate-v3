import { useIntlayer } from 'react-intlayer'
import { AlertTriangle, CheckCircle, Clock, Refresh, Upload } from 'reicon-react'

import { getCurrentLocale } from '~/common/i18n'
import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Badge } from '~/common/ui/Badge'
import { Button } from '~/common/ui/Button'
import { Spinner } from '~/common/ui/Spinner'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'

import type { ImportJobResponse, ImportJobStatus } from '../types/import.types'
import { ImdbImportRows } from './ImdbImportRows'

type ImdbImportJobStatusProps = {
  job: ImportJobResponse
  isRetrying: boolean
  onRetry: () => void
  onNewImport: () => void
}

const getProgress = (job: ImportJobResponse) => {
  if (job.total <= 0) return 0
  return Math.min(100, Math.round((job.processed / job.total) * 100))
}

const canRetry = (job: ImportJobResponse) => {
  return (
    job.status === 'FAILED' ||
    (job.status === 'COMPLETED' && job.notFound + job.errorCount + job.skippedType > 0)
  )
}

const isTerminalStatus = (status: ImportJobStatus) => {
  return status === 'COMPLETED' || status === 'FAILED'
}

export const ImdbImportJobStatus = ({
  job,
  isRetrying,
  onRetry,
  onNewImport,
}: ImdbImportJobStatusProps) => {
  const content = useIntlayer('imdb-import-job-status')
  const progress = getProgress(job)
  const isActive = job.status === 'PENDING' || job.status === 'PROCESSING'
  const isTerminal = isTerminalStatus(job.status)

  const statusMeta: Record<ImportJobStatus, { badge: React.ReactNode; description: string }> = {
    PENDING: {
      badge: (
        <Badge variant="default" startIcon={<Clock aria-hidden />}>
          {content.queued.value}
        </Badge>
      ),
      description: content.queuedDescription.value,
    },
    PROCESSING: {
      badge: (
        <Badge variant="default" startIcon={<Spinner className="size-3.5" aria-hidden />}>
          {content.processing.value}
        </Badge>
      ),
      description: content.processingDescription.value,
    },
    COMPLETED: {
      badge: (
        <Badge variant="default" startIcon={<CheckCircle className="text-success" aria-hidden />}>
          {content.completed.value}
        </Badge>
      ),
      description: content.completedDescription.value,
    },
    FAILED: {
      badge: (
        <Badge variant="destructive" startIcon={<AlertTriangle aria-hidden />}>
          {content.failed.value}
        </Badge>
      ),
      description: content.failedDescription.value,
    },
  }

  const meta = statusMeta[job.status]
  const counts: Array<{ label: string; value: number }> = [
    { label: content.imported.value, value: job.created },
    { label: content.alreadyInLibrary.value, value: job.skippedExisting },
    { label: content.unsupportedType.value, value: job.skippedType },
    { label: content.notFound.value, value: job.notFound },
    { label: content.invalidRows.value, value: job.invalid },
    { label: content.errors.value, value: job.errorCount },
  ]

  return (
    <div className="border-border bg-card flex flex-col gap-5 rounded-xl border px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {meta.badge}
          <span className="text-muted-foreground text-xs">
            {content.started({ time: formatRelativeTime(job.createdAt) }).value}
            {job.finishedAt && (
              <> · {content.finished({ time: formatRelativeTime(job.finishedAt) }).value}</>
            )}
          </span>
        </div>
        {isTerminal && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            startIcon={<Upload aria-hidden />}
            onClick={onNewImport}
          >
            {content.importAnotherFile.value}
          </Button>
        )}
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">{meta.description}</p>

      <div className="flex flex-col gap-2" aria-live="polite">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium">
            {isActive ? content.progress.value : content.processed.value}
          </p>
          <p className="text-muted-foreground text-sm tabular-nums">
            {
              (job.total > 0
                ? content.processedCountWithPercent({
                    processed: job.processed.toLocaleString(getCurrentLocale()),
                    total: job.total.toLocaleString(getCurrentLocale()),
                    progress,
                  })
                : content.processedCount({
                    processed: job.processed.toLocaleString(getCurrentLocale()),
                    total: job.total.toLocaleString(getCurrentLocale()),
                  })
              ).value
            }
          </p>
        </div>
        <div
          role="progressbar"
          aria-label={content.progressAriaLabel.value}
          aria-valuemin={0}
          aria-valuemax={Math.max(job.total, 1)}
          aria-valuenow={job.processed}
          className="bg-muted h-2 overflow-hidden rounded-full"
        >
          <div
            className={cn(
              'bg-primary h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none',
              job.status === 'FAILED' && 'bg-destructive',
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {counts.map((count) => (
          <div
            key={count.label}
            className="border-border bg-background flex flex-col gap-0.5 rounded-lg border px-3 py-2.5"
          >
            <dd className="text-lg font-semibold tabular-nums">
              {count.value.toLocaleString(getCurrentLocale())}
            </dd>
            <dt className="text-muted-foreground text-xs">{count.label}</dt>
          </div>
        ))}
      </dl>

      {job.status === 'FAILED' && job.errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>{content.whyStopped.value}</AlertTitle>
          <AlertDescription>{job.errorMessage}</AlertDescription>
        </Alert>
      )}

      <ImdbImportRows key={job.id} job={job} />

      {canRetry(job) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs leading-relaxed">
            {content.retryDescription.value}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            startIcon={<Refresh aria-hidden />}
            isLoading={isRetrying}
            onClick={onRetry}
          >
            {content.retryUnfinishedRows.value}
          </Button>
        </div>
      )}
    </div>
  )
}
