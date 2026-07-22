import { Menu } from 'reicon-react'

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
            <Menu />
          </Button>
        }
      >
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <Navigation />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
