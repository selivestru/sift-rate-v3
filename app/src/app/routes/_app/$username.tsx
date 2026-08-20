import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { ProfileError, ProfilePage, ProfileSkeleton } from '~/modules/profile'

export const Route = createFileRoute('/_app/$username')({
  component: RouteComponent,
})

function RouteComponent() {
  const { username } = Route.useParams()

  return (
    <ErrorBoundary fallback={<ProfileError />}>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfilePage key={username} username={username} />
      </Suspense>
    </ErrorBoundary>
  )
}
