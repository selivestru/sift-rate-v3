import { createFileRoute } from '@tanstack/react-router'

import { QUERIES_KEYS } from '~/common/constants/queries-keys'
import { mockProfile, ProfileError, ProfilePage, ProfileSkeleton } from '~/modules/profile'

export const Route = createFileRoute('/_app/$username')({
  loader: async ({ context, params }) => {
    const { username } = params
    const { queryClient } = context
    return queryClient.ensureQueryData({
      queryKey: QUERIES_KEYS.PROFILE(username),
      queryFn: () => Promise.resolve(mockProfile),
      // queryKey: QUERIES_KEYS.PROFILE(params.username),
      // queryFn: () => profileApi.getProfile(params.username),
    })
  },
  pendingComponent: ProfileSkeleton,
  errorComponent: ProfileError,
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  return <ProfilePage data={data} />
}
