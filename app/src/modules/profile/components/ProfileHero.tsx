import { Crown } from 'reicon-react'

import { subscriptionMeta } from '~/common/constants/subscriptions-meta'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Badge } from '~/common/ui/Badge'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { SUBSCRIPTIONS, useAuthStore } from '~/modules/auth'

import type { FollowViewerStatus } from '../types/follow.types'
import type { ProfileUser } from '../types/profile.types'
import { FollowButton } from './FollowButton'

interface ProfileHeroProps {
  user: ProfileUser
  followStatus: FollowViewerStatus
  followersCount: number
  followingCount: number
}

export const ProfileHero = ({
  user,
  followStatus,
  followersCount,
  followingCount,
}: ProfileHeroProps) => {
  const currentUser = useAuthStore((state) => state.user)
  const isOwnProfile = currentUser?.id === user.id
  const sub = subscriptionMeta[user.subscription]

  return (
    <div className="relative">
      <div className="from-primary/30 via-primary/10 to-accent/40 relative h-70 overflow-hidden bg-linear-to-br max-md:h-50 md:rounded-t-2xl">
        {user.bannerUrl && (
          <img src={user.bannerUrl} alt="" className="absolute inset-0 size-full object-cover" />
        )}
        <div className="from-card/80 absolute inset-0 bg-linear-to-t to-transparent" />
      </div>

      <div className="relative px-6 pt-0 pb-6 max-md:px-4">
        <div className="-mt-16 flex items-end gap-5 max-md:-mt-12 max-md:gap-4">
          <Avatar className="ring-card size-32 ring-4 max-md:size-24">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
            <AvatarFallback className="text-4xl max-md:text-2xl">
              {getFirstLetter(user.displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 items-end justify-between gap-4 pb-1">
            <div className="flex-1">
              <h1 className="truncate text-2xl font-bold tracking-tight max-md:text-xl">
                {user.displayName}
              </h1>
              <p className="text-muted-foreground truncate text-sm">@{user.username}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {sub.label && (
                  <Badge
                    size="sm"
                    color={sub.color}
                    startIcon={
                      user.subscription !== SUBSCRIPTIONS.FREE ? (
                        <Crown className="size-3.5" />
                      ) : undefined
                    }
                  >
                    {sub.label}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-2 text-sm tabular-nums">
                {followersCount} followers · {followingCount} following
              </p>
            </div>

            {currentUser && !isOwnProfile && (
              <FollowButton userId={user.id} username={user.username} followStatus={followStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
