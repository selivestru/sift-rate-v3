import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'
import { Skeleton } from '~/common/ui/Skeleton'

interface WatchMediaButtonProps {
  kinopoiskId: string | null
  title: string
  isLoading?: boolean
}

export const WatchMediaButton = ({
  kinopoiskId,
  title,
  isLoading = false,
}: WatchMediaButtonProps) => {
  const content = useIntlayer('discover-detail')

  if (isLoading) {
    return <Skeleton className="h-10 w-32 rounded-xl" aria-hidden />
  }

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
