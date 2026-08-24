import { useCallback, useRef } from 'react'

import { useMarkReadMutation } from './useMarkReadMutation'

export const useNotificationReadObserver = (id: string, isUnread: boolean) => {
  const { mutate: markRead } = useMarkReadMutation()
  const markedIdRef = useRef<string | null>(null)

  return useCallback(
    (node: HTMLElement | null) => {
      if (!node || !isUnread || markedIdRef.current === id) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            markedIdRef.current = id
            observer.disconnect()
            markRead([id])
          }
        },
        { threshold: 0.5 },
      )

      observer.observe(node)

      return () => observer.disconnect()
    },
    [id, isUnread, markRead],
  )
}
