import { Link } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

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
import { useAuthStore } from '~/modules/auth'

export const Profile = () => {
  const { username, email, avatarUrl } = useAuthStore((state) => state.user!)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <Avatar size="lg">
            <AvatarImage src={avatarUrl!} alt={username!} />
            <AvatarFallback>{getFirstLetter(username!)}</AvatarFallback>
          </Avatar>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              to="/$username"
              params={{ username: username! }}
              className="flex items-center gap-2"
            >
              <Avatar>
                <AvatarImage src={avatarUrl!} alt={username!} />
                <AvatarFallback>{getFirstLetter(username!)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0">
                <p className="text-sm font-medium">{username}</p>
                <p className="text-muted-foreground text-xs">{email}</p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger" className="justify-between">
            Log Out
            <LogOut />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
