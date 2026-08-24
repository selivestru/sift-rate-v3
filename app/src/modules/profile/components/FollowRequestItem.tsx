import { Link } from '@tanstack/react-router'

import { toastApiError } from '~/common/api'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import { useAcceptFollowRequestMutation } from '../hooks/useAcceptFollowRequestMutation'
import { useRejectFollowRequestMutation } from '../hooks/useRejectFollowRequestMutation'
import type { FollowRequest } from '../types/follow.types'

interface FollowRequestItemProps {
  request: FollowRequest
}

export const FollowRequestItem = ({ request }: FollowRequestItemProps) => {
  const acceptMutation = useAcceptFollowRequestMutation()
  const rejectMutation = useRejectFollowRequestMutation()

  const isPending = acceptMutation.isPending || rejectMutation.isPending

  const handleAccept = async () => {
    if (isPending) return

    try {
      await acceptMutation.mutateAsync({
        followerId: request.id,
        notificationId: request.notificationId,
      })
    } catch (error) {
      await toastApiError(error)
    }
  }

  const handleReject = async () => {
    if (isPending) return

    try {
      await rejectMutation.mutateAsync({
        followerId: request.id,
        notificationId: request.notificationId,
      })
    } catch (error) {
      await toastApiError(error)
    }
  }

  return (
    <div className="hover:bg-muted/35 flex w-full items-center gap-3 px-4 py-4 transition-colors duration-300">
      <Link
        to="/$username"
        params={{ username: request.username }}
        className="flex flex-1 items-center gap-3"
      >
        <Avatar size="lg">
          <AvatarImage src={request.avatarUrl ?? undefined} alt={request.username} />
          <AvatarFallback>{getFirstLetter(request.username)}</AvatarFallback>
        </Avatar>
        <span>
          <span className="block truncate text-sm font-semibold tracking-tight">
            {request.displayName}
          </span>
          <span className="text-muted-foreground block truncate text-sm">@{request.username}</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="w-20"
          loadingVariant="icon"
          isLoading={acceptMutation.isPending}
          isDisabled={isPending}
          onClick={handleAccept}
          aria-label={`Accept follow request from @${request.username}`}
        >
          Accept
        </Button>
        <Button
          variant="destructive-soft"
          className="w-20"
          loadingVariant="icon"
          isLoading={rejectMutation.isPending}
          isDisabled={isPending}
          onClick={handleReject}
          aria-label={`Reject follow request from @${request.username}`}
        >
          Reject
        </Button>
      </div>
    </div>
  )
}
