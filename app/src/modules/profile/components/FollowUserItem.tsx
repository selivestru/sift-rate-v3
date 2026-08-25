import { Link } from '@tanstack/react-router'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'

import type { FollowUser } from '../types/follow.types'
import { FollowButton } from './FollowButton'

interface FollowUserItemProps {
  user: FollowUser
}

export const FollowUserItem = ({ user }: FollowUserItemProps) => {
  const currentUser = useAuthStore((state) => state.user)
  const isOwnRow = currentUser?.id === user.id

  return (
    <div className="hover:bg-muted/35 flex w-full items-center gap-3 px-4 py-4 transition-colors duration-300">
      <Link
        to="/$username"
        params={{ username: user.username }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Avatar size="lg">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
          <AvatarFallback>{getFirstLetter(user.username)}</AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold tracking-tight">
            {user.displayName}
          </span>
          <span className="text-muted-foreground block truncate text-sm">@{user.username}</span>
        </span>
      </Link>

      {!isOwnRow && (
        <FollowButton userId={user.id} username={user.username} followStatus={user.followStatus} />
      )}
    </div>
  )
}
