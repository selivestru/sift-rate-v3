import { useIntlayer } from 'react-intlayer'
import { XCircle } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  action?: React.ReactNode
  className?: string
  border?: boolean
}

export const ErrorState = ({
  title,
  description,
  onRetry,
  retryLabel,
  action,
  className,
  border,
}: ErrorStateProps) => {
  const shared = useIntlayer('shared')
  const resolvedTitle = title ?? shared.somethingWentWrong.value
  const resolvedDescription = description ?? shared.tryAgainLater.value
  const resolvedRetryLabel = retryLabel ?? shared.retry.value
  return (
    <div
      role="alert"
      className={cn(
        'bg-card border-transparent flex flex-col items-center gap-4 border px-4 py-14 text-center',
        className,
        border && 'border-border rounded-xl',
      )}
    >
      <span className="bg-muted text-destructive flex size-11 items-center justify-center rounded-lg">
        <XCircle className="size-5" aria-hidden />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-foreground font-semibold tracking-tight">{resolvedTitle}</p>
        {resolvedDescription && (
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            {resolvedDescription}
          </p>
        )}
      </div>
      {(onRetry || action) && (
        <div className="flex flex-col items-center gap-2">
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              {resolvedRetryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}
