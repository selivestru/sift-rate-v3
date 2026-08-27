import { AlertTriangle } from 'reicon-react'

import { Button } from './Button'

interface RouteErrorProps {
  error: unknown
  reset?: () => void
}

export const RouteError = ({ error, reset }: RouteErrorProps) => {
  const message =
    error instanceof Error && error.message
      ? error.message
      : 'Something went wrong while loading this page.'

  return (
    <div role="alert" className="flex min-h-[40vh] items-center justify-center px-4 py-10">
      <div className="bg-card border-border flex w-full max-w-lg flex-col items-center gap-4 rounded-xl border px-6 py-10 text-center">
        <span className="bg-muted text-destructive flex size-11 items-center justify-center rounded-lg">
          <AlertTriangle className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="text-foreground font-semibold tracking-tight">Failed to load</p>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">{message}</p>
        </div>
        {reset && (
          <Button variant="secondary" onClick={reset}>
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
