import { Link } from '@tanstack/react-router'
import { Logout, Settings, User } from 'reicon-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/common/ui/DropdownMenu'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore, useLogout } from '~/modules/auth'

export const Profile = () => {
  const user = useAuthStore((state) => state.user!)
  const { logout } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <Avatar size="lg">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username ?? undefined} />
            <AvatarFallback>{getFirstLetter(user.username)}</AvatarFallback>
          </Avatar>
        }
      />
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="justify-between"
            render={<Link to="/$username" params={{ username: user.username! }} />}
          >
            Profile
            <User />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-between" render={<Link to="/settings/account" />}>
            Settings
            <Settings />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="justify-between" onClick={logout}>
            Log Out
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
