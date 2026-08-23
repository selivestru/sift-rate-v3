import { toastApiError } from '~/common/api'
import { Button } from '~/common/ui/Button'

import { useFollowMutation } from '../hooks/useFollowMutation'
import { useUnfollowMutation } from '../hooks/useUnfollowMutation'
import type { FollowViewerStatus } from '../types/follow.types'

interface FollowButtonProps {
  userId: string
  username: string
  followStatus: FollowViewerStatus
}

export const FollowButton = ({ userId, username, followStatus }: FollowButtonProps) => {
  const followMutation = useFollowMutation(username)
  const unfollowMutation = useUnfollowMutation(username)

  const isPendingRequest = followStatus === 'PENDING'
  const isFollowing = followStatus === 'FOLLOWING' || followStatus === 'MUTUAL'
  const isLoading = followMutation.isPending || unfollowMutation.isPending

  const handleClick = async () => {
    if (isLoading) return

    try {
      if (isFollowing || isPendingRequest) {
        await unfollowMutation.mutateAsync(userId)
      } else {
        await followMutation.mutateAsync(userId)
      }
    } catch (error) {
      await toastApiError(error)
    }
  }

  if (isPendingRequest) {
    return (
      <Button
        aria-label={`Cancel follow request for @${username}`}
        variant="outline"
        className="w-37.5"
        isLoading={isLoading}
        onClick={handleClick}
      >
        <span className="group-hover/button:hidden">Requested</span>
        <span className="hidden group-hover/button:inline">Cancel request</span>
      </Button>
    )
  }

  if (isFollowing) {
    return (
      <Button
        aria-label={`Unfollow @${username}`}
        variant="secondary"
        className="w-37.5"
        isLoading={isLoading}
        onClick={handleClick}
      >
        <span className="group-hover/button:hidden">Following</span>
        <span className="hidden group-hover/button:inline">Unfollow</span>
      </Button>
    )
  }

  return (
    <Button
      className="w-37.5"
      isLoading={isLoading}
      onClick={handleClick}
      aria-label={`Follow @${username}`}
    >
      {followStatus === 'FOLLOWED_BY' ? 'Follow back' : 'Follow'}
    </Button>
  )
}
