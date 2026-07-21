import { useState } from 'react'

export interface UseDisclosureOptions {
  onClose?: () => void
  onOpen?: () => void
}

export interface UseDisclosureReturn {
  opened: boolean
  close: () => void
  open: () => void
  toggle: (value?: boolean) => void
}

export const useDisclosure = (
  initialValue = false,
  options?: UseDisclosureOptions,
): UseDisclosureReturn => {
  const [opened, setOpened] = useState(initialValue)

  const open = () => {
    setOpened((prev) => {
      if (!prev) {
        options?.onOpen?.()
        return true
      }
      return prev
    })
  }

  const close = () => {
    setOpened((prev) => {
      if (prev) {
        options?.onClose?.()
        return false
      }
      return prev
    })
  }

  const toggle = (value = !opened) => (value ? open() : close())

  return { opened, open, close, toggle }
}
