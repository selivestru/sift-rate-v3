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
  title = 'Something went wrong',
  description = 'Please try again later.',
  onRetry,
  retryLabel = 'Retry',
  action,
  className,
  border,
}: ErrorStateProps) => {
  return (
    <div
      role="alert"
      className={cn(
        'bg-card border-transparent flex flex-col items-center gap-4 rounded-xl border px-4 py-14 text-center',
        className,
        border && 'border-border',
      )}
    >
      <span className="bg-destructive/10 text-destructive flex size-11 items-center justify-center rounded-lg">
        <XCircle className="size-5" aria-hidden />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-foreground font-semibold tracking-tight">{title}</p>
        {description && (
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {(onRetry || action) && (
        <div className="flex flex-col items-center gap-2">
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}
