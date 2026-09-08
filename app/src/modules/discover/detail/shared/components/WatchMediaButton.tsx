import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'

interface WatchMediaButtonProps {
  kinopoiskId: string | null
  title: string
}

export const WatchMediaButton = ({ kinopoiskId, title }: WatchMediaButtonProps) => {
  const content = useIntlayer('discover-detail')

  const href = kinopoiskId
    ? `https://kinobox.in/movie/${kinopoiskId}`
    : `https://kinobox.in/search?query=${encodeURIComponent(title)}`

  return (
    <Button
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
      variant="secondary"
    >
      {content.watch.value}
    </Button>
  )
}
