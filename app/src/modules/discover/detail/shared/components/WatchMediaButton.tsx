import { useIntlayer } from 'react-intlayer'

import type { MediaType } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'

interface WatchMediaButtonProps {
  mediaType: Extract<MediaType, 'MOVIE' | 'TV_SHOW'>
  kinopoiskId: string | null
}

export const WatchMediaButton = ({ kinopoiskId }: WatchMediaButtonProps) => {
  const content = useIntlayer('discover-detail')
  if (!kinopoiskId) return

  const href = `https://kinobox.in/movie/${kinopoiskId}`

  return (
    <Button
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
      variant="secondary"
    >
      {content.watch.value}
    </Button>
  )
}
