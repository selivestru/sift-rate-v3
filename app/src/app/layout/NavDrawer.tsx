import { Button, Drawer } from '@heroui/react'
import { MenuIcon } from 'lucide-react'
import { useState } from 'react'

import { Navigation } from './Navigation'

export const NavDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        isIconOnly
        variant="secondary"
        aria-label="Open menu"
        onPress={() => setIsOpen(true)}
        className="hidden max-md:flex"
      >
        <MenuIcon />
      </Button>

      <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} variant="blur">
        <Drawer.Content placement="left">
          <Drawer.Dialog aria-label="Navigation">
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Menu</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <Navigation indicatorId="nav-drawer" onNavigate={() => setIsOpen(false)} />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  )
}
