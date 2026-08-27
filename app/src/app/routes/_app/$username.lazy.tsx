import { createLazyFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ProfileError, ProfilePage, ProfileSkeleton } from '~/modules/profile'

export const Route = createLazyFileRoute('/_app/$username')({
  component: RouteComponent,
})

const renderProfileError = ({ error }: { error: unknown }) => <ProfileError error={error} />

function RouteComponent() {
  const { username } = Route.useParams()

  return (
    <ErrorBoundary fallbackRender={renderProfileError}>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfilePage key={username} username={username} />
      </Suspense>
    </ErrorBoundary>
  )
}
