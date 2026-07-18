import { useNavigate } from '@tanstack/react-router'

import { Button } from '~/common/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/common/ui/DropdownMenu'
import { useAuthStore } from '~/modules/auth'

// TODO: fix

export const Profile = () => {
  const navigate = useNavigate()

  const { username, email, avatarUrl } = useAuthStore((state) => state.user!)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    // <Dropdown>
    //   <Dropdown.Trigger>
    //     <Avatar>
    //       <Avatar.Image alt={username!} src={avatarUrl!} />
    //       <Avatar.Fallback delayMs={600}>{getFirstLetter(username ?? '')}</Avatar.Fallback>
    //     </Avatar>
    //   </Dropdown.Trigger>
    //   <Dropdown.Popover placement="bottom right">
    //     <div className="px-3 pt-3 pb-1">
    //       <div className="flex items-center gap-2">
    //         <Avatar size="sm">
    //           <Avatar.Image alt={username!} src={avatarUrl!} />
    //           <Avatar.Fallback>{getFirstLetter(username ?? '')}</Avatar.Fallback>
    //         </Avatar>
    //         <div className="flex flex-col gap-0">
    //           <p className="text-sm leading-5 font-medium">{username}</p>
    //           <p className="text-muted text-xs leading-none">{email}</p>
    //         </div>
    //       </div>
    //     </div>
    //     <Dropdown.Menu>
    //       <Dropdown.Item
    //         id="profile"
    //         textValue="Profile"
    //         onAction={() =>
    //           navigate({
    //             to: '/$username',
    //             params: { username: username! },
    //           })
    //         }
    //       >
    //         <Label>Profile</Label>
    //       </Dropdown.Item>
    //       <Separator />
    //       <Dropdown.Item id="logout" textValue="Logout" variant="danger">
    //         <div className="flex w-full items-center justify-between gap-2">
    //           <Label>Log Out</Label>
    //           <LogOut className="text-danger size-3.5" />
    //         </div>
    //       </Dropdown.Item>
    //     </Dropdown.Menu>
    //   </Dropdown.Popover>
    // </Dropdown>
  )
}
