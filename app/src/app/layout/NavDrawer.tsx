import { MenuIcon } from 'lucide-react'

import { Button } from '~/common/ui/Button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '~/common/ui/Drawer'

import { Navigation } from './Navigation'

export const NavDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button
            isIconOnly
            variant="secondary"
            aria-label="Open menu"
            className="hidden max-md:flex"
          >
            <MenuIcon />
          </Button>
        }
      >
        <MenuIcon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <Navigation indicatorId="nav-drawer" />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
