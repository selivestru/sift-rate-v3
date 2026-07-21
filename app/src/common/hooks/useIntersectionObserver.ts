import { useEffect, useRef } from 'react'

export const useIntersectionObserver = (callback: () => void, enabled: boolean) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const element = ref.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback()
      }
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [callback, enabled])

  return ref
}
