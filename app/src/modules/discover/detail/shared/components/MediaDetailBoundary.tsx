import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface MediaDetailBoundaryProps {
  fallback: React.ReactNode
  notFound: React.ReactNode
  renderError: (onRetry: () => void) => React.ReactNode
  children: React.ReactNode
}

export const MediaDetailBoundary = ({
  fallback,
  notFound,
  renderError,
  children,
}: MediaDetailBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) =>
        error instanceof HTTPError && error.response.status === 404
          ? notFound
          : renderError(resetErrorBoundary)
      }
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}
