import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'

interface ListenOnSpotifyButtonProps {
  spotifyUrl: string | null
}

export const ListenOnSpotifyButton = ({ spotifyUrl }: ListenOnSpotifyButtonProps) => {
  const content = useIntlayer('discover-detail')
  if (!spotifyUrl) return

  return (
    <Button
      render={<a href={spotifyUrl} target="_blank" rel="noopener noreferrer" />}
      variant="secondary"
    >
      {content.listenOnSpotify.value}
    </Button>
  )
}
