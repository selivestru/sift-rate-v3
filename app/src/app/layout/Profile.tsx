import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
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

import { ProfileLocaleSwitcher } from './ProfileLocaleSwitcher'

export const Profile = () => {
  const user = useAuthStore((state) => state.user!)
  const { logout } = useLogout()
  const shared = useIntlayer('shared')

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
            {shared.profile}
            <User />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-between" render={<Link to="/settings/account" />}>
            {shared.settings}
            <Settings />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ProfileLocaleSwitcher />
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" className="justify-between" onClick={logout}>
            {shared.logOut}
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
