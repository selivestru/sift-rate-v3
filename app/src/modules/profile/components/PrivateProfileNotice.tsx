import { Lock } from 'reicon-react'

import { EmptyState } from '~/common/ui/EmptyState'

export const PrivateProfileNotice = () => {
  return (
    <EmptyState
      icon={Lock}
      title="This profile is private"
      description="Subscribe to this user to see their posts"
    />
  )
}
