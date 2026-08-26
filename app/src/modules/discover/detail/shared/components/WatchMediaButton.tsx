import type { MediaType } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'

interface WatchMediaButtonProps {
  mediaType: Extract<MediaType, 'MOVIE' | 'TV_SHOW'>
  kinopoiskId: string | null
}

export const WatchMediaButton = ({ kinopoiskId }: WatchMediaButtonProps) => {
  if (!kinopoiskId) return

  const href = `https://kinobox.in/movie/${kinopoiskId}`

  return (
    <Button
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
      variant="secondary"
    >
      Watch
    </Button>
  )
}
