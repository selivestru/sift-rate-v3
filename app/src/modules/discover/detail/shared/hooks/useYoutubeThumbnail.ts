import { useEffect, useState } from 'react'

const QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault'] as const

export const useYoutubeThumbnail = (videoId?: string) => {
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>('maxresdefault')

  useEffect(() => {
    if (!videoId) return

    let cancelled = false
    let index = 0

    const tryLoad = () => {
      const img = new Image()
      img.src = `https://img.youtube.com/vi/${videoId}/${QUALITIES[index]}.jpg`
      img.onload = () => {
        if (cancelled) return

        const isPlaceholder = img.naturalWidth === 120 && img.naturalHeight === 90

        if (isPlaceholder && index < QUALITIES.length - 1) {
          index += 1
          tryLoad()
        } else {
          setQuality(QUALITIES[index])
        }
      }
    }

    tryLoad()

    return () => {
      cancelled = true
    }
  }, [videoId])

  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}
