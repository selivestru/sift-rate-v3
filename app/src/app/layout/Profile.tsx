import { Avatar, Dropdown, Label, Separator } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { useAuthStore } from '~/modules/auth'

export const Profile = () => {
  const navigate = useNavigate()

  const { username, email, avatarUrl } = useAuthStore((state) => state.user!)

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar>
          <Avatar.Image alt={username!} src={avatarUrl!} />
          <Avatar.Fallback delayMs={600}>{getFirstLetter(username ?? '')}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom right">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image alt={username!} src={avatarUrl!} />
              <Avatar.Fallback>{getFirstLetter(username ?? '')}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{username}</p>
              <p className="text-muted text-xs leading-none">{email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item
            id="profile"
            textValue="Profile"
            onAction={() =>
              navigate({
                to: '/$username',
                params: { username: username! },
              })
            }
          >
            <Label>Profile</Label>
          </Dropdown.Item>
          <Separator />
          <Dropdown.Item id="logout" textValue="Logout" variant="danger">
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Log Out</Label>
              <LogOut className="text-danger size-3.5" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
