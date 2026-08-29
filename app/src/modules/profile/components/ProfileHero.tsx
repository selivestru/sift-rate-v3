import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { ProfileUser } from '../types/profile.types'

interface ProfileHeroProps {
  user: ProfileUser
}

export const ProfileHero = ({ user }: ProfileHeroProps) => {
  return (
    <div className="relative">
      <div className="relative p-6 max-md:px-4">
        <div className="flex items-end gap-5 max-md:gap-4">
          <Avatar className="ring-card size-32 ring-4 max-md:size-24">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username} />
            <AvatarFallback className="text-4xl max-md:text-2xl">
              {getFirstLetter(user.username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pb-1">
            <h1 className="truncate text-2xl font-bold tracking-tight max-md:text-xl">
              @{user.username}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
