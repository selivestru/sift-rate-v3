import { useIntlayer } from 'react-intlayer'

import { Button } from '~/common/ui/Button'

interface ListenOnSpotifyButtonProps {
  spotifyUrl: string | null
}

export const ListenOnSpotifyButton = ({ spotifyUrl }: ListenOnSpotifyButtonProps) => {
  const content = useIntlayer('discover-detail')

  if (!spotifyUrl) return

  const openSpotify = () => {
    const { pathname } = new URL(spotifyUrl)

    window.location.href = `spotify://${pathname.slice(1)}`

    setTimeout(() => {
      window.open(spotifyUrl, '_blank')
    }, 1000)
  }

  return (
    <Button variant="secondary" onClick={openSpotify}>
      {content.listenOnSpotify.value}
    </Button>
  )
}
