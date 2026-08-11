import { useAuthStore } from '~/modules/auth'

import type { FeedItem, ProfileUser } from '../../types/profile.types'
import { ComposerPlaceholder } from './ComposerPlaceholder'
import { FeedCard } from './FeedCard'
import { FeedCardSkeleton } from './FeedCardSkeleton'
import { FeedEmptyState } from './FeedEmptyState'

interface ActivityFeedProps {
  feed: FeedItem[]
  user: ProfileUser
  isLoading?: boolean
}

export const ActivityFeed = ({ feed, user, isLoading = false }: ActivityFeedProps) => {
  const currentUser = useAuthStore((state) => state.user)
  const isOwn = currentUser?.username === user.username

  return (
    <section className="space-y-4">
      <div className="space-y-1 px-4">
        <h2 className="text-lg font-semibold tracking-tight">Activity</h2>
        <p className="text-muted-foreground text-sm">Reviews and posts from the archive</p>
      </div>

      {isOwn && <ComposerPlaceholder user={user} />}

      {isLoading && (
        <div className="divide-border space-y-0 divide-y">
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </div>
      )}

      {!isLoading && feed.length === 0 && <FeedEmptyState />}

      {!isLoading && feed.length > 0 && (
        <div className="divide-border border-t-border space-y-0 divide-y border-t">
          {feed.map((item) => (
            <FeedCard key={item.id} item={item} isOwn={isOwn} />
          ))}
        </div>
      )}
    </section>
  )
}
